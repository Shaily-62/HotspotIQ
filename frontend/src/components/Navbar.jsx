import React from "react";

const Navbar = () => {
    return (
        <div className="h-16 bg-white shadow flex items-center justify-between px-6">
            <h1 className="text-2xl font-bold text-blue-600">
                AI Parking Intelligence
            </h1>

            <div className="font-medium text-gray-600">
                Traffic Enforcement Dashboard
            </div>
        </div>
    );
};

export default Navbar;