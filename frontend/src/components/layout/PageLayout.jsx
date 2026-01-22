import React, { useState } from 'react';
import { Menu, X, Home, Settings, Users, FileText, User, LogOut, ChevronRight } from 'lucide-react';
import Navbar from './NavBar';
import Sidebar from './SideBar';
import MainContent from './MainContent';
import Footer from './Footer';

const PageLayout = ({
  logo,
  navbarTitle,
  navbarActions,
  menuItems,
  user,
  onLogout,
  breadcrumb,
  contentTitle,
  children,
  copyrightText,
  footerLinks,
  defaultSidebarOpen = false
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(defaultSidebarOpen);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar
        logo={logo}
        title={navbarTitle}
        onToggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
        actions={navbarActions}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          isOpen={isSidebarOpen}
          menuItems={menuItems}
          user={user}
          onLogout={onLogout}
        />

        <MainContent breadcrumb={breadcrumb} title={contentTitle}>
          {children}
        </MainContent>
      </div>

      <Footer copyrightText={copyrightText} links={footerLinks} />
    </div>
  );
};

export default PageLayout;