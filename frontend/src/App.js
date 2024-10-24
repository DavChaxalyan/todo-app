import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/LoginForm/Login';
import Register from './components/RegistrationForm/Register';
import TodoList from './components/TodoList/TodoList';
import Profile from './components/Profile/Profile';
import Home from './pages/Home/Home';
import Layout from './Layout';
import ProtectedRoute from './Protected';
import Friends from '../src/components/Friends/Friends'
import FriendsProfile from './components/FriendsProfile/FriendsProfile';
import HelpPage from './pages/HelpPage/HelpPage';
import TodoFriendPage from './pages/TodoFriendPage.js/TodoFriendPage';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import ResetPassword from './components/ResetPassword/ResetPassword';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/register" element={<Register />} />
        <Route element={<Layout />}> 
          <Route path="/" element={ <ProtectedRoute> <Home /> </ProtectedRoute> } />
          <Route path="/todos" element={ <ProtectedRoute> <TodoList /> </ProtectedRoute> } />
          <Route path="/profile" element={ <ProtectedRoute> <Profile /> </ProtectedRoute> } />
          <Route path="/friends" element={ <ProtectedRoute> <Friends /> </ProtectedRoute> } />
          <Route path="/friends/viewProfile/:id" element={ <ProtectedRoute> <FriendsProfile /> </ProtectedRoute> } />
          <Route path="/help" element={ <ProtectedRoute> <HelpPage /> </ProtectedRoute> } />
          <Route path="/friend/todos/:id" element={ <ProtectedRoute> <TodoFriendPage /> </ProtectedRoute> } />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
