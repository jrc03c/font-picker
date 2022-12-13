# Intro

This tool makes it easy to test out a bunch of different fonts on a web page without having to switch back and forth between your CSS and the browser. It uses fonts from [Google Fonts](https://fonts.google.com/). This is an endorsement neither of Google Fonts specifically nor of Google generally; it's just a tool for quickly testing out ideas. When it comes to using the fonts in production, I recommend either (1) downloading and self-hosting the fonts, or (2) using an alternate service. ([Here](https://gitlab.com/raphaelbastide/libre-foundries)'s a list of alternates.)

# Installation

**1) Get an API key:** Because this tool relies on the [Google Fonts Developer API](https://developers.google.com/fonts/docs/developer_api), you'll need your own API key (for which you can find instructions via the link).

**2) Install the font picker in your project:**

Using a CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/@jrc03c/font-picker/dist/font-picker.js"></script>
```

Or using `npm`:

```bash
npm install --save https://github.com/jrc03c/font-picker
```

**3) Inject the font picker into your HTML page:**

```html
<script>
  const GOOGLE_WEBFONTS_API_KEY = "YOUR_API_KEY"
</script>
<script src="path/to/font-picker/dist/font-picker.js"></script>
```

This setup should _only_ be used in a development environment. _Never_ publish your API key to a production environment, and _never_ check your API key into your commit history.

If you'd prefer a safer setup that doesn't require hard-coding the API key into the page, maybe try something like this:

```html
<script>
  const GOOGLE_WEBFONTS_API_KEY = (() => {
    const apiKey = localStorage.getItem("api-key")

    if (apiKey) {
      return apiKey
    } else {
      const response = prompt("Google Fonts Developer API key:")
      localStorage.setItem("api-key", response)
      return response
    }
  })()
</script>
<script src="path/to/font-picker/dist/font-picker.js"></script>
```

**4) Load the page:**

When the page loads for the first time, the entire font catalogue is downloaded from Google and cached in `localStorage`. This may take up to a few seconds depending on your network speed. After that, though, the font picker will load the catalogue from `localStorage`, even when the page is reloaded. One point of clarification, though, is that the catalogue is only a list of fonts' family names and variants; any individual font file isn't loaded until you use the font for the first time (i.e., when it's chosen and applied to selectors for the first time).

As you add, modify, and delete various font rules, your changes will be cached in `localStorage`. When the page is reloaded, your configuration should load from there.

If something goes wrong and you want to start over from scratch, use `localStorage.clear()` in the browser console and then reload the page.
