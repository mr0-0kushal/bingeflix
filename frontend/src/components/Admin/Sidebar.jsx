import { Link } from "react-router-dom";

const Sidebar = () => {
    return (
        <div className="sidebar">
            <h2>Admin Panel</h2>
            <Link to="/dashboard">Analytics</Link>
            <Link to="/dashboard/movies">Manage Movies</Link>
            <Link to="/dashboard/users">Manage Users</Link>
        </div>
    );
};

export default Sidebar;