const modules = import.meta.glob("./research/*.mdx", { eager: true });

export const projects = Object.entries(modules)
  .map(([path, mod]) => {
    const slug = path.match(/\/([^/]+)\.mdx$/)[1];
    const meta = mod.meta || {};
    return {
      slug,
      title: meta.title || slug,
      year: meta.year || "",
      description: meta.description || "",
      tags: meta.tags || [],
      Component: mod.default,
    };
  })
  .sort((a, b) => (a.year < b.year ? 1 : -1));

export function findProject(slug) {
  return projects.find((p) => p.slug === slug);
}
