import Nav from "./nav"
import { Outlet } from "react-router"

export default function Header() {
    return (
        <div className="site-layout">
            <header className="site-header">
                <div className="site-header__inner">
                    <div>
                        <p className="site-tagline">
                            Trusted mortgage advisors—experience you can feel at every step
                        </p>
                        <h1 className="site-title">The Hirsch Team</h1>
                    </div>
                    <Nav />
                </div>
            </header>
            <main id="main-content" className="site-main" tabIndex={-1}>
                <Outlet />
            </main>
        </div>
    )
}
