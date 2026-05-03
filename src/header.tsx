import Nav from "./nav"
import { Outlet } from "react-router"

export default function Header() {
    return (
        <div className="site-layout">
            <header className="site-header">
                <div className="site-header__inner">
                    <p className="site-tagline">
                        Trusted mortgage advisors—experience you can feel at every step
                    </p>
                    <div className="site-header__title-row">
                        <div className="site-header__brand">
                            <h1 className="site-title">The Hirsch Team</h1>
                        </div>
                        <Nav />
                    </div>
                </div>
            </header>
            <main id="main-content" className="site-main" tabIndex={-1}>
                <Outlet />
            </main>
        </div>
    )
}
