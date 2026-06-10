import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import logo from '../Assets/logo.png';
import ConstellationCanvas from '../components/ConstellationCanvas';
import GoogleAuthModal from '../components/GoogleAuthModal';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [googleOpen, setGoogleOpen] = useState(false);
  const navigate = useNavigate();

  // 3D Tilt state
  const cardRef = useRef(null);
  const [tiltStyle, setTiltStyle] = useState({});

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rx = -(y / (rect.height / 2)) * 10;
    const ry = (x / (rect.width / 2)) * 10;
    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(10px)`,
      transition: 'transform 0.1s ease-out',
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)',
      transition: 'transform 0.5s ease',
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:8070/api/auth/login', {
        email,
        password,
      });

      const { token, userType } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', email);

      if (userType === 'admin') {
        navigate('/AdminHome', { state: { userEmail: email } });
      } else {
        navigate('/UserHome', { state: { userEmail: email } });
      }
    } catch (err) {
      console.error(err);
      setError('Invalid Credentials. Please try again.');
    }
  };

  const handleGoogleSuccess = (googleEmail, googleName) => {
    setGoogleOpen(false);
    localStorage.setItem('token', 'google_mock_token_123456');
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userEmail', googleEmail);
    localStorage.setItem('userName', googleName);

    if (googleEmail.includes('admin')) {
      navigate('/AdminHome', { state: { userEmail: googleEmail } });
    } else {
      navigate('/UserHome', { state: { userEmail: googleEmail } });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: { opacity: 0 }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div 
      className="login-wrapper"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* 3D Interactive Constellation Background */}
      <ConstellationCanvas />

      {/* Centered Glassmorphic Card Container */}
      <motion.div 
        ref={cardRef}
        className="login-container"
        style={tiltStyle}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        variants={itemVariants}
      >
        <motion.img 
          src={logo} 
          alt="Logo" 
          className="login-logo"
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
        />
        
        <motion.h2 
          className="login-title"
          variants={itemVariants}
        >
          MEMBER LOGIN
        </motion.h2>

        <AnimatePresence>
          {error && (
            <motion.p 
              className="error-message"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <motion.form 
          onSubmit={handleLogin} 
          className="login-form"
          variants={itemVariants}
        >
          {/* Username/Email Field with Left Icon Division */}
          <motion.div className="custom-input-group" variants={itemVariants}>
            <div className="input-icon-badge">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Username"
            />
          </motion.div>
      
          {/* Password Field with Left Icon Division */}
          <motion.div className="custom-input-group" variants={itemVariants}>
            <div className="input-icon-badge">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
            />
          </motion.div>

          {/* LOGIN Button */}
          <motion.button 
            type="submit" 
            className="login-button"
            variants={itemVariants}
            whileTap={{ scale: 0.98 }}
          >
            LOGIN
          </motion.button>
        </motion.form>

        <motion.p className="forgot-password" variants={itemVariants}>
          Forgot Password? <a href="/forgot">Click Here</a>
        </motion.p>

        <motion.div className="divider-line" variants={itemVariants}>
          <span>or</span>
        </motion.div>

        {/* Google Authentication Option */}
        <motion.button
          type="button"
          className="google-sign-in-btn"
          onClick={() => setGoogleOpen(true)}
          variants={itemVariants}
          whileTap={{ scale: 0.98 }}
        >
          <svg className="google-icon" viewBox="0 0 24 24" width="18" height="18">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </motion.button>

        {/* REGISTER button at bottom */}
        <motion.button
          type="button"
          className="register-redirect-button"
          onClick={() => navigate('/register')}
          variants={itemVariants}
          whileTap={{ scale: 0.98 }}
        >
          REGISTER
        </motion.button>
      </motion.div>

      <GoogleAuthModal 
        isOpen={googleOpen} 
        onClose={() => setGoogleOpen(false)} 
        onSuccess={handleGoogleSuccess}
      />
    </motion.div>
  );
};

export default Login;
