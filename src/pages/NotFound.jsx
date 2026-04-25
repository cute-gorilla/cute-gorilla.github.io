import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="page">
      <header className="page__head">
        <span className="page__eyebrow">Error 404</span>
        <h1 className="page__title">File not found</h1>
        <p className="page__lede">
          The dossier you requested does not exist. <Link to="/">Return to index</Link>.
        </p>
      </header>
    </main>
  );
}
