import SeoulTime from "./SeoulTime.jsx";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__top">
          <div>
            <h2 className="footer__brand-mark">Minhyeok Oh</h2>
            <p className="footer__brand-tag">
              Research, writing, and prototypes. Built quietly in Seoul.
            </p>
          </div>
          <div className="footer__col">
            <h4>Index</h4>
            <ul>
              <li><a href="/#about">About</a></li>
              <li><a href="/cv">CV</a></li>
              <li><a href="/research">Research</a></li>
              <li><a href="/writing">Writing</a></li>
              <li><a href="/gallery">Gallery</a></li>
            </ul>
          </div>
          <div className="footer__col">
            <h4>Elsewhere</h4>
            <ul>
              <li><a href="https://github.com/cute-gorilla">GitHub</a></li>
              <li><a href="#">Twitter</a></li>
              <li><a href="mailto:minhyuk5@snu.ac.kr">Email</a></li>
            </ul>
          </div>
        </div>
        <div className="footer__bottom">
          <span>© 2026 Minhyeok Oh — All material self-published</span>
          <span>Seoul · <SeoulTime /></span>
        </div>
      </div>
    </footer>
  );
}
