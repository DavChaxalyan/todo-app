import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import Logo from "../../assets/images/logo-site/todo.webp";

const Login = () => {
  const [inputUsername, setInputUsername] = useState("");
  const [inputPassword, setInputPassword] = useState("");

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); 

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        username: inputUsername,
        password: inputPassword
      });

      if (response.status === 200) {
        localStorage.setItem('token', response.data.token);
        navigate('/');
      }

      setLoading(false);
    } catch (err) {
      setShow(true);
      setLoading(false);
    }
  };

  return (
    <div
      className="sign-in__wrapper"
      style={{ backgroundColor: 'cornsilk' }}
    >
      {/* Overlay */}
      <div className="sign-in__backdrop"></div>
      {/* Form */}
      <Form className="shadow p-4 bg-white rounded" onSubmit={handleLogin}>
        {/* Header */}
        <img
          className="img-thumbnail mx-auto d-block mb-2"
          src={Logo}
          alt="logo"
        />
        <div className="h4 mb-2 text-center">Sign In</div>
        {/* Alert */}
        {show ? (
          <Alert
            className="mb-2"
            variant="danger"
            onClose={() => setShow(false)}
            dismissible
          >
            Incorrect username or password.
          </Alert>
        ) : (
          <div />
        )}
        <Form.Group className="mb-2" controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            value={inputUsername}
            placeholder="Username"
            onChange={(e) => setInputUsername(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-2" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={inputPassword}
            placeholder="Password"
            onChange={(e) => setInputPassword(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-2" controlId="checkbox">
          <Form.Check type="checkbox" label="Remember me" />
        </Form.Group>
        {!loading ? (
          <Button className="w-100" variant="primary" type="submit">
            Log In
          </Button>
        ) : (
          <Button className="w-100" variant="primary" type="submit" disabled>
            Logging In...
          </Button>
        )}
        <div className="d-grid justify-content-end">
          <Button
            className="text-muted px-0"
            variant="link"
            onClick={() => navigate('/forgot-password')}
          >
            Forgot password?
          </Button>
        </div>
        <div className="d-grid mt-3">
          <Button
            className="w-100"
            variant="secondary"
            onClick={() => navigate('/register')}
          >
            Create an account
          </Button>
        </div>
      </Form>
      {/* Footer */}
      <div className="w-100 mb-2 position-absolute bottom-0 start-50 translate-middle-x text-white text-center">
        <p>&copy; 2024 todo-app. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Login;
