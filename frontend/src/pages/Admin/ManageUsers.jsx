import { useEffect, useState } from "react";
import axios from "axios";
import { LOCAL_SERVER } from "../../utils/constants";
import { useAuth } from "../../context/AuthContext";
import ScreenLoader from "../../components/ScreenLoader";

const ManageUsers = () => {

    const { accessToken } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const fetchUsers = async () => {
        try {
            const res = await axios.get(`${LOCAL_SERVER}/users/all-users`, {
                withCredentials: true,
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            setUsers(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleRoleChange = async (id, newRole) => {
        await axios.put(
            `${LOCAL_SERVER}/users/${id}/role`,
            { role: newRole },
            {
                withCredentials: true,
                headers: { Authorization: `Bearer ${accessToken}` }
            }
        );
        fetchUsers();
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this user?")) return;

        await axios.delete(
            `${LOCAL_SERVER}/users/${id}`,
            {
                withCredentials: true,
                headers: { Authorization: `Bearer ${accessToken}` }
            }
        );
        fetchUsers();
    };

    if (loading) return <ScreenLoader />;

    const filteredUsers = users.filter(user =>
        user.fullname.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="manage-users">
            <h1 className="dashboard-title">Manage Users</h1>

            <input
                type="text"
                placeholder="Search users..."
                className="search-input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <div className="users-table">
                {filteredUsers.map(user => (
                    <div key={user._id} className="user-row">
                        <div>
                            <h3>{user.fullname}</h3>
                            <p>{user.email}</p>
                            <span className={`role-badge ${user.role}`}>
                                {user.role}
                            </span>
                        </div>

                        <div className="actions">
                            <select
                                value={user.role}
                                onChange={(e) =>
                                    handleRoleChange(user._id, e.target.value)
                                }
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>

                            <button
                                className="delete"
                                onClick={() => handleDelete(user._id)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManageUsers;