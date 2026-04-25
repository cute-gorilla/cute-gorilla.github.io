import { useEffect } from "react";
import { Link } from "react-router-dom";
import { projects } from "../content/projects.js";

export default function ResearchIndex() {
  useEffect(() => { document.title = "Research — Minhyeok Oh"; }, []);

  return (
    <main className="page">
      <header className="page__head">
        <span className="page__eyebrow">Research</span>
        <h1 className="page__title">Research &amp; Projects</h1>
        <p className="page__lede">
          Things I've worked on, in roughly reverse-chronological order.
        </p>
      </header>

      <div className="cards">
        {projects.map((p) => (
          <Link className="card" to={`/research/${p.slug}`} key={p.slug}>
            <div className="card__year">{p.year}</div>
            <h3 className="card__title">{p.title}</h3>
            <p className="card__desc">{p.description}</p>
            <ul className="card__tags">
              {p.tags.map((t) => <li key={t}>{t}</li>)}
            </ul>
          </Link>
        ))}
      </div>
    </main>
  );
}
