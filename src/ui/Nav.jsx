import { Link, NavLink, useLocation } from "react-router-dom";

export default function Nav({ theme, onToggle }) {
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const aboutHref = isHome ? "#about" : "/#about";

  return (
    <nav className="nav">
      <Link to="/" className="nav__brand">
        <span className="nav__brand-mark" aria-hidden="true" />
        Minhyeok Oh
      </Link>
      <ul className="nav__links">
        <li><a href={aboutHref}>About</a></li>
        <li><NavLink to="/cv" className={navClass}>CV</NavLink></li>
        <li><NavLink to="/research" className={navClass}>Research</NavLink></li>
        <li><NavLink to="/writing" className={navClass}>Writing</NavLink></li>
        <li><NavLink to="/gallery" className={navClass}>Gallery</NavLink></li>
      </ul>
      <div className="nav__right">
        <button className="theme-toggle" aria-label="Toggle theme" onClick={onToggle}>
          {theme === "dark" ? "☀" : "☾"}
        </button>
      </div>
    </nav>
  );
}

function navClass({ isActive }) {
  return isActive ? "nav__link nav__link--active" : "nav__link";
}
