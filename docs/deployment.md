# Deployment Guide

This guide covers how the JAIA website is deployed and hosted.

## 🚀 Current Hosting

The JAIA website is hosted on **[Fly.io](https://fly.io)**, a modern platform for deploying full-stack applications globally.

**Key Features:**
- ✅ Always-on deployment (no cold starts)
- ✅ Automatic HTTPS/SSL certificates
- ✅ Global CDN for fast performance
- ✅ Deployed in Dallas (DFW region - close to Jamaica)
- ✅ Automatic health checks and monitoring

## 🌐 Live Site

Visit the production site at: **[https://jaia-website.fly.dev](https://jaia-website.fly.dev)**

## 📞 Deployment Support

Deployment and infrastructure are managed by the JAIA technical team. If you notice any issues with the live site or have questions about deployment:

- **Report Issues**: [Open a GitHub issue](https://github.com/your-repo/issues)
- **Discord**: [Join our server](https://discord.gg/NuVXk7yjNz) and ask in the #tech-support channel
- **WhatsApp**: [Contact the community](https://chat.whatsapp.com/FFzjagZ0ZxRCCHaNMjJODm)
- **Email**: [Contact JAIA directly]

## 🛠️ For Developers: Understanding the Setup

### Architecture

The JAIA website is deployed as a single full-stack application:

```
Fly.io Machine (Miami Region)
├── Express Server (Port 3000)
│   ├── Serves static frontend files
│   └── Handles API endpoints (/api/*)
└── Always running (min_machines_running = 1)
```

### Why Fly.io?

1. **Geographic Proximity**: Dallas (DFW) datacenter provides low latency to Jamaica
2. **No Cold Starts**: Configured to keep at least one machine always running
3. **Cost Effective**: Generous free tier for small projects
4. **Developer Friendly**: Simple deployments with `flyctl`
5. **Built-in Features**: HTTPS, health checks, and monitoring included

### Configuration

The deployment is configured via `fly.toml` in the project root:

**Key Settings:**
- **Region**: `dfw` (Dallas) - close to Jamaica
- **Always On**: `min_machines_running = 1` keeps at least one machine active
- **Health Checks**: Monitors `/api/health` endpoint every 10 seconds
- **Resources**: 1 shared CPU, 256MB RAM (scalable as needed)

## 👨‍💻 For Maintainers: Deployment Instructions

### Prerequisites

1. **Install Fly CLI**:
   ```bash
   # macOS/Linux
   curl -L https://fly.io/install.sh | sh
   
   # Windows
   powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
   ```

2. **Login to Fly.io**:
   ```bash
   flyctl auth login
   ```

3. **Access**: You need to be added to the JAIA organization on Fly.io

### Initial Setup (Already Done)

This is for reference - the app is already configured:

```bash
# Create the app
flyctl apps create jaia-website

# Set secrets (environment variables)
flyctl secrets set NODE_ENV=production

# Deploy
flyctl deploy
```

### Deploying Updates

When code is updated in the main branch:

```bash
# Make sure you're in the project root
cd JAIA-Website

# Build and deploy
flyctl deploy

# Watch deployment status
flyctl status

# View logs
flyctl logs
```

### Deployment Process

When you run `flyctl deploy`:

1. Fly.io reads the `fly.toml` configuration
2. Runs `npm run build` (builds both frontend and backend)
3. Creates a Docker image with the built files
4. Deploys to the Miami region
5. Runs health checks on `/api/health`
6. Routes traffic to the new deployment
7. Keeps old deployment running until new one is healthy (zero-downtime)

### Useful Commands

```bash
# Check app status
flyctl status

# View real-time logs
flyctl logs

# View app information
flyctl info

# SSH into the machine (for debugging)
flyctl ssh console

# Scale resources if needed
flyctl scale vm shared-cpu-1x --memory 512

# View metrics and monitoring
flyctl dashboard

# Restart the app
flyctl apps restart jaia-website
```

### Environment Variables

Set secrets via Fly.io (never commit secrets!):

```bash
# Set a secret
flyctl secrets set SECRET_NAME=secret_value

# List secrets (values are hidden)
flyctl secrets list

# Remove a secret
flyctl secrets unset SECRET_NAME
```

### Custom Domain Setup

To use a custom domain (e.g., jaia.org.jm):

```bash
# Add certificate for your domain
flyctl certs create jaia.org.jm
flyctl certs create www.jaia.org.jm

# Fly will provide DNS records to add
flyctl certs show jaia.org.jm
```

Then add the provided DNS records to your domain registrar.

### Monitoring

**Built-in Monitoring:**
- Health checks run every 10 seconds
- Automatic alerts if health checks fail
- View metrics at: https://fly.io/apps/jaia-website/metrics

**What's Monitored:**
- HTTP response times
- CPU and memory usage
- Request counts and error rates
- Health check status

### Scaling

If the site gets more traffic:

```bash
# Scale horizontally (add more machines)
flyctl scale count 2

# Scale vertically (more resources per machine)
flyctl scale vm shared-cpu-2x --memory 512

# Auto-scale based on load (if needed)
flyctl autoscale set min=1 max=3
```

### Troubleshooting

**Deployment fails?**
```bash
# Check build logs
flyctl logs

# Try rebuilding locally first
npm run build

# Verify fly.toml is valid
flyctl config validate
```

**App not responding?**
```bash
# Check machine status
flyctl status

# View recent logs
flyctl logs

# Restart the app
flyctl apps restart jaia-website

# SSH into machine for debugging
flyctl ssh console
```

**Health checks failing?**
```bash
# Test health endpoint locally
curl https://jaia-website.fly.dev/api/health

# Check if backend is running
flyctl ssh console
# Then: curl localhost:3000/api/health
```

### Rollback

If a deployment has issues:

```bash
# List deployment history
flyctl releases

# Rollback to previous version
flyctl releases rollback
```

## 🔐 Security Best Practices

1. **Never commit secrets** to Git (use `flyctl secrets set`)
2. **Use environment variables** for configuration
3. **Keep dependencies updated** (`npm audit` and `npm update`)
4. **Review PRs carefully** before merging to main
5. **Monitor logs** for suspicious activity

## 📊 Performance Optimization

The current setup is optimized for:

- ✅ **Fast response times** (Miami region for low latency to Jamaica)
- ✅ **No cold starts** (always-on configuration)
- ✅ **Static asset caching** (Express serves built frontend efficiently)
- ✅ **Compression** (gzip enabled in Express)

### Future Improvements

As the site grows, consider:

- **CDN**: Add Cloudflare for global caching
- **Database**: Connect to a managed database for dynamic content
- **Caching**: Add Redis for API response caching
- **Monitoring**: Set up Sentry for error tracking

## 📚 Additional Resources

- **[Fly.io Documentation](https://fly.io/docs/)** - Complete Fly.io guide
- **[flyctl CLI Reference](https://fly.io/docs/flyctl/)** - All CLI commands
- **[Fly.io Node.js Guide](https://fly.io/docs/languages-and-frameworks/node/)** - Node.js specific docs
- **[Fly.io Pricing](https://fly.io/docs/about/pricing/)** - Understanding costs

## 💡 Cost Estimation

Current configuration:
- **1 shared CPU machine**: ~$2-5/month
- **256MB RAM**: Included in machine cost
- **Outbound bandwidth**: First 100GB free
- **SSL certificates**: Free

Total estimated cost: **$2-5/month** (well within free tier for low traffic)

---

**Questions about deployment?** Contact the JAIA technical team through any of the channels above! 🚀

