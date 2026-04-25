import HeroText from "./HeroText.jsx";
import SeoulTime from "./SeoulTime.jsx";

export default function Hero() {
  return (
    <header className="hero" id="top">
      <div className="hero__grid-bg" aria-hidden="true" />

      <div className="hero__top">
        <span className="hero__classified">Personal site</span>
        <div className="hero__meta">
          <span>Research</span>
          <span>Writing</span>
          <span><SeoulTime /></span>
        </div>
      </div>

      <div className="hero__body">
        <h1 className="hero__title">
          <span className="hero__title-line">Minhyeok</span>
          <span className="hero__title-line hero__title-line--accent">Oh.</span>
        </h1>
        <HeroText />
      </div>

      <div className="hero__bottom">
        <div className="hero__index">
          <span><strong>About</strong></span>
          <span><strong>CV</strong></span>
          <span><strong>Research</strong></span>
          <span><strong>Writing</strong></span>
          <span><strong>Gallery</strong></span>
        </div>
        <span className="hero__scroll">
          Scroll
          <span className="hero__scroll-line" aria-hidden="true" />
        </span>
      </div>
    </header>
  );
}
