import { useEffect } from "react";

export default function CV() {
  useEffect(() => { document.title = "CV — Minhyeok Oh"; }, []);

  return (
    <main className="page">
      <header className="page__head">
        <span className="page__eyebrow">Curriculum Vitae</span>
        <h1 className="page__title">CV</h1>
        <p className="page__lede">
          Graduate student in Seoul. Last updated April 2026 ·{" "}
          <a href="/cv.pdf" className="page__lede-link">Download PDF →</a>
        </p>
      </header>

      <div className="cv">
        <section className="cv__vitals">
          <dl>
            <div><dt>Position</dt><dd>M.S. Student, Placeholder Lab</dd></div>
            <div><dt>Advisor</dt><dd>Prof. Placeholder Name</dd></div>
            <div><dt>Department</dt><dd>Placeholder Department</dd></div>
            <div><dt>University</dt><dd>Placeholder University</dd></div>
            <div><dt>Office</dt><dd>Building 000, Room 000</dd></div>
            <div><dt>Email</dt><dd><a href="mailto:minhyuk5@snu.ac.kr">minhyuk5@snu.ac.kr</a></dd></div>
            <div><dt>Pronouns</dt><dd>he / him</dd></div>
            <div><dt>Open to</dt><dd>Collaborations · Research internships (Summer 2027)</dd></div>
          </dl>
        </section>

        <Block title="News">
          <ul className="cv__news">
            <li><span className="cv__date">Apr 2026</span><span>Started M.S. at Placeholder Lab.</span></li>
            <li><span className="cv__date">Mar 2026</span><span>Paper accepted to <em>Venue Name</em> (with A. Author and B. Author).</span></li>
            <li><span className="cv__date">Feb 2026</span><span>Gave a talk at <em>Seminar Series</em>.</span></li>
            <li><span className="cv__date">Jan 2026</span><span>Received Placeholder Fellowship.</span></li>
          </ul>
        </Block>

        <Block title="Education">
          <Entry
            date="2026 — Present"
            title="M.S. in Placeholder Field"
            org="Placeholder University · Seoul, KR"
            note="Advisor: Prof. Placeholder Name. Thesis: working title goes here."
          />
          <Entry
            date="2022 — 2026"
            title="B.S. in Placeholder Field"
            org="Placeholder University · Seoul, KR"
            note="GPA 4.x / 4.5. Honors thesis: short title."
          />
        </Block>

        <Block title="Research interests">
          <p className="cv__paragraph">
            Placeholder topic A, placeholder topic B, and the intersection of
            the two. Currently focused on a working question about{" "}
            <em>specific subarea</em>.
          </p>
        </Block>

        <Block title="Publications" caption="* indicates equal contribution">
          <Entry
            date="2026"
            title="Title of a paper goes here"
            org="Authors A*, B*, Oh, M., D. — Conference / Journal Name (under review)"
            link={{ href: "#", label: "PDF" }}
          />
          <Entry
            date="2025"
            title="Earlier paper title"
            org="Oh, M., Author B. — Workshop or Venue Name"
            note="Short one-line description of the contribution."
            link={{ href: "#", label: "PDF · Code" }}
          />
        </Block>

        <Block title="Preprints &amp; manuscripts">
          <Entry
            date="2026"
            title="Working paper title"
            org="Oh, M., Collaborator. — In preparation"
          />
        </Block>

        <Block title="Talks">
          <Entry date="Mar 2026" title="Invited talk title" org="Seminar / Lab name · Seoul" />
          <Entry date="Nov 2025" title="Conference talk title" org="Venue · City" />
        </Block>

        <Block title="Posters">
          <Entry date="Oct 2025" title="Poster title here" org="Workshop / Conference · City" />
        </Block>

        <Block title="Industry experience">
          <Entry
            date="Summer 2025"
            title="Research Intern"
            org="Placeholder Company · Team Name"
            note="Worked on placeholder problem with mentor X. Output: internal tool / preprint."
          />
        </Block>

        <Block title="Awards &amp; honors">
          <Entry date="2025" title="Placeholder Fellowship" org="Granting body" />
          <Entry date="2024" title="Department scholarship" org="Placeholder University" />
          <Entry date="2023" title="Best paper award (workshop track)" org="Venue Name" />
        </Block>

        <Block title="Teaching">
          <Entry
            date="Spring 2026"
            title="Teaching Assistant — Course Number / Title"
            org="Placeholder University"
            note="Held weekly recitations, graded assignments, advised final projects."
          />
        </Block>

        <Block title="Mentoring">
          <Entry
            date="2025 — Present"
            title="Undergraduate Researcher · A. Student"
            org="Co-supervised with Prof. Placeholder"
            note="Project on placeholder topic. Resulted in workshop paper."
          />
        </Block>

        <Block title="Service">
          <Entry date="2026" title="Reviewer" org="Workshop / Venue Name" />
          <Entry date="2025" title="Student volunteer" org="Conference Name" />
          <Entry date="2025 — Present" title="Lab reading group organizer" org="Placeholder Lab · weekly" />
        </Block>

        <Block title="Workshops &amp; events organized">
          <Entry date="2025" title="Co-organizer · Workshop title" org="Co-located with Conference Name" />
        </Block>

        <Block title="Skills">
          <dl className="cv__skills">
            <div><dt>Languages</dt><dd>Korean (native), English (fluent)</dd></div>
            <div><dt>Programming</dt><dd>Python, TypeScript, C++, SQL</dd></div>
            <div><dt>Tools</dt><dd>PyTorch, JAX, Git, LaTeX</dd></div>
          </dl>
        </Block>

        <p className="cv__footnote">References available on request.</p>
      </div>
    </main>
  );
}

function Block({ title, caption, children }) {
  return (
    <section className="cv__block">
      <div className="cv__block-head">
        <h2 className="cv__block-title">{title}</h2>
        {caption && <p className="cv__block-caption">{caption}</p>}
      </div>
      <div className="cv__block-body">{children}</div>
    </section>
  );
}

function Entry({ date, title, org, note, link }) {
  return (
    <article className="cv__entry">
      <span className="cv__date">{date}</span>
      <div className="cv__entry-body">
        <h3 className="cv__entry-title">{title}</h3>
        {org && <p className="cv__entry-org">{org}</p>}
        {note && <p className="cv__entry-note">{note}</p>}
        {link && (
          <p className="cv__entry-links">
            <a href={link.href}>{link.label}</a>
          </p>
        )}
      </div>
    </article>
  );
}
