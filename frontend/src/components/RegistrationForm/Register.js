import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css'; 

const Register = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [city, setCity] = useState('');
  const [interests, setInterests] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate(); 

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== repeatPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/register', {
        name,
        username,
        email,
        age,
        city,
        interests,
        password,
        profileImage: null
      });

      localStorage.setItem('token', response.data.token);

      setSuccess(true);
      setError('');
      navigate('/profile'); 
    } catch (err) {
      setError(err.response.data.message);
      setSuccess(false);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100 for-register">
      <Row className="w-100 d-contents">
        <Col md={6} className="bg-white p-4 rounded shadow">
          <h2 className="text-center">Register</h2>
          {success && <Alert variant="success">You have successfully registered!</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleRegister}>
            <Form.Group controlId="formName" className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </Form.Group>

            <Form.Group controlId="formUsername" className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)} 
                required 
              />
            </Form.Group>

            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control 
                type="email" 
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </Form.Group>

            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>Age</Form.Label>
              <Form.Control 
                type="number" 
                placeholder="Enter your Age"
                value={age}
                onChange={(e) => setAge(e.target.value)} 
                required 
                min={15}
                max={80}
              />
            </Form.Group>

            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>City</Form.Label>
              <Form.Control 
                type="string" 
                placeholder="Enter your City"
                value={city}
                onChange={(e) => setCity(e.target.value)} 
                required 
              />
            </Form.Group>

            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>Your Interests (no required)</Form.Label>
              <Form.Control 
                type="string" 
                placeholder="Enter your Interests"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}  
              />
            </Form.Group>

            <Form.Group controlId="formPassword" className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </Form.Group>

            <Form.Group controlId="formRepeatPassword" className="mb-3">
              <Form.Label>Repeat Password</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Repeat password"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)} 
                required 
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="mt-3 w-100">
              Register
            </Button>
            <Button 
              variant="link" 
              className="mt-3 w-100 text-center" 
              onClick={() => navigate('/login')}
            >
              Already have an account? Log In
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
