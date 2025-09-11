/** @type {import('mdsvex').MdsvexOptions} */
const config = {
  extensions: ['.svx', '.md'],
  layout: {
    _: './src/lib/layouts/MarkdownLayout.svelte'
  }
};

export default config;

