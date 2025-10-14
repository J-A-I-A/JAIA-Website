# Getting Started with JAIA Website

Want to run this website on your own computer? Follow along - we'll explain everything step by step!

## Prerequisites: What You'll Need

Before we start, you'll need to install a few free tools. Don't worry if you've never heard of these!

### 1. Install Node.js (The Engine)

Node.js is what runs JavaScript code on your computer (not just in a browser). Think of it as the engine that powers this website.

- **Download**: Visit [nodejs.org](https://nodejs.org/)
- **Which version?**: Download the **LTS version** (the green button - it means "Long Term Support" and is the most stable)
- **Install**: Run the installer and follow the prompts (default settings are fine!)
- **Verify**: Open your Terminal/Command Prompt and type `node --version`. If you see a version number, you're good! 🎉

**New to Terminal?** 
- **Mac**: Press `Command + Space`, type "Terminal", and press Enter
- **Windows**: Press `Windows Key`, type "Command Prompt" or "PowerShell", and press Enter

👉 **Learn more**: [What is Node.js?](https://nodejs.org/en/learn/getting-started/introduction-to-nodejs)

### 2. Install Git (The Download Tool)

Git is a tool that lets you download (and track changes to) code. Think of it like a special download manager for developers.

- **Download**: Visit [git-scm.com](https://git-scm.com/downloads)
- **Install**: Run the installer (default settings work great!)
- **Verify**: In your Terminal/Command Prompt, type `git --version`. See a version number? Perfect! ✅

**Don't want to use Terminal?** You can also use [GitHub Desktop](https://desktop.github.com/) - a visual tool that makes Git easier!

👉 **Learn more**: [Git Tutorial for Beginners](https://www.freecodecamp.org/news/git-and-github-for-beginners/)

### 3. Get a Code Editor (Optional but Helpful)

While you can view the code in any text editor, these make it much nicer:

- **[VS Code](https://code.visualstudio.com/)** (Most popular, free, works everywhere)
- **[Cursor](https://cursor.sh/)** (Like VS Code but with AI assistance)

## Step 1: Download This Website's Code

Now let's get the code onto your computer!

### Option A: Using Git (Recommended)

Open your Terminal/Command Prompt and run these commands:

```bash
# Navigate to where you want to save the code
# For example, your Documents folder:
cd Documents

# Download the code (replace <repository-url> with the actual URL)
git clone <repository-url>

# Enter the project folder
cd JAIA-Website
```

### Option B: Download as ZIP

1. Click the green **"Code"** button at the top of the GitHub page
2. Click **"Download ZIP"**
3. Unzip the file to a location you'll remember (like your Documents folder)
4. Open Terminal/Command Prompt and navigate to that folder:
   ```bash
   cd path/to/JAIA-Website
   ```

## Step 2: Install Dependencies

"Dependencies" are all the pre-built tools and libraries this website uses. Think of it like installing all the ingredients before you cook!

In your Terminal (make sure you're in the JAIA-Website folder), run:

```bash
npm run install:all
```

This might take a few minutes. You'll see lots of text flying by - that's normal! ☕

**What's happening?** `npm` (Node Package Manager) is downloading and installing hundreds of small code packages that this website needs to work.

## Step 3: Start the Website

Now for the magic moment! Run this command:

```bash
npm run dev
```

You should see something like:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

**Open your web browser** (Chrome, Firefox, Safari, etc.) and go to:
```
http://localhost:5173
```

🎉 **You did it!** The website is now running on your computer! 

**What's localhost?** It's a special address that means "this computer". Port `5173` is like an apartment number - it's where this specific website lives on your computer.

## Step 4: Making Changes (Optional)

Want to see how everything works? Try this:

1. Open the project in your code editor (VS Code, Cursor, etc.)
2. Navigate to `frontend/src/components/sections/Hero.tsx`
3. Find the text "Enter The World of A.I"
4. Change it to anything you want!
5. **Save the file**
6. Look at your browser - it updates automatically! ✨ (This is called "hot reloading")

## Troubleshooting

### "Command not found" errors?
- Make sure Node.js and Git are properly installed
- Try closing and reopening your Terminal
- On Mac, you might need to restart your computer after installing

### Port already in use?
- Something else is using port 5173
- The website will automatically suggest another port (like 5174)
- Or stop other development servers you might have running

### Installation takes forever or fails?
- Try using a different network (sometimes corporate networks block npm)
- Clear npm cache: `npm cache clean --force`
- Try again with: `npm run install:all`

### Styles look broken?
- Make sure the installation completed successfully
- Try stopping (`Ctrl+C`) and restarting with `npm run dev`

## Next Steps

Once you have it running:

- 🔍 **Explore the code** in `frontend/src/components/` to see how sections are built
- 📖 **Read the [Development Guide](./development-guide.md)** to learn about the architecture
- 🎨 **Try changing colors** in `frontend/src/index.css`
- 📚 **Check out the [main README](../README.md)** for an overview of how everything works
- 🚀 **Join our community** and share what you're learning!

## Learning Resources

Want to learn more about web development?

- **[freeCodeCamp](https://www.freecodecamp.org/)** - Free, comprehensive web development courses
- **[MDN Web Docs](https://developer.mozilla.org/)** - The ultimate reference for web technologies
- **[React Tutorial](https://react.dev/learn)** - Learn React from the official docs
- **[Scrimba](https://scrimba.com/)** - Interactive coding tutorials
- **[JavaScript.info](https://javascript.info/)** - Modern JavaScript tutorial

## Need Help?

- 💬 **[Open an issue](https://github.com/your-repo/issues)** on GitHub
- 💭 **Join our [Discord server](https://discord.gg/NuVXk7yjNz)** and ask questions
- 📱 **Join our [WhatsApp Community](https://chat.whatsapp.com/FFzjagZ0ZxRCCHaNMjJODm)** 

---

**Happy coding!** 🎉 Welcome to the JAIA community! 🇯🇲

