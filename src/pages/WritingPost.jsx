import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { MDXProvider } from "@mdx-js/react";
import { findPost } from "../content/posts.js";

const mdxComponents = {};

export default function WritingPost() {
  const { slug } = useParams();
  const post = findPost(slug);

  useEffect(() => {
    document.title = post ? `${post.title} — Minhyeok Oh` : "Not found";
  }, [post]);

  if (!post) {
    return (
      <main className="page">
        <header className="page__head">
          <h1 className="page__title">Post not found</h1>
          <p className="page__lede"><Link to="/writing">← Back to writing</Link></p>
        </header>
      </main>
    );
  }

  const { Component } = post;
  return (
    <main className="page">
      <header className="page__head">
        <Link className="page__back" to="/writing">← Writing</Link>
        <span className="page__eyebrow">Filed · {formatDate(post.date)}</span>
        <h1 className="page__title">{post.title}</h1>
      </header>
      <article className="prose">
        <MDXProvider components={mdxComponents}>
          <Component />
        </MDXProvider>
      </article>
    </main>
  );
}

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }).toUpperCase();
}
