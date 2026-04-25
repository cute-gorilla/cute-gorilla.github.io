import { Link } from "react-router-dom";
import { posts } from "../content/posts.js";
import { projects } from "../content/projects.js";

export default function Sections() {
  const recentPosts = posts.slice(0, 3);
  const featuredProjects = projects.slice(0, 3);

  return (
    <main>
      <section className="section" id="news">
        <div className="section__head">
          <span className="section__num">Latest</span>
          <h2 className="section__title">News</h2>
          <Link className="section__more" to="/cv">Full CV →</Link>
        </div>
        <ul className="news">
          <li><span className="news__date">Apr 2026</span><span>Started M.S. at Placeholder Lab.</span></li>
          <li><span className="news__date">Mar 2026</span><span>Paper accepted to <em>Venue Name</em>.</span></li>
          <li><span className="news__date">Feb 2026</span><span>Gave a talk at <em>Seminar Series</em>.</span></li>
          <li><span className="news__date">Jan 2026</span><span>Received Placeholder Fellowship.</span></li>
        </ul>
      </section>

      <section className="section" id="about">
        <div className="section__head">
          <span className="section__num">Overview</span>
          <h2 className="section__title">About</h2>
          <span />
        </div>
        <div className="about">
          <div className="about__text">
            <p>
              I'm a student-researcher based in Seoul. My work sits at the
              intersection of <em>placeholder topic A</em> and
              <em> placeholder topic B</em>.
            </p>
            <p>
              When I'm not reading or writing, I make small things on the side:
              essays, sketches, half-finished side projects.
            </p>
          </div>
          <aside className="about__card">
            <div className="about__photo"><span>Subject 01</span></div>
            <ul className="about__list">
              <li><span>Based in</span><span>Seoul, KR</span></li>
              <li><span>Studying</span><span>placeholder field</span></li>
              <li><span>Email</span><span>minhyuk5@snu.ac.kr</span></li>
              <li><span>Status</span><span>Active</span></li>
            </ul>
          </aside>
        </div>
      </section>

      <section className="section" id="research">
        <div className="section__head">
          <span className="section__num">Projects</span>
          <h2 className="section__title">Research &amp; Projects</h2>
          <Link className="section__more" to="/research">All projects →</Link>
        </div>
        <div className="cards">
          {featuredProjects.map((p) => (
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
      </section>

      <section className="section" id="writing">
        <div className="section__head">
          <span className="section__num">Notes</span>
          <h2 className="section__title">Writing</h2>
          <Link className="section__more" to="/writing">All posts →</Link>
        </div>
        <ul className="posts">
          {recentPosts.map((p) => (
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
        </ul>
      </section>

      <section className="section" id="gallery">
        <div className="section__head">
          <span className="section__num">Images</span>
          <h2 className="section__title">Gallery</h2>
          <Link className="section__more" to="/gallery">Full gallery →</Link>
        </div>
        <div className="gallery">
          {Array.from({ length: 6 }, (_, i) => (
            <figure
              className={`gallery__item ${i === 0 ? "gallery__item--tall" : ""} ${i === 3 ? "gallery__item--wide" : ""}`}
              data-label={`No. ${String(i + 1).padStart(3, "0")}`}
              key={i}
            >
              <span>{String(i + 1).padStart(2, "0")}</span>
            </figure>
          ))}
        </div>
      </section>
    </main>
  );
}

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short" }).toUpperCase();
}
