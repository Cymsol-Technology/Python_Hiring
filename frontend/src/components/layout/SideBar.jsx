import React, { useState } from 'react';
import { Menu, X, Home, Settings, Users, FileText, User, LogOut, ChevronRight } from 'lucide-react';





const Sidebar = ({ 
  isOpen = false, 
  menuItems , 
  user, 
  onLogout }) => {

    

  return (
    <aside
      className={`bg-gray-800 text-white transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-0'
      } overflow-hidden flex flex-col`}
    >
      <div className="p-4 flex-1 overflow-y-auto">
        <nav className="space-y-2">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              onClick={item.onClick}
              className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              {item.icon}
              <span className="whitespace-nowrap">{item.label}</span>
            </a>
          ))}
        </nav>
      </div>
      
      {/* User Section at Bottom */}
      {user && (
        <div className="border-t border-gray-700 p-4">
          <div className="flex items-center space-x-3 px-4 py-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                <User size={20} />
              )}
            </div>
            <div className="whitespace-nowrap overflow-hidden">
              <p className="font-semibold truncate">{user.name}</p>
              <p className="text-sm text-gray-400 truncate">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors w-full text-red-400 hover:text-red-300"
          >
            <LogOut size={20} />
            <span className="whitespace-nowrap">Logout</span>
          </button>
        </div>
      )}
    </aside>
  );
};
export default Sidebar;
