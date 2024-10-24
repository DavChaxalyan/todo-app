import React from 'react'
import {
    Button,
    Modal,
  } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import { FaHourglassEnd } from "react-icons/fa6";
import { FaUserFriends } from "react-icons/fa";
import { SlUserFollow } from "react-icons/sl";

const SearchModal = ({showModal, handleCloseModal, searchResults, userId, imageProfile, handleSendFriendRequest, allNotifications}) => {
  const navigate = useNavigate();

  const handleViewProfile = (userId) => {
    handleCloseModal()
    navigate(`/friends/viewProfile/${userId}`)
  }

  return (
    <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Search Results</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-add-friends">
          {searchResults.length > 0 && (!(searchResults.length === 1 && searchResults[0]._id === userId)) ? (
            searchResults
              .filter((user) => user._id !== userId)
              .map((user) => (
                <div
                  key={user._id}
                  className="d-flex justify-content-between align-items-center"
                >
                  <div className="d-flex align-items-center gap-2">
                    <img
                      src={
                        user.profileImage
                          ? `http://localhost:5000/${user.profileImage}`
                          : imageProfile
                      }
                      alt={user.name}
                      height="50"
                      width="50"
                      className="rounded-circle"
                      style={{cursor: 'pointer'}}
                      onClick={() => handleViewProfile(user._id)}
                    />
                    <div className='d-flex flex-column'>
                      <span onClick={() => handleViewProfile(user._id)} style={{cursor: 'pointer'}}><strong>{user.name}</strong></span>
                      <span>username: <strong>{user.username}</strong></span>
                    </div>
                  </div>
                  {user.hasFriendList === "friend" ? (
                    <Button variant="secondary" className='d-flex align-items-center gap-1' disabled style={{backgroundColor: 'green'}}>
                      <FaUserFriends />
                      my friend
                    </Button>
                  ) : user.hasFriendList === "request" ? (
                    <Button variant="secondary" className='d-flex align-items-center gap-1' disabled>
                      <FaHourglassEnd />
                      Request Sent
                    </Button>
                  ) : (
                    <Button onClick={() => handleSendFriendRequest(user)} className='d-flex align-items-center gap-1'>
                      <SlUserFollow />
                      Add Friend
                    </Button>
                  )}
                </div>
              ))
          ) : (
            <p>No users found.</p>
          )}
        </Modal.Body>
      </Modal>
  )
}

export default SearchModal