import { NavLink } from 'react-router'

export default function Nav() {
  return (
    <nav className="site-nav" aria-label="Primary">
      <ul>
        <li><NavLink to="/">Home</NavLink></li>
        <li><NavLink to="/ContactUs">Contact</NavLink></li>
        <li><NavLink to="/AboutUs">About</NavLink></li>
        <li><NavLink to="/Calculator">Calculator</NavLink></li>
        <li><NavLink to="/Rates">Rates</NavLink></li>
      </ul>
    </nav>
  )
}
