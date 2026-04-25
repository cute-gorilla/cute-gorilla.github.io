const modules = import.meta.glob("./writing/*.mdx", { eager: true });

export const posts = Object.entries(modules)
  .map(([path, mod]) => {
    const slug = path.match(/\/([^/]+)\.mdx$/)[1];
    const meta = mod.meta || {};
    return {
      slug,
      title: meta.title || slug,
      date: meta.date || "",
      excerpt: meta.excerpt || "",
      Component: mod.default,
    };
  })
  .sort((a, b) => (a.date < b.date ? 1 : -1));

export function findPost(slug) {
  return posts.find((p) => p.slug === slug);
}
