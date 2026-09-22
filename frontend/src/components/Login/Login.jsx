import { useState, useEffect, useRef } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import gsap from 'gsap';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, loading, isAuthenticated, checkingAuth } = useAuth();
  const navigate = useNavigate();

  // Refs for GSAP
  const pageRef = useRef(null);
  const cardRef = useRef(null);
  const logoRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const formRef = useRef(null);
  const footerRef = useRef(null);
  const orbsRef = useRef(null);

  useEffect(() => {
    if (checkingAuth || isAuthenticated) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Animate floating orbs
      gsap.utils.toArray('.login-orb').forEach((orb, i) => {
        gsap.fromTo(orb,
          { opacity: 0, scale: 0 },
          { opacity: 1, scale: 1, duration: 1.2, delay: 0.2 + i * 0.15, ease: 'elastic.out(1, 0.5)' }
        );
        gsap.to(orb, {
          y: `random(-30, 30)`,
          x: `random(-20, 20)`,
          rotation: `random(-10, 10)`,
          duration: `random(4, 7)`,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: i * 0.3,
        });
      });

      // Card entrance — scale + fade from bottom
      tl.fromTo(cardRef.current,
        { opacity: 0, y: 60, scale: 0.92 },
        { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'back.out(1.4)' }
      );

      // Logo pulse in
      tl.fromTo(logoRef.current,
        { opacity: 0, scale: 0.3, rotation: -20 },
        { opacity: 1, scale: 1, rotation: 0, duration: 0.7, ease: 'back.out(2)' },
        '-=0.5'
      );

      // Title slide up
      tl.fromTo(titleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5 },
        '-=0.35'
      );

      // Subtitle fade
      tl.fromTo(subtitleRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4 },
        '-=0.25'
      );

      // Form fields stagger in
      const formItems = formRef.current?.querySelectorAll('.form-group, .login-btn');
      if (formItems?.length) {
        tl.fromTo(formItems,
          { opacity: 0, x: -25 },
          { opacity: 1, x: 0, duration: 0.45, stagger: 0.12, ease: 'power2.out' },
          '-=0.15'
        );
      }

      // Footer
      tl.fromTo(footerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4 },
        '-=0.2'
      );

    }, pageRef);

    return () => ctx.revert();
  }, [checkingAuth, isAuthenticated]);

  if (checkingAuth) {
    return (
      <div className="login-loading-screen">
        <div className="login-spinner" />
        <span>Checking session...</span>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }

    // Button press animation
    gsap.fromTo('.login-btn',
      { scale: 0.97 },
      { scale: 1, duration: 0.3, ease: 'elastic.out(1, 0.4)' }
    );

    const result = await login(username, password);
    if (result.success) {
      // Exit animation
      gsap.to(cardRef.current, {
        opacity: 0, y: -30, scale: 0.95,
        duration: 0.4, ease: 'power2.in',
        onComplete: () => navigate('/dashboard')
      });
    } else {
      setError(result.message);
      // Shake animation on error
      gsap.fromTo(cardRef.current,
        { x: -8 },
        { x: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' }
      );
    }
  };

  return (
    <div className="login-page" ref={pageRef}>
      {/* Animated gradient background orbs */}
      <div className="login-orbs" ref={orbsRef}>
        <div className="login-orb orb-1" />
        <div className="login-orb orb-2" />
        <div className="login-orb orb-3" />
        <div className="login-orb orb-4" />
        <div className="login-orb orb-5" />
      </div>

      {/* Grid pattern overlay */}
      <div className="login-grid-pattern" />

      <div className="login-container">
        <div className="login-card" ref={cardRef}>
          {/* Logo + Title Area */}
          <div className="login-logo-area">
            <div className="hex-logo" ref={logoRef}>
              <svg viewBox="0 0 100 100" className="hex-svg">
                <defs>
                  <linearGradient id="hexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                </defs>
                <polygon
                  points="50,2 93,25 93,75 50,98 7,75 7,25"
                  fill="url(#hexGrad)"
                  stroke="none"
                />
                <polygon
                  points="50,12 83,30 83,70 50,88 17,70 17,30"
                  fill="rgba(255,255,255,0.15)"
                  stroke="none"
                />
              </svg>
              <span className="hex-logo-text">CDB</span>
            </div>
            <h1 className="login-title" ref={titleRef}>CDB Portal V2</h1>
            <p className="login-subtitle" ref={subtitleRef}>Device Management System</p>
          </div>

          {/* Form */}
          <div className="login-body" ref={formRef}>
            {error && (
              <div className="login-error">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <div className="input-wrapper">
                  <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    autoComplete="username"
                  />
                </div>
              </div>

              <div className="form-group password-group">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? (
                  <span className="btn-loading">
                    <div className="login-spinner login-spinner-sm" />
                    Signing in...
                  </span>
                ) : (
                  <>
                    Sign In
                    <svg className="btn-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"/>
                      <polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="login-footer" ref={footerRef}>
            <p>2026 &copy; CDB Portal V2. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
