import { readFileSync } from 'node:fs';
import { HtmlBasePlugin } from '@11ty/eleventy';

const brand = JSON.parse(readFileSync('src/_data/brand.json', 'utf8'));

export default function (eleventyConfig) {
  // Root-relative links ("/pricing/") get the path prefix automatically, so the same templates
  // work on https://<user>.github.io/pagestack-site/ now and on a custom domain later.
  eleventyConfig.addPlugin(HtmlBasePlugin);
  eleventyConfig.addPassthroughCopy({ 'src/assets': 'assets' });
  eleventyConfig.addPassthroughCopy({ 'src/.nojekyll': '.nojekyll' });
  eleventyConfig.addFilter('absolute', (path) => brand.siteUrl.replace(/\/$/, '') + path);
  return {
    dir: { input: 'src', output: '_site' },
    pathPrefix: brand.customDomain ? '/' : brand.sitePathPrefix,
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
  };
}
