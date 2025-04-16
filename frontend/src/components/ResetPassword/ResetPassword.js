import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import "./ResetPassword.css"
import Logo from "../../assets/images/logo-site/todo.webp";

const ResetPassword = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        if (newPassword !== repeatPassword) {
            setError("Passwords do not match");
            return;
        }
      const response = await axios.post(`https://todo-app-yuun.onrender.com/api/reset-password/${token}`, { newPassword });
      setMessage(response.data.message);
      setError('');
      setTimeout(() => {
        navigate('/login')
      }, 500)
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
            <Form onSubmit={handleSubmit} className='reset-password-block'>
                <img
                  className="img-thumbnail mx-auto d-block mb-2"
                  src={Logo}
                  alt="logo"
                />
                <h2 className="text-center mb-4">Reset Password</h2>
                <Form.Group controlId="formNewPassword">
                    <Form.Label>New password</Form.Label>
                    <Form.Control 
                        type="password" 
                        placeholder="Enter your new password" 
                        value={newPassword} 
                        onChange={(e) => setNewPassword(e.target.value)} 
                        required 
                    />
                </Form.Group>
                <Form.Group controlId="formRepeatPassword" className='mt-3'>
                    <Form.Label>repeat new password</Form.Label>
                    <Form.Control 
                        type="password" 
                        placeholder="Repeat your new password" 
                        value={repeatPassword} 
                        onChange={(e) => setRepeatPassword(e.target.value)} 
                        required 
                    />
                </Form.Group>
                <Button variant="primary" type="submit" className="mt-3">
                    Reset Password
                </Button>
                {message && <Alert variant="success" className="mt-3">{message}</Alert>}
                {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
            </Form>
      {/* Footer */}
      <div className="w-100 mb-2 position-absolute bottom-0 start-50 translate-middle-x text-white text-center">
        <p>&copy; 2024 todo-app. All rights reserved.</p>
      </div>
    </div>
  );
};

export default ResetPassword;