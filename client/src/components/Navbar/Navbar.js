import "./Navbar.css";

import { Link, useMatch, useResolvedPath } from "react-router-dom";
let loggedUser = JSON.parse(localStorage.getItem("user"));

export default function Navbar() {
	return (
		<nav className="nav">
			<div className="logo-container">
				<img className="logo-img" src="open-book-png-icon-2.jpg" alt="logo" />
				<Link to="/" className="site-title">
					README.md
				</Link>
			</div>
			<ul>
				<CustomLink to="/">Home</CustomLink>
				<CustomLink to="/about">About</CustomLink>
				<CustomLink to="/contact">Contact</CustomLink>
				{loggedUser ? (
					<CustomLink to="/login">Logout: {loggedUser.name}</CustomLink>
				) : (
					<CustomLink to="/login">Log in</CustomLink>
				)}
			</ul>
		</nav>
	);
}

const CustomLink = ({ to, children, ...props }) => {
	const resolvedPath = useResolvedPath(to);
	const isActive = useMatch({ path: resolvedPath.pathname, end: true });

	return (
		<li className={isActive ? "active" : ""}>
			<Link to={to} {...props}>
				{children}
			</Link>
		</li>
	);
};
