import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Settings, Video, TrendingUp, Menu } from "lucide-react";
import ManageMovies from "./ManageMovies";
import Analytics from "./Analytics";
import ManageUsers from "./ManageUsers";
import Profile from "../../components/Profile";

const Dashboard = () => {
    const [activeSection, setActiveSection] = useState("Profile");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const menuItems = [
        { id: "Profile", label: "Profile", icon: <Settings size={20} /> },
        { id: "Board", label: "Analytics", icon: <TrendingUp size={20} /> },
        { id: "Movies", label: "Manage Movies", icon: <Video size={20} /> },
        { id: "Users", label: "Manage Users", icon: <User size={20} /> },
    ];

    return (
        <div className="flex h-screen mt-21">
            {/* Sidebar (Desktop & Mobile) */}
            <AnimatePresence>
                {(sidebarOpen || window.innerWidth > 768) && (
                    <motion.div
                        initial={{ x: -250 }}
                        animate={{ x: 0 }}
                        exit={{ x: -250 }}
                        transition={{ duration: 0.3 }}
                        className="w-40 md:w-64 bg-[var(--color-primary)] text-white font-bold flex flex-col fixed md:static z-20 top-27 p-2 md:px-2 h-auto md:h-full rounded-r-2xl shadow-xl"
                    >
                        <h2 className="md:text-2xl md:font-bold md:p-4 md:mb-3">
                            Dashboard
                        </h2>
                        <nav className="flex-1">
                            {menuItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        setActiveSection(item.id);
                                        if (window.innerWidth < 768) setSidebarOpen(false);
                                    }}
                                    className={`w-full flex items-center gap-3 p-1 md:px-4 md:py-3 text-left transition rounded-lg m-1 ${activeSection === item.id
                                        ? "bg-black "
                                        : "hover:bg-white hover:text-black"
                                        }`}
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                </button>
                            ))}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Content Area */}
            <div className="flex-1 p-6 overflow-auto">
                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden absolute mb-4 p-2 rounded-md bg-[var(--color-primary)] text-white z-40 left-3 top-16"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                    <Menu size={22} />
                </button>

                <motion.div
                    key={activeSection}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.4 }}
                    className="bg-transparent md:p-6 rounded-2xl shadow-md"
                >
                    {activeSection === "Board" && (
                        <>
                        <Analytics/>
                        </>
                    )}

                    {activeSection === "Movies" && (
                        <ManageMovies></ManageMovies>
                    )}

                    {activeSection === "Users" && (
                        <ManageUsers></ManageUsers>
                    )}

                    {activeSection === "Profile" && (
                        <Profile></Profile>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default Dashboard;
