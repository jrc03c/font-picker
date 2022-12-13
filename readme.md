# Intro

This tool makes it easy to test out a bunch of different fonts on a page without having to switch back and forth between your CSS and the browser. It uses fonts from [Google Fonts](https://fonts.google.com/).

# Installation

**1) Get an API key:** Because this tool relies on the [Google Fonts Developer API](https://developers.google.com/fonts/docs/developer_api), you'll need your own API key (for which you can find instructions via the link).

**2) Clone the repo:**

```bash
git clone https://github.com/jrc03c/font-picker
cd font-picker
```

**3) Move into the repo and install its dependencies:**

```bash
cd font-picker
npm install
```

**4) Expose the API key:** To make the API key available to the tool, I recommend adding it to an `.env` file (or whatever you want to call it), like this:

```bash
export GOOGLE_WEBFONTS_API_KEY="YOUR_API_KEY"
```

**5) Run the demo server:** To run the demo server using the new environment variable, do:

```bash
source ./.env # or whatever you named this file
npm run serve
```

**6) Visit the demo page in the browser:** It should be at http://localhost:3000.

# Usage

Once the demo page loads, expand the "Font picker" box at the bottom right. Click the "Add font" button to add fonts. Select a font family and variant, and then type comma-separated selectors in the "Selectors" field. These selectors will be used to apply the chosen font.

# Notes

The fonts you choose are stored in the browser's `localStorage`. If for some reason you muck things up and want to start from scratch, just run `localStorage.clear()` in the browser's console and then refresh the page.
