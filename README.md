# Product website

A static site built with [Eleventy](https://www.11ty.dev/) and published by GitHub Pages.

- **One config file:** the product name, prices, URLs and support email all come from `src/_data/brand.json`. Don't edit that file here: it is copied from the extension repo's `brand/brand.json` by `npm run brand:sync -- ../pagestack-site`, together with the icon and the social-share image. Commit the result here.
- **No tracking:** no cookies, no analytics, no third-party scripts or fonts.
- **Light and dark:** the site follows the visitor's system setting, with a toggle in the header.

## Editing text

Pages are in `src/` (`index.njk` is the home page; legal pages are in `src/legal/`). FAQ answers
are in `src/_data/faq.json`, and release notes are in `src/_data/changelog.json`. Every push to `main` republishes the site automatically.

## Set up GitHub Pages (once)

1. In this repo on GitHub, open **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **GitHub Actions**. Nothing else to set.
3. Open the **Actions** tab and wait for **Deploy site** to get a green tick (about 1–2 minutes). If it ran before Pages was enabled and failed, click it → **Re-run all jobs**.
4. Back in **Settings → Pages**, the address is shown: `https://pjfigueroa95-cmd.github.io/pagestack-site/`.
5. Check it on your PC and phone.
6. Optional: in Chrome DevTools → Lighthouse (Mobile), the target is 95+ in all four categories.

## Adding a custom domain later

1. Buy the domain.
2. In your registrar's DNS settings:
   - for `www`, add a **CNAME** record pointing to `pjfigueroa95-cmd.github.io`;
   - for the bare domain, add GitHub's four **A** records (listed on GitHub's "Managing a custom domain for your GitHub Pages site" page).
3. In the extension repo's `brand/brand.json`:
   - set `customDomain` (e.g. `www.example.com`);
   - set `siteUrl` to `https://www.example.com`;
   - set `sitePathPrefix` to `/`.

   Then run `npm run brand:sync -- ../pagestack-site` and push both repos. The build writes the `CNAME` file.
4. In **Settings → Pages**, wait for the DNS check, then tick **Enforce HTTPS**. The certificate can take up to a day.
5. Rebuild and re-upload the extension so its links use the new address, and update the store listings' website and privacy-policy URLs.

## Local preview (optional; needs Node.js 24)

`npm ci`, then `npm run serve`. Run `npm run build && npm run check` to build and check the site.
