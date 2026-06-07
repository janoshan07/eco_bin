import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Include the CSS for styling
import logo from '../Assets/logo.png';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Handle login errors
  const navigate = useNavigate();

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Send login request to the backend
      const res = await axios.post('http://localhost:8070/api/auth/login', {
        email,
        password,
      });
 
      

      const { token, userType } = res.data; // Extract token and userType from response

      // Store token and mark as logged in
      localStorage.setItem('token', token);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', email);


      // Navigate based on user type
      if (userType === 'admin') {
        navigate('/AdminHome', { state: { userEmail: email } }); // Navigate to admin home if user is an admin
      } else {
        localStorage.setItem('userEmail', email);
        navigate('/UserHome', { state: { userEmail: email } }); // Navigate to user home otherwise
        
      }
    } catch (err) {
      console.error(err);
      setError('Invalid Credentials. Please try again.');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
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
      <motion.div 
        className="login-container"
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        <motion.img 
          src={logo} 
          alt="Logo" 
          className="login-logo"
          variants={itemVariants}
          whileHover={{ rotate: 360 }}
          transition={{ duration: 1 }}
        />
        <motion.h2 
          className="login-title"
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
        >
          Login
        </motion.h2>
        {/* Display login error message */}
        <AnimatePresence>
          {error && (
            <motion.p 
              className="error-message"
              variants={itemVariants}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
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
          {/* Email Input Field */}
          <motion.div 
            className="input-group1"
            variants={itemVariants}
            whileHover={{ x: 5 }}
            transition={{ duration: 0.3 }}
          >
            <label>Email:</label>
            <motion.input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              whileFocus={{ scale: 1.02 }}
            />
          </motion.div>
      
          {/* Password Input Field */}
          <motion.div 
            className="input-group1"
            variants={itemVariants}
            whileHover={{ x: 5 }}
            transition={{ duration: 0.3 }}
          >
            <label>Password:</label>
            <motion.input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              whileFocus={{ scale: 1.02 }}
            />
          </motion.div>

          {/* Login Button */}
          <motion.button 
            type="submit" 
            className="login-button"
            variants={itemVariants}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 8px 25px rgba(46, 191, 145, 0.4)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            Login
          </motion.button>
        </motion.form>

        <motion.p 
          className="login-footer"
          variants={itemVariants}
        >
          Don't have an account? <a href="/register">Register Here</a>
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default Login;
