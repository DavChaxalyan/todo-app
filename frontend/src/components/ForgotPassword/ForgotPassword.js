import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import Logo from "../../assets/images/logo-site/todo.webp";
import "./ForgotPassword.css"
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://todo-app-yuun.onrender.com/api/forgot-password', { email });
      setMessage(response.data.message);
      setError('');
    } catch (err) {
      setError(err.response.data.message);
      setMessage('');
    }
  };

  return (
    <div
      className="sign-in__wrapper"
      style={{ backgroundColor: 'cornsilk' }}
    >
      <div className="sign-in__backdrop"></div>
        {/* Form */}
        <Form onSubmit={handleSubmit} className='forgot-password-block'>
        <img
                    className="img-thumbnail mx-auto d-block mb-2"
                    src={Logo}
                    alt="logo"
                    />
                    <h2 className="text-center mb-4">Reset Password</h2>
        <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control 
            type="email" 
            placeholder="Enter your email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            />
        </Form.Group>
        <div className='d-flex align-items-center justify-content-between'>
        <Button variant="primary" type="submit" className='mt-3 mb-2'>
            Send Reset Link
        </Button>
        <Link to="/login" style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>
                Back
        </Link>
        </div>
        {message && <Alert variant="success">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}
        </Form>
      {/* Footer */}
      <div className="w-100 mb-2 position-absolute bottom-0 start-50 translate-middle-x text-white text-center">
        <p>&copy; 2024 todo-app. All rights reserved.</p>
      </div>
    
    </div>

  );
};

export default ForgotPassword;