import React, { useState } from 'react';
import { Menu, X, Home, Settings, Users, FileText, User, LogOut, ChevronRight } from 'lucide-react';

const Breadcrumb = ({ items }) => {
  if (!items || items.length === 0) return null;
  
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <ChevronRight size={16} className="text-gray-400" />}
          {item.href ? (
            <a href={item.href} className="hover:text-blue-600 transition-colors">
              {item.label}
            </a>
          ) : (
            <span className="text-gray-800 font-medium">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;