import { useEffect } from "react";
import { Link } from "react-router-dom";
import { posts } from "../content/posts.js";

export default function WritingIndex() {
  useEffect(() => { document.title = "Writing — Minhyeok Oh"; }, []);

  return (
    <main className="page">
      <header className="page__head">
        <span className="page__eyebrow">Writing</span>
        <h1 className="page__title">Writing</h1>
        <p className="page__lede">Essays, notes, and half-formed thoughts.</p>
      </header>

      <ul className="posts">
        {posts.map((p) => (
          <li key={p.slug}>
            <Link to={`/writing/${p.slug}`} className="post">
              <span className="post__date">{formatDate(p.date)}</span>
              <span>
                <span className="post__title">{p.title}</span>
                <p className="post__excerpt">{p.excerpt}</p>
              </span>
              <span className="post__arrow">→</span>
            </Link>
          </li>
        ))}
        {posts.length === 0 && <li><p className="post__excerpt">No posts yet.</p></li>}
      </ul>
    </main>
  );
}

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short" }).toUpperCase();
}
