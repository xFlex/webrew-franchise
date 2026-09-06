# Webrew Roasters — Franchise Opportunity Page

Landing page for the Webrew Roasters franchise opportunity (Saudi Arabia).
Single static HTML file, Arabic / RTL, no build step.

- **Live (Netlify):** <https://webrew-coffee-roasters-franchise-opportu-cd-ebecebed10.netlify.app>
- **Originally built with:** Claude Design — project `74a168f5-6542-4744-8d84-a4351c4c1a8f`
  (`Webrew Franchise.dc.html`). This repo is now the source of truth; edits happen
  here in code, not the Claude Design canvas.

## Files

| Path | What |
| --- | --- |
| `index.html` | The site. All CSS/JS inline. Loads only Rubik from Google Fonts. |
| `google-apps-script.gs` | Paste into a Google Sheet's Apps Script to receive form submissions. |
| `assets/` | Photos (see `assets/README.md`). Missing images fall back to a placeholder. |
| `netlify.toml` | Publish config — static, no build. |
| `legacy/deployed-bundle.html` | The old Claude Design bundle that was live before this rewrite. Kept for reference. |

## Form → Google Sheet

1. Follow the steps at the top of `google-apps-script.gs`.
2. Copy the deployed Web App URL and paste it into `index.html`:
   ```js
   var SHEET_ENDPOINT = "https://script.google.com/macros/s/AKfycb.../exec";
   ```
3. Commit + push. Netlify redeploys and submissions start landing in the sheet.

Until the endpoint is set, the form validates and shows the success screen but
stores nothing.

## Local preview

```bash
python -m http.server 8777
# open http://localhost:8777
```

## Deploy

Netlify auto-deploys on push once the repo is linked
(Site → Build & deploy → Link repository → publish directory `.`, no build command).
