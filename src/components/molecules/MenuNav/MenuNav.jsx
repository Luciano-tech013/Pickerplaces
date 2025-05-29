import { Link } from "react-router-dom";

export default function MenuNav() {
    return (
        <nav>
            <Link to="/">Home</Link>
            <Link to="/places">My Places</Link>
        </nav>
    );
}