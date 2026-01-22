import React, { useState } from 'react';
import { Menu, X, Home, Settings, Users, FileText, User, LogOut, ChevronRight } from 'lucide-react';
import Breadcrumb from './Breadcrumb';

const MainContent = ({ breadcrumb, title, children }) => {
  return (
    <main className="flex-1 overflow-y-auto bg-gray-100 transition-all duration-300">
      <div className="p-6">
        {breadcrumb && <Breadcrumb items={breadcrumb} />}
        {title && (
          <h2 className="text-3xl font-bold text-gray-800 mb-4">{title}</h2>
        )}
        {children}
      </div>
    </main>
  );
};

export default MainContent;