import { Link } from "react-router-dom";

export default function HeroText() {
  return (
    <div className="hero__inner">
      <p className="hero__eyebrow">Minhyeok Oh</p>
      <p className="hero__lede">
        Research notes, prototypes, and writing. A small archive for things I
        am reading, building, and trying to understand.
      </p>
      <div className="hero__cta">
        <Link to="/writing" className="hero__cta-link">
          <span>Writing</span>
          <span>Read essays →</span>
        </Link>
        <Link to="/research" className="hero__cta-link">
          <span>Research</span>
          <span>Selected projects →</span>
        </Link>
      </div>
    </div>
  );
}
