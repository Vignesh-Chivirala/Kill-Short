# Kill Short – Chrome Extension

A Chrome extension that removes short-form content such as YouTube Shorts and Instagram Reels to reduce distractions and improve focus during browsing.

---

## Overview

Kill Short targets highly addictive short-form feeds and eliminates them directly from the page using lightweight content scripts. The extension runs efficiently in the background and provides a simple interface to control blocking behavior.

---

## Features

* Blocks YouTube Shorts from homepage and sidebar
* Hides Instagram Reels content
* Minimal and fast execution using content scripts
* Toggle control to enable or disable blocking
* No external dependencies

---

## Project Structure

```
Kill-Short-main/
│
├── manifest.json
├── background.js
│
├── content/
│   ├── youtube.js
│   └── instagram.js
│
├── popup/
│   ├── popup.html
│   ├── popup.css
│   └── popup.js
│
├── icons/
```

---

## Installation

1. Clone the repository

```bash
git clone https://github.com/your-username/kill-short.git
```

2. Open Chrome and navigate to

```
chrome://extensions/
```

3. Enable Developer Mode

4. Click "Load unpacked" and select the project folder

---

## Usage

* Open YouTube or Instagram after installing the extension
* Shorts and Reels sections are removed automatically
* Use the popup interface to toggle blocking when needed

---

## Implementation Details

* Content scripts modify the DOM to detect and remove short-form elements
* Background script manages extension state and communication
* Popup provides user interaction and state control

---

## Tech Stack

* JavaScript
* Chrome Extension APIs
* HTML, CSS

---

## Future Enhancements

* Support additional platforms such as Facebook and TikTok
* Introduce scheduling or focus sessions
* Add customizable blocking rules
* Provide usage insights

---
