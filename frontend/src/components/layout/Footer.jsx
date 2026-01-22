import React, { useState } from 'react';
import { Menu, X, Home, Settings, Users, FileText, User, LogOut, ChevronRight } from 'lucide-react';

const Footer = ({ copyrightText, links }) => {
  return (
    <footer className="bg-gray-800 text-white shadow-lg">
      <div className="px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
          <p className="text-sm">{copyrightText}</p>
          {links && links.length > 0 && (
            <div className="flex space-x-4 text-sm">
              {links.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  onClick={link.onClick}
                  className="hover:text-blue-400 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;