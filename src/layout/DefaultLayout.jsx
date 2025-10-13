import { Link, Outlet } from "react-router-dom";

export const DefaultLayout = () => {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header__content">
          <Link to="/" className="app-header__brand">
            Scheda Palestra
          </Link>
          <nav className="app-header__nav">
            <Link to="/" className="app-header__link">
              Home
            </Link>
          </nav>
        </div>
      </header>

      <main className="app-main">
        <Outlet />
      </main>

      <footer className="app-footer">
        <small>© {new Date().getFullYear()} Scheda Palestra</small>
      </footer>
    </div>
  );
};
