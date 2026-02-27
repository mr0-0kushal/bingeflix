import { useEffect, useState } from "react";
import axios from "axios";
import { LOCAL_SERVER } from "../../utils/constants";
import { useAuth } from "../../context/AuthContext";
import ScreenLoader from "../../components/ScreenLoader";

const Analytics = () => {

    const { accessToken } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await axios.get(
                    `${LOCAL_SERVER}/users/analytics`,
                    {
                        withCredentials: true,
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    }
                );
                setData(res.data.data);
            } catch (err) {
                console.error("Analytics error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (loading) return <ScreenLoader />;

    return (
        <div className="admin-analytics">
            <h1 className="dashboard-title">Admin Analytics</h1>

            <div className="stats-grid">

                <div className="stat-card">
                    <h3>Total Users</h3>
                    <p>{data?.totalUsers}</p>
                </div>

                <div className="stat-card">
                    <h3>Total Movies</h3>
                    <p>{data?.totalMovies}</p>
                </div>

                <div className="stat-card">
                    <h3>Total Watchlists</h3>
                    <p>{data?.totalWatchlists}</p>
                </div>

                <div className="stat-card">
                    <h3>Total Ratings</h3>
                    <p>{data?.totalRatings}</p>
                </div>

            </div>
        </div>
    );
};

export default Analytics;