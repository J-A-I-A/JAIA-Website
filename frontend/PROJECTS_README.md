# Projects System Documentation

This document explains how to add and manage project pages on the JAIA website.

## Overview

The projects system is built with:
- **React Router** for routing between pages
- **Markdown** for content authoring
- **Template-based rendering** for consistent presentation
- **Automatic routing** based on project metadata

## Project Structure

```
frontend/
├── src/
│   ├── data/
│   │   └── projects/
│   │       ├── index.ts           # Project metadata
│   │       ├── lawbot.md          # Lawbot project content
│   │       ├── finance-bot.md     # Finance Bot content
│   │       ├── patois-speech.md   # Patois Speech content
│   │       └── music-filter.md    # Music Filter content
│   ├── pages/
│   │   ├── ProjectsPage.tsx       # Main projects listing
│   │   ├── ProjectTemplate.tsx    # Individual project page template
│   │   └── HomePage.tsx           # Homepage
│   └── components/
│       └── sections/
│           └── Projects.tsx       # Projects section on homepage
```

## Adding a New Project

### Step 1: Add Project Metadata

Edit `src/data/projects/index.ts` and add your project to the `projects` array:

```typescript
{
  id: 'my-project',              // URL-friendly identifier
  title: 'My Project',           // Display title
  description: 'Brief summary',  // Short description
  icon: '🚀',                     // Emoji icon
  date: 'January 2025',          // Project date/status
  tags: ['AI', 'Education'],     // Technology tags
}
```

### Step 2: Create Markdown Content

Create a new file at `src/data/projects/my-project.md` with your project content:

```markdown
# My Project

## Overview

Write your project overview here...

## Key Features

- Feature 1
- Feature 2

## Technology Stack

Describe the technologies used...
```

### Step 3: Done!

The routing is automatic. Your project will now appear at:
- **Homepage**: In the projects section (first 4 projects)
- **Projects Page**: `/projects` (all projects)
- **Individual Page**: `/projects/my-project`

## Markdown Formatting

The project pages support:

### Headers
```markdown
# H1 - Main Title
## H2 - Section Title
### H3 - Subsection Title
```

### Lists
```markdown
- Bullet point
- Another point

1. Numbered item
2. Another item
```

### Text Formatting
```markdown
**Bold text**
*Italic text*
`Code inline`
```

### Blockquotes
```markdown
> This is a quote
```

### Links
```markdown
[Link text](https://example.com)
```

### Horizontal Rule
```markdown
---
```

## Styling

The markdown is automatically styled with:
- Responsive typography
- Proper spacing and margins
- Dark mode support
- Consistent color scheme matching the site

## Best Practices

1. **Keep descriptions concise** - The description shows on cards
2. **Use clear headers** - Helps with readability and navigation
3. **Add relevant tags** - Helps users find related projects
4. **Include images sparingly** - Focus on content
5. **Update dates** - Keep project status current

## Example Project Structure

A good project page typically includes:

1. **Title** - Main project name (auto-generated from metadata)
2. **Overview** - What the project is about
3. **The Problem** - What challenge it addresses
4. **Our Solution** - How the project solves it
5. **Key Features** - Main capabilities
6. **Technology Stack** - Technologies used
7. **Impact** - Results or goals
8. **Future Development** - Next steps
9. **Get Involved** - How others can participate

## Tips

- Use the Lawbot project (`lawbot.md`) as a reference
- Test your markdown locally before committing
- Keep paragraphs short for better readability
- Use emoji icons that relate to your project theme
- Update the project order in `index.ts` to feature important projects first

## Troubleshooting

**Project not showing up?**
- Check that the `id` in metadata matches the filename (without `.md`)
- Ensure the markdown file is in `src/data/projects/`
- Verify there are no syntax errors in `index.ts`

**Markdown not rendering correctly?**
- Check markdown syntax (extra spaces, missing line breaks)
- Ensure special characters are properly escaped
- Use standard markdown - avoid HTML when possible

**Routing issues?**
- Clear browser cache
- Restart the dev server
- Check that React Router is properly configured in `App.tsx`

