# ColorSticky — Chrome Extension

ColorSticky is a small Chrome extension I made because I often catch myself needing to jot down something quickly: a thought, a task, or just a reminder. Normally, I would open a separate app or write it somewhere else, but it always breaks the flow. So I decided to create a tiny tool that lives inside the browser itself. That way, whenever I’m online, I can add a colorful sticky note or make a to-do list without leaving my current page.

The whole point of ColorSticky is simplicity. It’s not meant to replace heavy productivity apps. Instead, it focuses on two main things: **colorful sticky notes** and a **basic task list**. The interface is intentionally lightweight: a popup with a clean dark background, rounded sticky notes in different pastel colors, and a to-do section. You open it, type something, maybe choose a color, and that’s it. No distractions, no account setup, and no complicated menus.

---

## Why I Built It

Sometimes small problems inspire small solutions. For me, the problem was that ideas, highlights from articles, and little reminders always got lost. I wanted a way to capture them without switching tabs. I also wanted the tool to be visually pleasing — sticky notes feel personal and colorful, so they make even boring reminders look a little nicer.

This project is also a learning exercise. I wanted to practice working with Chrome Extensions, `manifest.json`, background scripts, and the Chrome storage API. So, ColorSticky became a mix of a practical tool and a coding experiment.

---

## Features

Here’s what ColorSticky can currently do:

- **Sticky notes in multiple colors**
  Create a note and pick a color. This helps separate categories or just makes the popup look less dull.

- **Simple to-do list**
  Add tasks, check them off when done, and remove them if you don’t need them anymore.

- **Right-click save**
  If you highlight some text on a webpage, right-click, and choose “Save selection as sticky note,” it instantly appears in the extension. Super handy for saving quotes or important details without copy-paste.

- **Export and import**
  You can export all your notes and tasks into a JSON file. Later, you can import that file and restore everything. It’s like a backup system but lightweight.

- **Sync with Chrome**
  The extension uses `chrome.storage.sync`, which means if you are signed into Chrome, your notes and tasks follow you to other devices.

- **Clean design**
  Dark background, rounded sticky notes, and a minimal layout. It’s easy on the eyes and doesn’t feel cluttered.

---

## How to Install

1. Download or clone this repository to your computer.
2. Open Chrome and go to `chrome://extensions/`.
3. Turn on **Developer mode** in the top right corner.
4. Click **Load unpacked** and select the folder where you saved the files.
5. The extension icon should appear in your Chrome toolbar. Click it to open the popup.

That’s it. No installation wizard, no hidden steps.

---

## How to Use

Once installed:

- Open the popup by clicking the extension’s icon.
- To add a note, click **Add Note**, type your text, and choose a color.
- To add a task, type it in the to-do section and press Enter.
- Tasks can be checked off when done and deleted when you don’t need them.
- To back up your notes, click **Export**. You’ll get a JSON file with all your data.
- To restore notes, use **Import** and select the file you previously exported.
- On any webpage, highlight some text, right-click, and pick “Save selection as sticky note.” The note appears in your popup automatically.

---

## Project Structure

Here’s a breakdown of all files and what they do:

- **manifest.json**
  This is the heart of the extension. It tells Chrome what the extension is, what files it uses, what permissions it needs, and what version it is. Without this file, Chrome won’t even recognize the project as an extension.

- **popup.html**
  This is the actual window you see when you click the extension icon. It holds the layout: buttons for adding notes, the to-do input field, and space for existing notes and tasks.

- **popup.css**
  All the styling lives here. The dark background, the rounded edges, the colorful sticky notes — it’s all handled by this file. If you want to change colors or the look of the extension, this is the place.

- **popup.js**
  This script controls the behavior inside the popup. It’s where the logic for adding notes, saving them to Chrome storage, exporting and importing JSON, and managing todos lives. Basically, if something “happens” in the popup, it’s thanks to this file.

- **background.js**
  This script runs behind the scenes and enables the right-click context menu. Without it, you wouldn’t be able to save highlighted text from a webpage.

- **icon.png (and other icon sizes)**
  The extension’s little logo that shows up in your Chrome toolbar and in the extension manager. If you want a new icon, replace these files and update `manifest.json` accordingly.

---

## Permissions

The extension asks for just two permissions:

- `storage` — needed to save your notes and tasks.
- `contextMenus` — needed so the right-click option works.

That’s all. No weird tracking, no unnecessary access.

---

## Changing the Icon

If you want to change the extension’s icon, it’s easy:

1. Create your own icons in PNG format. Common sizes are 16×16, 48×48, and 128×128 pixels.
2. Place them in the project folder, for example as `icon16.png`, `icon48.png`, and `icon128.png`.
3. In `manifest.json`, update the `"icons"` section like this:
   ```json
   "icons": {
     "16": "icon16.png",
     "48": "icon48.png",
     "128": "icon128.png"
   }

Update the "action" part too, for example:

"action": {
  "default_icon": "icon48.png",
  "default_popup": "popup.html"
}


Reload the extension in chrome://extensions/. The new icon should appear.

Ideas for the Future

I consider ColorSticky a small but expandable project. Some ideas for future updates are:

Allow dragging sticky notes around in the popup.

More color themes (including a light mode).

Support for different fonts and text sizes.

Notifications for due tasks.

Keyboard shortcuts for quickly opening or adding notes.

License

MIT License — free to use, change, and share.

Final Thoughts

ColorSticky is not a professional-grade productivity app, and that’s the charm. It’s a small, personal tool made with care. It’s simple, colorful, and does exactly what it promises: gives you sticky notes and a to-do list right in Chrome. If you ever find yourself scribbling thoughts on random pieces of paper, maybe this extension can help bring a little order — in a fun way.

Made with curiosity and a lot of learning, by Katya.
