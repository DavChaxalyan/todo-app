import React, { useState } from 'react'
import {
    Navbar,
    Nav,
    NavDropdown,
    Form,
    Button,
    Badge,
  } from "react-bootstrap";
import { FaHireAHelper } from "react-icons/fa6";
import { IoLogOutSharp } from "react-icons/io5";
import { RiProfileFill } from "react-icons/ri";
import { IoIosNotifications } from "react-icons/io";
import "./Navbar.css"

const HeaderNavbar = ({handlePage, handleSearch, searchTerm, setSearchTerm, user, imageProfile, handleShowNotifications, notifications}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const handleClickMenu = () => {
    setMenuOpen(!menuOpen);
  }
  return (
    <Navbar bg="light" expand="lg" className="main-header-block">
        <Navbar.Brand onClick={() => handlePage('')}>
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0nOf8qSK9p1Eqjl1QNmvibzrzvZ4UujhVnQ&s"
            height="30"
            alt="Logo"
            loading="lazy"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={handleClickMenu}/>
        <Navbar.Collapse
          id="basic-navbar-nav"
          className={`d-flex justify-content-between navbar-block ${menuOpen ? 'open' : ''}`}
        >
          <Nav className="mr-auto main-navbar-items">
            <Nav.Link onClick={() => handlePage('')}>
              Home
            </Nav.Link>
            <Nav.Link onClick={() => handlePage('todos')}>My List</Nav.Link>
            <Nav.Link onClick={() => handlePage('friends')}>Friends</Nav.Link>
          </Nav>
          <Form onSubmit={handleSearch} className="d-flex">
            <Form.Control
              type="text"
              placeholder="Search Users"
              className="mr-sm-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button type="submit" variant="outline-success" disabled={!searchTerm}>
              Search
            </Button>
          </Form>
          <Nav className="profileIcon">
            <NavDropdown
              title={
                <img
                  src={user.profileImage ? `http://localhost:5000/${user.profileImage}` : imageProfile}
                  className="rounded-circle"
                  height="40"
                  width="40"
                  alt="Profile"
                />
              }
              id="basic-nav-dropdown"
            >
              <NavDropdown.Item onClick={() => handlePage('profile')} className='d-flex align-items-center gap-2'><RiProfileFill />Your Profile</NavDropdown.Item>
              <NavDropdown.Item onClick={() => handlePage('help')} className='d-flex align-items-center gap-2'><FaHireAHelper />Help</NavDropdown.Item>
              <NavDropdown.Item onClick={() => handlePage('login')} className='d-flex align-items-center gap-2'><IoLogOutSharp />Log Out</NavDropdown.Item>
            </NavDropdown>
            <Button
              variant="outline-primary"
              onClick={handleShowNotifications}
              className="ml-2"
            >
              <IoIosNotifications style={{fontSize: '25px', fill: '#c9a326'}} />
              
              <Badge pill bg="danger">
                {notifications.length}
              </Badge>
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
  )
}

export default HeaderNavbar