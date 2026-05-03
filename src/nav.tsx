import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { NavLink, useLocation } from "react-router";

const links = [
  { to: "/", label: "Home" },
  { to: "/ContactUs", label: "Contact" },
  { to: "/AboutUs", label: "About" },
  { to: "/Calculator", label: "Calculator" },
  { to: "/Rates", label: "Rates" },
] as const;

const NAV_WIDE_MQ = "(min-width: 900px)";

function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const close = useCallback(() => setMenuOpen(false), []);
  const toggle = useCallback(() => setMenuOpen((o) => !o), []);

  useEffect(() => {
    close();
  }, [location.pathname, close]);

  useEffect(() => {
    if (!menuOpen) return;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const mq = window.matchMedia(NAV_WIDE_MQ);
    const onChange = () => {
      if (mq.matches) setMenuOpen(false);
    };
    mq.addEventListener("change", onChange);
    onChange();
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const drawer = (
    <>
      <div
        className={`site-nav__backdrop ${menuOpen ? "is-visible" : ""}`}
        onClick={close}
      />

      <div className={`site-nav__drawer ${menuOpen ? "is-open" : ""}`}>
        <div className="site-nav__drawer-head">
          <p className="site-nav__drawer-title">Menu</p>
          <button
            type="button"
            className="site-nav__drawer-close"
            onClick={close}
          >
            ×
          </button>
        </div>
        <nav className="site-nav site-nav--drawer">
          <ul className="site-nav__list site-nav__list--stack">
            {links.map(({ to, label }) => (
              <li key={`drawer-${to}`}>
                <NavLink
                  className="site-nav__drawer-link"
                  to={to}
                  end={to === "/"}
                  onClick={close}
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );

  return (
    <>
      <div className={`site-nav-bar${menuOpen ? " site-nav-bar--open" : ""}`}>
        <button type="button" className="site-nav__menu-btn" onClick={toggle}>
          <span className="site-nav__burger">
            <span />
            <span />
            <span />
          </span>
        </button>

        <nav className="site-nav site-nav--inline">
          <ul className="site-nav__list">
            {links.map(({ to, label }) => (
              <li key={to}>
                <NavLink to={to} end={to === "/"}>
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {createPortal(drawer, document.body)}
    </>
  );
}

export default Nav;
