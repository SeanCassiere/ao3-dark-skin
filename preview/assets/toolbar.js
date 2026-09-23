// Shared preview toolbar: switch pages and swap the skin under test.
// Loaded by every mock page. State is kept in localStorage so it survives
// navigation between pages and Vite live-reloads.
(function () {
  const SKIN_KEY = "ao3-preview-skin";
  const SKIN_LINK_ID = "ao3-skin-under-test";

  // mode -> href (null = no skin, i.e. vanilla AO3)
  const SKINS = {
    none: null,
    original: "/DO_NOT_EDIT-original-skin.css",
    live: "/skin.css",
  };

  const PAGES = [
    { id: "home", label: "Home", href: "home.html" },
    { id: "search", label: "Search results", href: "search.html" },
    { id: "work", label: "Work / Chapter", href: "work.html" },
  ];

  function currentPageId() {
    const file = location.pathname.split("/").pop() || "home.html";
    const match = PAGES.find((p) => p.href === file);
    return match ? match.id : "home";
  }

  function getMode() {
    const m = localStorage.getItem(SKIN_KEY);
    return m && m in SKINS ? m : "live";
  }

  function applySkin(mode) {
    const existing = document.getElementById(SKIN_LINK_ID);
    if (existing) existing.remove();

    const href = SKINS[mode];
    if (href) {
      const link = document.createElement("link");
      link.id = SKIN_LINK_ID;
      link.rel = "stylesheet";
      // Cache-bust so a live edit always shows after reload.
      link.href = href + "?t=" + Date.now();
      document.head.appendChild(link);
    }

    document
      .querySelectorAll("#ao3-preview-toolbar .ptb-skins button")
      .forEach((b) => b.classList.toggle("is-active", b.dataset.mode === mode));
  }

  function setMode(mode) {
    localStorage.setItem(SKIN_KEY, mode);
    applySkin(mode);
  }

  function buildToolbar() {
    const page = currentPageId();

    const bar = document.createElement("div");
    bar.id = "ao3-preview-toolbar";

    const pageGroup = document.createElement("div");
    pageGroup.className = "ptb-group";
    pageGroup.innerHTML = '<span class="ptb-label">Page</span>';
    PAGES.forEach((p) => {
      const a = document.createElement("a");
      a.className = "ptb-page" + (p.id === page ? " is-active" : "");
      a.href = p.href;
      a.textContent = p.label;
      pageGroup.appendChild(a);
    });

    const skinGroup = document.createElement("div");
    skinGroup.className = "ptb-group";
    skinGroup.innerHTML = '<span class="ptb-label">Skin</span>';
    const skins = document.createElement("div");
    skins.className = "ptb-skins";
    [
      { mode: "none", label: "None" },
      { mode: "original", label: "Original" },
      { mode: "live", label: "Live (editing)" },
    ].forEach((s) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.dataset.mode = s.mode;
      btn.textContent = s.label;
      btn.addEventListener("click", () => setMode(s.mode));
      skins.appendChild(btn);
    });
    skinGroup.appendChild(skins);

    const spacer = document.createElement("div");
    spacer.className = "ptb-spacer";

    const note = document.createElement("div");
    note.className = "ptb-note";
    note.innerHTML =
      "Keys: <kbd>1</kbd> none &middot; <kbd>2</kbd> original &middot; <kbd>3</kbd> live &middot; <kbd>d</kbd> A/B toggle";

    bar.appendChild(pageGroup);
    bar.appendChild(skinGroup);
    bar.appendChild(spacer);
    bar.appendChild(note);

    document.body.insertBefore(bar, document.body.firstChild);
  }

  function onKey(e) {
    const tag = (e.target.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea" || tag === "select") return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;

    if (e.key === "1") setMode("none");
    else if (e.key === "2") setMode("original");
    else if (e.key === "3") setMode("live");
    else if (e.key === "d") setMode(getMode() === "live" ? "none" : "live");
  }

  function init() {
    buildToolbar();
    applySkin(getMode());
    document.addEventListener("keydown", onKey);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
