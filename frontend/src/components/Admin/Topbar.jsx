import { useAuth } from "../../context/AuthContext";

const Topbar = () => {
    const { user, logout } = useAuth();

    return (
        <div className="flex justify-between items-center bg-white shadow px-6 py-3">
            <h1 className="text-lg font-semibold">Welcome, {user?.fullname}</h1>
            <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
            >
                Logout
            </button>
        </div>
    );
};

export default Topbar;