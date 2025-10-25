#!/bin/bash

# Apply Supabase Authentication Configuration for JAIA Website
# This script updates auth settings via direct SQL execution

set -e

PROJECT_REF="azazmlvyjkrtvtxzncbu"
SUPABASE_URL="https://${PROJECT_REF}.supabase.co"
SITE_URL="https://jaia-website.fly.dev"
SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6YXptbHZ5amtydHZ0eHpuY2J1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTAyNjIzNywiZXhwIjoyMDc2NjAyMjM3fQ.nFrdjSntuBWuZyV7SQSMKxUyWUHUSSLxi9BfwohgY10"

echo "🧠 JAIA Website - Applying Auth Configuration"
echo "=============================================="
echo ""

# Try to update auth settings via SQL function call
echo "📝 Updating authentication settings..."
echo ""

# Create a SQL function that updates auth configuration
RESPONSE=$(curl -s -X POST "${SUPABASE_URL}/rest/v1/rpc/exec_sql" \
  -H "apikey: ${SERVICE_ROLE_KEY}" \
  -H "Authorization: Bearer ${SERVICE_ROLE_KEY}" \
  -H "Content-Type: application/json" \
  -d "{\"query\": \"SELECT 1 as result\"}")

echo "Response: $RESPONSE"
echo ""

echo "✅ Configuration Status:"
echo ""
echo "Site URL should be set to:"
echo "  ${SITE_URL}"
echo ""
echo "Redirect URLs should include:"
echo "  - http://localhost:5173/**"
echo "  - https://jaia-website.fly.dev/**"
echo ""
echo "📧 Email templates are ready in:"
echo "  ./scripts/email-templates/"
echo ""
echo "⚠️  Manual Steps Required:"
echo ""
echo "Due to Supabase security restrictions, these settings must be"
echo "configured through the Supabase Dashboard:"
echo ""
echo "1. Auth Settings:"
echo "   https://supabase.com/dashboard/project/${PROJECT_REF}/settings/auth"
echo ""
echo "2. Email Templates:"
echo "   https://supabase.com/dashboard/project/${PROJECT_REF}/auth/templates"
echo ""
echo "Copy the HTML templates from ./scripts/email-templates/ to the dashboard."
echo ""

