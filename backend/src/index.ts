import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isDev = process.env.NODE_ENV !== 'production';

// Supabase client (service role for backend operations)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

// Resend client for email
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Fygaro webhook secret
const fygaroSecret = process.env.FYGARO_WEBHOOK_SECRET;

// Fygaro signature verification (per Fygaro docs)
function verifyFygaroSignature(signature: string, rawBody: string, secret: string): boolean {
  // Parse signature header: t=timestamp,v1=hash,v1=hash...
  const parts = signature.split(',');
  let timestamp: string | null = null;
  const hashes: string[] = [];

  for (const part of parts) {
    const [key, value] = part.split('=');
    if (key === 't') timestamp = value;
    if (key === 'v1') hashes.push(value);
  }

  if (!timestamp || hashes.length === 0) {
    return false;
  }

  // Optional: Check timestamp is within 5 minutes (replay protection)
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - parseInt(timestamp)) > 300) {
    console.error('Fygaro webhook timestamp too old');
    return false;
  }

  // Compute expected HMAC: message = timestamp + "." + rawBody
  const message = `${timestamp}.${rawBody}`;
  const expected = crypto.createHmac('sha256', secret).update(message).digest('hex');

  // Check if any v1 hash matches (constant-time comparison)
  for (const hash of hashes) {
    if (crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(hash))) {
      return true;
    }
  }

  return false;
}

// Middleware - webhook route needs raw body for signature verification
app.use('/api/webhooks/fygaro', express.raw({ type: 'application/json' }));
app.use(cors());
app.use(express.json());

// API Routes
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Example API endpoint
app.get('/api/events', (req: Request, res: Response) => {
  // Mock events data
  res.json([
    {
      id: 1,
      title: 'JAIA General Meeting',
      location: 'Zoom',
      description: 'We will be discussing upcoming events and our new realtime lawbot. Join us for this exciting meeting.',
      date: '13th April 2025, 8pm - 9pm EST'
    },
    {
      id: 2,
      title: 'JAIA Workshop',
      location: 'Discord',
      description: 'Join us for our first meeting of the year as we discuss plans going forward and events we have planned.',
      date: '19th April 2025, 8pm'
    }
  ]);
});

// Project inquiry endpoint
app.post('/api/project-inquiry', async (req: Request, res: Response) => {
  // Check if Resend is configured
  if (!resend) {
    console.error('Resend API key not configured');
    res.status(500).json({ error: 'Email service not configured' });
    return;
  }

  // Validate request body
  const { name, email, company, message } = req.body;

  if (!name || !email || !company || !message) {
    res.status(400).json({ error: 'All fields are required' });
    return;
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ error: 'Invalid email format' });
    return;
  }

  try {
    // Read email template
    const templatePath = path.join(__dirname, '../../scripts/email-templates/project-inquiry.html');
    let emailHtml = await fs.readFile(templatePath, 'utf-8');

    // Replace placeholders
    emailHtml = emailHtml.replace(/{{name}}/g, name);
    emailHtml = emailHtml.replace(/{{email}}/g, email);
    emailHtml = emailHtml.replace(/{{company}}/g, company);
    emailHtml = emailHtml.replace(/{{message}}/g, message);

    // Send email to both client and admin to start the conversation thread
    const result = await resend.emails.send({
      from: 'JAIA <no-reply@notifications.jaia.org.jm>',
      to: [email, 'admin@jaia.org.jm'],
      subject: `New Business Inquiry from ${company}`,
      html: emailHtml,
      replyTo: 'admin@jaia.org.jm', // Replies go to admin, not no-reply
    });

    console.log('Project inquiry email sent:', result);
    res.status(200).json({ success: true, message: 'Inquiry sent successfully' });
  } catch (error) {
    console.error('Error sending project inquiry email:', error);
    res.status(500).json({ error: 'Failed to send inquiry' });
  }
});

// Fygaro webhook endpoint for payment notifications
app.post('/api/webhooks/fygaro', async (req: Request, res: Response) => {
  // Check if services are configured
  if (!fygaroSecret) {
    console.error('Fygaro webhook secret not configured');
    res.status(500).json({ error: 'Webhook not configured' });
    return;
  }

  if (!supabase) {
    console.error('Supabase not configured');
    res.status(500).json({ error: 'Database not configured' });
    return;
  }

  // Verify signature
  const signature = req.headers['fygaro-signature'] as string;
  if (!signature) {
    console.error('Missing Fygaro-Signature header');
    res.status(400).json({ error: 'Missing signature' });
    return;
  }

  const rawBody = req.body.toString();
  
  if (!verifyFygaroSignature(signature, rawBody, fygaroSecret)) {
    console.error('Invalid Fygaro webhook signature');
    res.status(400).json({ error: 'Invalid signature' });
    return;
  }

  // Parse the payload
  const payload = JSON.parse(rawBody);
  console.log('Fygaro payment received:', payload.transactionId);

  const {
    transactionId,
    reference,
    amount,
    currency,
    client,
    createdAt
  } = payload;

  const clientEmail = client?.email;

  if (!clientEmail) {
    console.error('No client email in payment payload');
    res.status(400).json({ error: 'Missing client email' });
    return;
  }

  // Find the user by email
  const { data: authUser, error: authError } = await supabase.auth.admin.listUsers();
  
  if (authError) {
    console.error('Error fetching users:', authError);
    res.status(500).json({ error: 'Database error' });
    return;
  }

  const user = authUser.users.find(u => u.email?.toLowerCase() === clientEmail.toLowerCase());
  const userId = user?.id || null;

  // Insert payment record
  const { error: paymentError } = await supabase
    .from('payments')
    .insert({
      user_id: userId,
      transaction_id: transactionId,
      amount: parseFloat(amount),
      currency: currency || 'JMD',
      status: 'completed',
      fygaro_reference: reference,
      client_email: clientEmail
    });

  if (paymentError) {
    // Check if it's a duplicate transaction
    if (paymentError.code === '23505') {
      console.log('Duplicate transaction, already processed:', transactionId);
      res.status(200).json({ status: 'already_processed' });
      return;
    }
    console.error('Error inserting payment:', paymentError);
    res.status(500).json({ error: 'Failed to record payment' });
    return;
  }

  // If we found the user, update their membership status
  if (userId) {
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1); // Annual membership

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        membership_status: 'active',
        membership_expiry_date: expiryDate.toISOString()
      })
      .eq('id', userId);

    if (updateError) {
      console.error('Error updating membership status:', updateError);
      // Don't fail the webhook - payment was recorded
    } else {
      console.log('Membership activated for user:', userId, 'until:', expiryDate);
    }
  } else {
    console.log('Payment recorded but no matching user found for email:', clientEmail);
  }

  // Must respond 200 for Fygaro to mark webhook as successful
  res.status(200).json({ status: 'ok', transactionId });
});

// In production, serve the static files from the React app
if (!isDev) {
  const frontendPath = path.join(__dirname, '../../frontend/dist');
  app.use(express.static(frontendPath));
  
  // All other requests return the React app (handle client-side routing)
  app.use((req: Request, res: Response) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  if (isDev) {
    console.log('📝 Development mode - API only');
  } else {
    console.log('🎉 Production mode - Serving frontend');
  }
});
// Force rebuild
