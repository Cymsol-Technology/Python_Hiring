import React, { useState } from 'react';
import { Menu, X, Home, Settings, Users, FileText, User, LogOut, ChevronRight } from 'lucide-react';

// Navbar Component
const Navbar = ({ logo, title, onToggleSidebar, isSidebarOpen, actions }) => {
  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-lg hover:bg-blue-700 transition-colors"
              aria-label="Toggle sidebar"
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            {logo && (
              <img src={logo} alt="Logo" className="h-8 w-8 object-contain" />
            )}
            <h1 className="text-xl font-bold">{title}</h1>
          </div>
          <div className="flex items-center space-x-4">
            {actions}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;