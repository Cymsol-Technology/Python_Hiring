import React, { useState } from 'react';
import { Menu, X, Home, Settings, Users, FileText, User, LogOut, ChevronRight } from 'lucide-react';
import PageLayout from "./PageLayout";

export default function ProjectPage() {
  const menuItems = [
    {
      label: 'Dashboard',
      icon: <Home size={20} />,
      href: '#dashboard',
      onClick: (e) => { e.preventDefault(); console.log('Dashboard clicked'); }
    },
    {
      label: 'Users',
      icon: <Users size={20} />,
      href: '#users',
      onClick: (e) => { e.preventDefault(); console.log('Users clicked'); }
    },
    {
      label: 'Documents',
      icon: <FileText size={20} />,
      href: '#documents',
      onClick: (e) => { e.preventDefault(); console.log('Documents clicked'); }
    },
    {
      label: 'Settings',
      icon: <Settings size={20} />,
      href: '#settings',
      onClick: (e) => { e.preventDefault(); console.log('Settings clicked'); }
    }
  ];

  const user = {
    name: 'John Doe',
    email: 'john@example.com',
    avatar: null // You can add an image URL here
  };

  const breadcrumbItems = [
    { label: 'Home', href: '#home' },
    { label: 'Dashboard', href: '#dashboard' },
    { label: 'Overview' }
  ];

  const footerLinks = [
    { label: 'Privacy Policy', href: '#privacy' },
    { label: 'Terms of Service', href: '#terms' },
    { label: 'Contact', href: '#contact' }
  ];

  const handleLogout = () => {
    console.log('Logout clicked');
    alert('Logout functionality would go here');
  };

  const navbarActions = (
    <>
      <button className="px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
        Profile
      </button>
    </>
  );

  return (
    <PageLayout
      logo={null} // You can add logo URL here like: "https://via.placeholder.com/32"
      navbarTitle="My Application"
      navbarActions={navbarActions}
      menuItems={menuItems}
      user={user}
      onLogout={handleLogout}
      breadcrumb={breadcrumbItems}
      contentTitle="Welcome to Dashboard"
      copyrightText="© 2025 My Application. All rights reserved."
      footerLinks={footerLinks}
      defaultSidebarOpen={true}
    >
      {/* Your page content goes here */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div
            key={item}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Card {item}
            </h3>
            <p className="text-gray-600">
              This is some sample content for card {item}. The layout
              adjusts automatically when the sidebar is toggled.
            </p>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Action
            </button>
          </div>
        ))}
      </div>
      
      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          Reusable Component Architecture
        </h3>
        <p className="text-gray-600 mb-4">
          This layout is now built with reusable components that accept props for maximum flexibility.
          You can easily customize the navbar, sidebar, content, and footer by passing different props.
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>Navbar accepts logo, title, and custom actions</li>
          <li>Sidebar accepts menu items, user data, and logout handler</li>
          <li>Breadcrumb component for navigation hierarchy</li>
          <li>MainContent accepts title and breadcrumb</li>
          <li>Footer accepts copyright text and links</li>
        </ul>
      </div>
    </PageLayout>
  );
}