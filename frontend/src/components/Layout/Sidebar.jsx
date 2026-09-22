import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { NavLink, useLocation } from 'react-router-dom';
import {
  FaChevronRight,
  FaClipboardList,
  FaCog,
  FaFileInvoiceDollar,
  FaKey,
  FaMobileAlt,
  FaTachometerAlt,
  FaUserEdit,
  FaUsers,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaPlusCircle,
  FaBoxOpen,
  FaCertificate,
  FaBook,
  FaTimes,
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const getRole = (user) => {
  if (user?.role === 'partner') return 'ADMIN';
  if (user?.userType === 'Administration') return 'ADMIN';
  if (user?.userType === 'Sub Dealer') return 'SUB_DEALER';
  return 'DEALER';
};

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [serviceRequestsOpen, setServiceRequestsOpen] = useState(
    location.pathname.startsWith('/service-requests')
  );
  const [accountSettingsOpen, setAccountSettingsOpen] = useState(
    location.pathname.startsWith('/account')
  );
  const role = getRole(user);
  const allRoles = ['ADMIN', 'DEALER', 'SUB_DEALER'];
  const operationsRoles = ['ADMIN', 'DEALER', 'SUB_DEALER'];
  const currentPortalView = new URLSearchParams(location.search).get('view') || 'dashboard';

  const canShow = (roles = allRoles) => roles.includes(role);
  const isServiceRequestsActive = location.pathname.startsWith('/service-requests');
  const isAccountSettingsActive = location.pathname.startsWith('/account');
  const isDashboardActive = location.pathname === '/dashboard' && currentPortalView === 'dashboard';
  const isDeviceViewActive = (
    location.pathname === '/device-management'
    || (location.pathname === '/dashboard' && ['devices', 'mydevices'].includes(currentPortalView))
  );

  const getInitials = (name) => {
    if (!name) return 'CDB';
    const cleanName = name.replace(/[^a-zA-Z0-9\s]/g, '').trim();
    const parts = cleanName.split(/\s+/).filter(Boolean);
    if (parts.length === 0) return 'CDB';
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const brandName = role === 'ADMIN'
    ? 'CDB Portal V2'
    : (user?.companyName || user?.displayName || user?.username || 'CDB Portal V2');

  const brandLogoText = role === 'ADMIN' ? 'CDB' : getInitials(brandName);
  const sidebarRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Slide in sidebar container from left
      tl.fromTo(sidebarRef.current,
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
      );

      // Pop in brand logo and title
      tl.fromTo('.brand-logo-container',
        { scale: 0.4, rotation: -20, opacity: 0 },
        { scale: 1, rotation: 0, opacity: 1, duration: 0.5, ease: 'back.out(2)' },
        '-=0.35'
      );

      tl.fromTo('.brand-title-group',
        { x: -15, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4 },
        '-=0.3'
      );

      // Stagger in menu items
      const menuItems = document.querySelectorAll('.sidebar-menu-item');
      if (menuItems.length > 0) {
        tl.fromTo(menuItems,
          { x: -30, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.45, stagger: 0.035, ease: 'power2.out' },
          '-=0.2'
        );
      }
    }, sidebarRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (isOpen) {
      gsap.fromTo('.sidebar-menu-item',
        { x: -25, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.35, stagger: 0.03, ease: 'power2.out' }
      );
    }
  }, [isOpen]);

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`} ref={sidebarRef}>
      <div className="sidebar-brand">
        <div className="brand-logo-container">
          <span className="brand-logo-text">{brandLogoText}</span>
        </div>
        <div className="brand-title-group">
          <h2>{brandName}</h2>
          <span>Device Management System</span>
        </div>
        <button className="sidebar-close-btn" onClick={() => setIsOpen(false)} aria-label="Close sidebar">
          <FaTimes />
        </button>
      </div>

      <ul className="sidebar-menu" onClick={(e) => {
        if (e.target.closest('a')) {
          setIsOpen(false);
        }
      }}>
        <li className={`sidebar-menu-item ${isDashboardActive ? 'active' : ''}`}>
          <NavLink to="/dashboard?view=dashboard">
            <FaTachometerAlt className="menu-icon" />
            <span className="menu-text">Dashboard</span>
          </NavLink>
        </li>

        {canShow(['ADMIN']) && (
          <li className={`sidebar-menu-item ${location.pathname === '/invoice-generator' ? 'active' : ''}`}>
            <NavLink to="/invoice-generator">
              <FaFileInvoiceDollar className="menu-icon" />
              <span className="menu-text">Invoice Generator</span>
            </NavLink>
          </li>
        )}

        {canShow(['ADMIN', 'DEALER', 'SUB_DEALER']) && (
          <li className={`sidebar-menu-item ${isServiceRequestsActive ? 'active' : ''}`}>
            <div className="menu-link" onClick={() => setServiceRequestsOpen(!serviceRequestsOpen)}>
              <FaClipboardList className="menu-icon" />
              <span className="menu-text">Service Requests</span>
              <FaChevronRight className={`menu-arrow ${serviceRequestsOpen || isServiceRequestsActive ? 'open' : ''}`} />
            </div>
            <ul className={`sidebar-submenu ${serviceRequestsOpen || isServiceRequestsActive ? 'open' : ''}`}>
              <li className={location.pathname === '/service-requests/activation' ? 'active' : ''}>
                <NavLink to="/service-requests/activation">Activation Requests</NavLink>
              </li>
            </ul>
          </li>
        )}

        <li className={`sidebar-menu-item ${isAccountSettingsActive ? 'active' : ''}`}>
          <div className="menu-link" onClick={() => setAccountSettingsOpen(!accountSettingsOpen)}>
            <FaCog className="menu-icon" />
            <span className="menu-text">Account Settings</span>
            <FaChevronRight className={`menu-arrow ${accountSettingsOpen || isAccountSettingsActive ? 'open' : ''}`} />
          </div>
          <ul className={`sidebar-submenu ${accountSettingsOpen || isAccountSettingsActive ? 'open' : ''}`}>

            {user?.userType !== 'Dealer' && (
              <li className={location.pathname === '/account/edit-profile' ? 'active' : ''}>
                <NavLink to="/account/edit-profile">
                  <FaUserEdit className="submenu-icon" />
                  Edit Profile
                </NavLink>
              </li>
            )}

            <li className={location.pathname === '/account/change-password' ? 'active' : ''}>
              <NavLink to="/account/change-password">
                <FaKey className="submenu-icon" />
                Change Password
              </NavLink>
            </li>
          </ul>
        </li>




        {canShow(['ADMIN', 'DEALER']) && (
          <li className={`sidebar-menu-item ${location.pathname === '/user-management' ? 'active' : ''}`}>
            <NavLink to="/user-management">
              <FaUsers className="menu-icon" />
              <span className="menu-text">User Management</span>
            </NavLink>
          </li>
        )}





        {canShow(['ADMIN', 'DEALER']) && (
          <li className={`sidebar-menu-item ${location.pathname === '/due-dashboard' && new URLSearchParams(location.search).get('tab') !== 'renewals' ? 'active' : ''}`}>
            <NavLink to="/due-dashboard">
              <FaMoneyBillWave className="menu-icon" />
              <span className="menu-text">Due Dashboard</span>
            </NavLink>
          </li>
        )}

        {canShow(['ADMIN', 'DEALER']) && (
          <li className={`sidebar-menu-item ${location.pathname === '/ledger-book' ? 'active' : ''}`}>
            <NavLink to="/ledger-book">
              <FaBook className="menu-icon" />
              <span className="menu-text">Ledger Book</span>
            </NavLink>
          </li>
        )}

        {role === 'ADMIN' && (
          <li className={`sidebar-menu-item ${isDeviceViewActive ? 'active' : ''}`}>
            <NavLink to="/dashboard?view=devices">
              <FaMobileAlt className="menu-icon" />
              <span className="menu-text">Device Management</span>
            </NavLink>
          </li>
        )}

        {role === 'ADMIN' && (
          <li className={`sidebar-menu-item ${location.pathname === '/renewal-due-management' ? 'active' : ''}`}>
            <NavLink to="/renewal-due-management">
              <FaCalendarAlt className="menu-icon" />
              <span className="menu-text">Renewal Due Devices</span>
            </NavLink>
          </li>
        )}

        {canShow(['ADMIN', 'DEALER', 'SUB_DEALER']) && (
          <li className={`sidebar-menu-item ${location.pathname === '/add-device' ? 'active' : ''}`}>
            <NavLink to="/add-device">
              <FaPlusCircle className="menu-icon" />
              <span className="menu-text">{role === 'SUB_DEALER' ? 'Assign Device' : 'Add Device'}</span>
            </NavLink>
          </li>
        )}



        {canShow(['ADMIN']) && (
          <li className={`sidebar-menu-item ${location.pathname === '/certificates' ? 'active' : ''}`}>
            <NavLink to="/certificates">
              <FaCertificate className="menu-icon" />
              <span className="menu-text">Certificates</span>
            </NavLink>
          </li>
        )}

      </ul>
    </div>
  );
};

export default Sidebar;
