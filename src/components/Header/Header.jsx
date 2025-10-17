import { Link } from "react-router-dom";
import { UserStar } from 'lucide-react';

function Header() {
    return (
        <header className="flex justify-between items-center px-8 py-4">
            <h1 className="text-4xl font-bold align-middle">Goalytics</h1>

            <nav>
                <ul className="flex">
                    <li className="hover:bg-gray-200 p-2 rounded-md transition-all duration-500 ease-out">
                        <Link to="/admin">
                            <UserStar />
                        </Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
}

export default Header; 