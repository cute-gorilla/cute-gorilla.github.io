import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Nav from "./ui/Nav.jsx";
import Footer from "./ui/Footer.jsx";
import Home from "./pages/Home.jsx";
import WritingIndex from "./pages/WritingIndex.jsx";
import WritingPost from "./pages/WritingPost.jsx";
import ResearchIndex from "./pages/ResearchIndex.jsx";
import ResearchDetail from "./pages/ResearchDetail.jsx";
import Gallery from "./pages/Gallery.jsx";
import CV from "./pages/CV.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <>
      <ScrollToTop />
      <Nav theme={theme} onToggle={() => setTheme(theme === "dark" ? "light" : "dark")} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/writing" element={<WritingIndex />} />
        <Route path="/writing/:slug" element={<WritingPost />} />
        <Route path="/research" element={<ResearchIndex />} />
        <Route path="/research/:slug" element={<ResearchDetail />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/cv" element={<CV />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) return;
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}
