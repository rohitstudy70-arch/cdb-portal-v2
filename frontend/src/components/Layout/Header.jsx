import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { FaBars, FaBell, FaUser, FaCaretDown, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const Header = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const headerRef = useRef(null);
  const profileMenuRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Header drop down from top
      tl.fromTo('.header',
        { y: -60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', clearProps: 'transform' }
      );

      // Stagger child elements
      tl.fromTo(['.header-left', '.search-box.desktop-search', '.notification-bell', '.profile-menu'],
        { y: -18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, stagger: 0.08, ease: 'back.out(1.4)', clearProps: 'transform' },
        '-=0.3'
      );

      // Breadcrumb bar drop down
      tl.fromTo('.breadcrumb-bar',
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out', clearProps: 'transform' },
        '-=0.2'
      );
    }, headerRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    // Smooth transition on breadcrumbs on route change
    gsap.fromTo('.breadcrumbs',
      { opacity: 0, x: -15 },
      { opacity: 1, x: 0, duration: 0.35, ease: 'power2.out' }
    );
  }, [location.pathname, location.search]);

  const handleLogout = () => {
    logout();
  };

  // Generate breadcrumbs based on pathname
  const getBreadcrumbs = () => {
    const path = location.pathname;
    const view = new URLSearchParams(location.search).get('view') || 'dashboard';
    const portalLabels = {
      dashboard: 'Dashboard',
      dealers: 'Dealer Management',
      subdealers: 'Sub Dealer Management',
      users: 'User Management',
      devices: 'Device Management',
      customers: 'Customer Database',
      reports: 'Reports',
      profile: 'My Profile',
      mydevices: 'My Devices',
      renewals: 'Renewal Requests',
    };

    if (path === '/dashboard') {
      return (
        <div className="breadcrumbs">
          <Link to="/dashboard">Home</Link>
          <span>/</span>
          <span className="active-crumb">{portalLabels[view] || 'Dashboard'}</span>
        </div>
      );
    }
    if (path === '/invoice-generator') {
      return (
        <div className="breadcrumbs">
          <Link to="/dashboard">Home</Link>
          <span>/</span>
          <span className="active-crumb">Invoice Generator</span>
        </div>
      );
    }
    if (path === '/service-requests/activation') {
      return (
        <div className="breadcrumbs">
          <Link to="/dashboard">Home</Link>
          <span>/</span>
          <span>Activation Request</span>
          <span>/</span>
          <span className="active-crumb">Activation Requests List</span>
        </div>
      );
    }

    if (path === '/account/change-password') {
      return (
        <div className="breadcrumbs">
          <Link to="/dashboard">Home</Link>
          <span>/</span>
          <span className="active-crumb">Password Reset</span>
        </div>
      );
    }
    if (path === '/due-dashboard') {
      const tab = new URLSearchParams(location.search).get('tab');
      return (
        <div className="breadcrumbs">
          <Link to="/dashboard">Home</Link>
          <span>/</span>
          <span className="active-crumb">{tab === 'renewals' ? 'Renewal Due Devices' : 'Due Dashboard'}</span>
        </div>
      );
    }
    if (path === '/user-management') {
      return (
        <div className="breadcrumbs">
          <Link to="/dashboard">Home</Link>
          <span>/</span>
          <span>User Management</span>
          <span>/</span>
          <span className="active-crumb">Create User</span>
        </div>
      );
    }
    if (path === '/device-management') {
      return (
        <div className="breadcrumbs">
          <Link to="/dashboard">Home</Link>
          <span>/</span>
          <span className="active-crumb">Device Assignment</span>
          <span>/</span>
        </div>
      );
    }

    if (path === '/add-device') {
      return (
        <div className="breadcrumbs">
          <Link to="/dashboard">Home</Link>
          <span>/</span>
          <span className="active-crumb">{user?.userType === 'Sub Dealer' ? 'Assign Device' : 'Add Device'}</span>
        </div>
      );
    }

    if (path === '/iccid-search') {
      return (
        <div className="breadcrumbs">
          <Link to="/dashboard">Home</Link>
          <span>/</span>
          <span className="active-crumb">ICCID Search</span>
        </div>
      );
    }

    if (path === '/certificates') {
      return (
        <div className="breadcrumbs">
          <Link to="/dashboard">Home</Link>
          <span>/</span>
          <span className="active-crumb">Certificates</span>
        </div>
      );
    }

    return (
      <div className="breadcrumbs">
        <Link to="/dashboard">Home</Link>
      </div>
    );
  };

  const [globalSearch, setGlobalSearch] = useState('');
  const navigate = useNavigate();

  const handleGlobalSearchSubmit = (e) => {
    e.preventDefault();
    if (globalSearch.trim()) {
      navigate(`/iccid-search?search=${encodeURIComponent(globalSearch.trim())}`);
      setGlobalSearch('');
    }
  };

  const handleToggleClick = (e) => {
    if (e) {
      if (typeof e.preventDefault === 'function') e.preventDefault();
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
    }
    if (window.toggleCdbSidebar) {
      window.toggleCdbSidebar();
    } else if (toggleSidebar) {
      toggleSidebar();
    }
  };

  return (
    <div className="header-wrapper" ref={headerRef}>
      <div className="header">
        <div className="header-left">
          <button 
            type="button"
            className="menu-toggle-btn" 
            onClick={handleToggleClick} 
            onTouchStart={handleToggleClick}
            onPointerDown={handleToggleClick}
            aria-label="Toggle Navigation Menu"
          >
            <FaBars className="menu-toggle" />
          </button>
          <span 
            className="mobile-brand-title" 
            onClick={handleToggleClick}
            onTouchStart={handleToggleClick}
          >
            CDB Portal V2
          </span>
        </div>

        <div className="header-right">
          <form className="search-box desktop-search" onSubmit={handleGlobalSearchSubmit}>
            <input 
              type="text" 
              placeholder="Customer / IMEI / ICCID / Serial No / Vehicle No" 
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>

          <div className="notification-bell">
            <FaBell />
          </div>

          <div 
            className="profile-menu" 
            ref={profileMenuRef}
            onClick={() => setDropdownOpen(prev => !prev)}
          >
            <FaUser className="profile-icon" />
            <span className="profile-username">{user?.username || 'Admin'}</span>
            <FaCaretDown className={`profile-caret ${dropdownOpen ? 'caret-open' : ''}`} />

            {dropdownOpen && (
              <ul className="profile-dropdown" onClick={(e) => e.stopPropagation()}>
                <li 
                  onClick={(e) => {
                    e.stopPropagation();
                    setDropdownOpen(false);
                    handleLogout();
                  }}
                  className="logout-item"
                >
                  <FaSignOutAlt style={{ marginRight: '8px' }} /> 
                  <span>Logout</span>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="header-mobile-search">
        <form className="search-box mobile-search" onSubmit={handleGlobalSearchSubmit}>
          <input 
            type="text" 
            placeholder="Customer / IMEI / ICCID / Serial No / Vehicle No" 
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      </div>

      <div className="breadcrumb-bar">
        {getBreadcrumbs()}
      </div>
    </div>
  );
};

export default Header;
