import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import logo from '../Assets/logo.png';
import { motion } from 'framer-motion';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    district: '',
    phoneNumber: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
  });

  const navigate = useNavigate();

  const { name, email, password, address, district, phoneNumber } = formData;

  // ✅ Input change handler with real-time validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validate as user types
    let error = '';
    if (name === 'name') error = validateName(value);
    else if (name === 'email') error = validateEmail(value);
    else if (name === 'password') error = validatePassword(value);
    else if (name === 'phoneNumber') error = validatePhoneNumber(value);

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // ✅ Only letters and spaces allowed for Name
  const validateName = (name) => {
    const namePattern = /^[A-Za-z\s]+$/;
    if (!name) return 'Name is required';
    if (!namePattern.test(name)) {
      return 'Name can only contain letters and spaces';
    }
    return '';
  };

  // ✅ Email must include "@"
  const validateEmail = (email) => {
    if (!email) return 'Email is required';
    if (!email.includes('@')) return 'Email must contain "@"';
    return '';
  };

  // ✅ Password between 8–20 characters
  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 8 || password.length > 20) {
      return 'Password must be between 8 and 20 characters';
    }
    return '';
  };

  // ✅ Phone number must start with 0 and be 10 digits
  const validatePhoneNumber = (phoneNumber) => {
    const phonePattern = /^0[0-9]{9}$/;
    if (!phoneNumber) return 'Phone number is required';
    if (!phonePattern.test(phoneNumber)) {
      return 'Phone number must start with 0 and have exactly 10 digits';
    }
    return '';
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Final validation before submitting
    const nameError = validateName(name);
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const phoneNumberError = validatePhoneNumber(phoneNumber);

    if (nameError || emailError || passwordError || phoneNumberError) {
      setErrors({
        name: nameError,
        email: emailError,
        password: passwordError,
        phoneNumber: phoneNumberError,
      });
      return;
    }

    try {
      const res = await axios.post('http://localhost:8070/api/auth/register', formData);
      localStorage.setItem('token', res.data.token);
      navigate('/login');
    } catch (err) {
      console.error(err);
      alert('User registration failed. Please try again.');
    }
  };

  return (
    <motion.div
      className="register-wrapper"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="register-container"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.img 
          src={logo} 
          alt="Logo" 
          className="register-logo"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ rotate: 360 }}
        />

        <motion.h2
          className="register-title"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Register
        </motion.h2>

        <motion.form
          onSubmit={handleRegister}
          className="register-form"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          {/* Name */}
          <motion.div
            className="input-group"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={handleChange}
              placeholder="John Doe"
              required
            />
            {errors.name && (
              <motion.span
                className="error-message"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {errors.name}
              </motion.span>
            )}
          </motion.div>

          {/* Email */}
          <motion.div
            className="input-group"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="john@example.com"
              required
            />
            {errors.email && (
              <motion.span className="error-message">{errors.email}</motion.span>
            )}
          </motion.div>

          {/* Password */}
          <motion.div
            className="input-group"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.2 }}
          >
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
              placeholder="Min. 8 characters"
              required
            />
            {errors.password && (
              <motion.span className="error-message">{errors.password}</motion.span>
            )}
          </motion.div>

          {/* Phone Number */}
          <motion.div
            className="input-group"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.4 }}
          >
            <label>Phone Number:</label>
            <input
              type="text"
              name="phoneNumber"
              value={phoneNumber}
              onChange={handleChange}
              placeholder="e.g., 0712345678"
              required
            />
            {errors.phoneNumber && (
              <motion.span className="error-message">{errors.phoneNumber}</motion.span>
            )}
          </motion.div>

          {/* Address */}
          <motion.div
            className="input-group"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.6 }}
          >
            <label>Address:</label>
            <input
              type="text"
              name="address"
              value={address}
              onChange={handleChange}
              placeholder="123 Main Street"
              required
            />
          </motion.div>

          {/* District */}
          <motion.div
            className="input-group"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.8 }}
          >
            <label>District:</label>
            <input
              type="text"
              name="district"
              value={district}
              onChange={handleChange}
              placeholder="e.g., Colombo"
              required
            />
          </motion.div>

          <motion.button
            type="submit"
            className="register-button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 2 }}
          >
            Register
          </motion.button>
        </motion.form>

        <motion.p
          className="register-footer"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 2.2 }}
        >
          Already have an account? <a href="/login">Login Here</a>
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default Register;
