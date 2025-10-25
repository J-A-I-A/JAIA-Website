#!/bin/bash

# Update Supabase Authentication Settings for JAIA Website
# This script updates the site URL and creates custom email templates

set -e

PROJECT_REF="azazmlvyjkrtvtxzncbu"
SITE_URL="https://jaia-website.fly.dev"
REDIRECT_URLS="http://localhost:5173/**,https://jaia-website.fly.dev/**"

echo "🔧 Updating Supabase Auth Configuration for JAIA Website..."
echo ""
echo "Project: $PROJECT_REF"
echo "Site URL: $SITE_URL"
echo "Redirect URLs: $REDIRECT_URLS"
echo ""

# Note: The Supabase CLI doesn't provide direct commands to update auth config
# These settings need to be updated via the Supabase Dashboard:
# https://supabase.com/dashboard/project/${PROJECT_REF}/settings/auth

echo "📝 Please update the following settings in your Supabase Dashboard:"
echo ""
echo "1. Go to: https://supabase.com/dashboard/project/${PROJECT_REF}/settings/auth"
echo ""
echo "2. Update 'Site URL' to:"
echo "   ${SITE_URL}"
echo ""
echo "3. Update 'Redirect URLs' to:"
echo "   ${REDIRECT_URLS}"
echo ""
echo "4. Go to: https://supabase.com/dashboard/project/${PROJECT_REF}/auth/templates"
echo ""
echo "5. Update email templates using the templates in ./scripts/email-templates/"
echo ""
echo "✅ Once updated, authentication emails will redirect to the production site!"

