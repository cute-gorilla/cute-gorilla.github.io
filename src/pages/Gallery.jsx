import { useEffect } from "react";

export default function Gallery() {
  useEffect(() => { document.title = "Gallery — Minhyeok Oh"; }, []);

  return (
    <main className="page">
      <header className="page__head">
        <span className="page__eyebrow">Gallery</span>
        <h1 className="page__title">Gallery</h1>
        <p className="page__lede">Sketches, photos, and visual fragments.</p>
      </header>

      <div className="gallery">
        {Array.from({ length: 12 }, (_, i) => (
          <figure
            className={`gallery__item ${i === 0 ? "gallery__item--tall" : ""} ${i === 3 ? "gallery__item--wide" : ""}`}
            data-label={`No. ${String(i + 1).padStart(3, "0")}`}
            key={i}
          >
            <span>{String(i + 1).padStart(2, "0")}</span>
          </figure>
        ))}
      </div>
    </main>
  );
}
