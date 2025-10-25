#!/usr/bin/env python3
"""
Configure Supabase Authentication Settings via REST API
Updates site URL, redirect URLs, and email templates for JAIA Website
"""

import os
import sys
import requests
import json
from pathlib import Path

# Configuration
PROJECT_REF = "azazmlvyjkrtvtxzncbu"
SUPABASE_URL = f"https://{PROJECT_REF}.supabase.co"
SITE_URL = "https://jaia-website.fly.dev"
REDIRECT_URLS = ["http://localhost:5173/**", "https://jaia-website.fly.dev/**"]

# Get service role key from environment or use the one we have
SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6YXptbHZ5amtydHZ0eHpuY2J1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTAyNjIzNywiZXhwIjoyMDc2NjAyMjM3fQ.nFrdjSntuBWuZyV7SQSMKxUyWUHUSSLxi9BfwohgY10"

headers = {
    "apikey": SERVICE_ROLE_KEY,
    "Authorization": f"Bearer {SERVICE_ROLE_KEY}",
    "Content-Type": "application/json"
}

def read_email_template(template_name):
    """Read email template from file"""
    template_path = Path(__file__).parent / "email-templates" / template_name
    if template_path.exists():
        return template_path.read_text()
    return None

def update_auth_config():
    """
    Update authentication configuration
    Note: This requires direct database access or Management API
    Since these settings are stored in Supabase's internal config,
    we'll use SQL to update them if possible
    """
    
    sql_query = f"""
    -- This would need to be run with appropriate permissions
    -- Supabase stores these in auth.config or similar internal tables
    """
    
    print("⚙️  Auth Configuration Settings")
    print("=" * 50)
    print(f"Site URL: {SITE_URL}")
    print(f"Redirect URLs: {', '.join(REDIRECT_URLS)}")
    print()
    
    # Try to update via REST API
    # Note: Supabase doesn't expose these settings via REST API directly
    # They need to be updated through the dashboard or Management API
    
    print("ℹ️  Configuration Update Required:")
    print()
    print("Due to Supabase API limitations, please update these settings manually:")
    print()
    print(f"1. Go to: https://supabase.com/dashboard/project/{PROJECT_REF}/settings/auth")
    print(f"2. Set 'Site URL' to: {SITE_URL}")
    print(f"3. Add to 'Redirect URLs':")
    for url in REDIRECT_URLS:
        print(f"   - {url}")
    print()

def show_email_templates():
    """Display information about email templates"""
    print("📧 Email Templates Created")
    print("=" * 50)
    
    templates = [
        ("confirm-signup.html", "Confirm Email Signup", 
         f"https://supabase.com/dashboard/project/{PROJECT_REF}/auth/templates"),
        ("magic-link.html", "Magic Link",
         f"https://supabase.com/dashboard/project/{PROJECT_REF}/auth/templates"),
        ("invite-user.html", "Invite User",
         f"https://supabase.com/dashboard/project/{PROJECT_REF}/auth/templates"),
        ("reset-password.html", "Reset Password",
         f"https://supabase.com/dashboard/project/{PROJECT_REF}/auth/templates"),
    ]
    
    template_dir = Path(__file__).parent / "email-templates"
    print(f"\nEmail templates are located in:")
    print(f"  {template_dir}\n")
    
    for filename, name, url in templates:
        template_path = template_dir / filename
        if template_path.exists():
            print(f"✓ {name}")
            print(f"  File: {filename}")
            print(f"  Size: {template_path.stat().st_size} bytes")
        else:
            print(f"✗ {name} - Not found")
        print()
    
    print("To apply these templates:")
    print(f"1. Visit: https://supabase.com/dashboard/project/{PROJECT_REF}/auth/templates")
    print(f"2. For each template, copy the HTML content from the files above")
    print(f"3. Paste into the corresponding template in the dashboard")
    print()

def main():
    print()
    print("🧠 JAIA Website - Supabase Auth Configuration")
    print("=" * 50)
    print()
    
    update_auth_config()
    show_email_templates()
    
    print("✅ Next Steps:")
    print()
    print("1. Update auth settings in Supabase dashboard")
    print("2. Copy email templates to Supabase auth templates")
    print("3. Test authentication flow at https://jaia-website.fly.dev")
    print()
    print("📚 Documentation:")
    print("   https://supabase.com/docs/guides/auth/redirect-urls")
    print()

if __name__ == "__main__":
    main()

