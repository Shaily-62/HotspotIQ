import React from "react";
import { NavLink } from "react-router-dom";

import {
    FaChartBar,
    FaFire,
    FaMapMarkedAlt,
    FaLightbulb,
} from "react-icons/fa";

import { MdDashboard } from "react-icons/md";

const Sidebar = () => {
    const menuItems = [
        {
            name: "Dashboard",
            path: "/",
            icon: <MdDashboard />,
        },
        {
            name: "Hotspots",
            path: "/hotspots",
            icon: <FaFire />,
        },
        {
            name: "Analytics",
            path: "/analytics",
            icon: <FaChartBar />,
        },
        {
            name: "Map View",
            path: "/map",
            icon: <FaMapMarkedAlt />,
        },
        {
            name: "Recommendations",
            path: "/recommendations",
            icon: <FaLightbulb />,
        },
    ];

    return (
        <div className="w-64 bg-slate-900 text-white min-h-screen">

            <div className="text-center py-6 text-xl font-bold border-b border-slate-700">
                Control Panel
            </div>

            <ul className="mt-6">

                {menuItems.map((item) => (
                    <li key={item.name}>
                        <NavLink
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-6 py-4 hover:bg-slate-800 transition ${isActive ? "bg-blue-600" : ""
                                }`
                            }
                        >
                            {item.icon}
                            {item.name}
                        </NavLink>
                    </li>
                ))}

            </ul>
        </div>
    );
};

export default Sidebar;