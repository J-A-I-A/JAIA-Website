# JAIA Website 🇯🇲

Welcome! This is the official website for the **Jamaica Artificial Intelligence Association (JAIA)** - a community dedicated to promoting and advancing AI technology in Jamaica.

## 🌟 About This Project

This website serves two purposes:

1. **For the Community**: A hub where people can learn about JAIA, join our events, explore our AI projects, and connect with Jamaica's growing AI community.

2. **For Learners**: An open-source example of how modern websites are built. Whether you're curious about web development or learning to code, you can explore the code, see how everything connects, and even contribute!

### What's Inside

- **Home Page**: Learn about JAIA and join our WhatsApp community
- **Services**: AI training, consultation, and development services
- **Projects**: Real AI projects solving Jamaican problems (like LawBot and Patois Speech Recognition)
- **Team**: Meet the passionate people behind JAIA
- **Events**: Upcoming workshops and meetups
- **Contact**: Ways to get in touch with us

## 🚀 Getting Started

Ready to explore? We have guides for everyone:

### 📘 [Getting Started Guide](./docs/getting-started.md)
**Perfect for beginners!** Step-by-step instructions for getting the website running on your computer. We explain everything from installing Node.js to making your first change.

**What you'll learn:**
- How to install the necessary tools (Node.js, Git, Code Editor)
- How to download and run the website
- How to make changes and see them update live
- Where to get help if you're stuck

👉 **[Start here if you're new to coding →](./docs/getting-started.md)**

### 🛠️ [Development Guide](./docs/development-guide.md)
**For developers and contributors.** Technical documentation covering architecture, available commands, deployment, and how to add features.

**What's included:**
- Complete tech stack overview
- Architecture and project structure
- All available commands and scripts
- How to add new features and components
- Styling guide and color theme details
- API development and deployment instructions

👉 **[Read the development guide →](./docs/development-guide.md)**

## 🎨 What Makes This Website Special

### Built with Modern Tools
This isn't just any website - it's built with the same professional tools used by companies like Facebook, Netflix, and Airbnb:

- **React**: Makes the website fast and interactive
- **TypeScript**: Helps catch errors before they happen
- **Tailwind CSS**: Beautiful styling with Jamaican-inspired colors (gold and green!)
- **Vite**: Super-fast development experience

## 📚 How It Works Behind the Scenes

Curious about how websites work? Here's a simple explanation:

### The Two Main Parts

**1. Frontend (What You See)** 👁️
- Located in the `frontend/` folder
- This is everything you see and interact with - buttons, text, images, forms
- Written in React, which makes pages interactive without reloading
- Styles use Tailwind CSS for responsive, mobile-friendly design

**2. Backend (The Brain)** 🧠
- Located in the `backend/` folder
- This is the server that handles things like storing event data
- Provides an API (a way for the frontend to request information)
- Built with Express.js, a popular Node.js framework

### How They Talk to Each Other

```
You → Frontend (React) → Backend (Express) → Database → Back to You
       [Browser]           [Server]
```

When you visit the site, your browser loads the Frontend. When you need data (like upcoming events), the Frontend asks the Backend, which fetches the data and sends it back.

### The File Structure

```
JAIA-Website/
├── frontend/              # The visual website
│   ├── src/
│   │   ├── components/    # Reusable pieces (buttons, cards, etc.)
│   │   ├── pages/         # Different pages (Home, Projects, etc.)
│   │   └── data/          # Project information and content
│   └── public/            # Images and static files
│
├── backend/               # The server
│   └── src/
│       └── index.ts       # Server code
│
└── package.json           # Lists all the tools we use
```

### Key Concepts

**Components**: Think of these like LEGO blocks. We build small pieces (like a button or a card) and combine them to make full pages. Check out `frontend/src/components/` to see examples.

**Routing**: When you click "Projects" or "Contact", you move between different pages. This is handled by React Router (see `frontend/src/App.tsx`).

**Styling**: We use Tailwind CSS, which lets us add styles directly in our code using simple class names like `bg-primary` (background color) or `rounded-lg` (rounded corners).

**API**: The backend provides endpoints like `/api/events` that the frontend can call to get data. It's like having a menu of actions the frontend can request.

## 🤓 Quick Reference

### Common Commands

```bash
# Run the website locally
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

See the [Development Guide](./docs/development-guide.md) for all available commands and options.

### Project Structure

```
JAIA-Website/
├── frontend/         # React app (what you see)
├── backend/          # Express server (the API)
├── docs/            # Documentation
└── package.json     # Project scripts
```

Explore the [Development Guide](./docs/development-guide.md) for detailed architecture information.

## 🤝 Contributing

We welcome contributions from everyone, whether you're fixing a typo, adding a feature, or improving documentation!

**Ways to Contribute:**
- 🐛 Report bugs or issues
- 💡 Suggest new features or improvements
- 📝 Improve documentation
- 🎨 Enhance the design
- 🔧 Fix issues or add features

**Getting Started:**
1. Fork this repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### For Non-Developers

You can still help! If you notice something that could be better explained, a broken link, or have ideas for content, please [open an issue](../../issues) and tell us about it.

## 📖 Documentation

- **[Getting Started Guide](./docs/getting-started.md)** - Complete beginner-friendly setup guide
- **[Development Guide](./docs/development-guide.md)** - Technical documentation for developers
- **[Deployment Guide](./docs/deployment.md)** - How the site is hosted and deployed
- **[Projects README](./frontend/PROJECTS_README.md)** - How to add and manage projects

## 🌐 Live Website

Visit the live site at: **[jaia-website.fly.dev](https://jaia-website.fly.dev)**

## 📞 Connect With JAIA

- **WhatsApp Community**: [Join Here](https://chat.whatsapp.com/FFzjagZ0ZxRCCHaNMjJODm)
- **Discord**: [Join Server](https://discord.gg/NuVXk7yjNz)
- **YouTube**: [@JAIA876](https://www.youtube.com/channel/UCImUF-AEYy3egB1otVuSJbQ)
- **Twitter**: [@jaia_876](https://twitter.com/jaia_876)
- **Facebook**: [JAIA Community](https://www.facebook.com/groups/458315652207268)

## 📄 License

© 2025 Jamaica Artificial Intelligence Association. All rights reserved.

---

**Built with ❤️ by JAIA** | **Learning Together** 🇯🇲

