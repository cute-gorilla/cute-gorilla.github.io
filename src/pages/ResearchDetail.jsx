import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { MDXProvider } from "@mdx-js/react";
import { findProject } from "../content/projects.js";

const mdxComponents = {};

export default function ResearchDetail() {
  const { slug } = useParams();
  const project = findProject(slug);

  useEffect(() => {
    document.title = project ? `${project.title} — Minhyeok Oh` : "Not found";
  }, [project]);

  if (!project) {
    return (
      <main className="page">
        <header className="page__head">
          <h1 className="page__title">Project not found</h1>
          <p className="page__lede"><Link to="/research">← Back to research</Link></p>
        </header>
      </main>
    );
  }

  const { Component } = project;
  return (
    <main className="page">
      <header className="page__head">
        <Link className="page__back" to="/research">← Research</Link>
        <span className="page__eyebrow">File · {project.year}</span>
        <h1 className="page__title">{project.title}</h1>
        {project.description && <p className="page__lede">{project.description}</p>}
        {project.tags.length > 0 && (
          <ul className="card__tags">
            {project.tags.map((t) => <li key={t}>{t}</li>)}
          </ul>
        )}
      </header>
      <article className="prose">
        <MDXProvider components={mdxComponents}>
          <Component />
        </MDXProvider>
      </article>
    </main>
  );
}
