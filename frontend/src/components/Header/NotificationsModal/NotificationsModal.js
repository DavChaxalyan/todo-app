import React from 'react'
import {
    Button,
    Modal,
  } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import { TiDelete } from "react-icons/ti";

const NotificationsModal = ({ showNotificationsModal, handleCloseNotificationsModal, notifications, imageProfile, handleRespondToRequest, handleDeclineNotification }) => {
  const navigate = useNavigate();

  const handleProfilePage = (userId) => {
    navigate(`/friends/viewProfile/${userId}`)
    handleCloseNotificationsModal()
  }
  return (
    <Modal
        show={showNotificationsModal}
        onHide={handleCloseNotificationsModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>Notifications</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-add-friends">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification._id} 
                className="d-flex justify-content-between align-items-center"
              >
                <div className="d-flex align-items-center gap-2">
                  <img
                    src={
                      notification.profileImage
                        ? `http://localhost:5000/${notification.profileImage}`
                        : imageProfile
                    }
                    alt={notification.senderName}
                    height="30"
                    width="30"
                    className="rounded-circle"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleProfilePage(notification.senderId)}
                  />
                  <p className="m-0">
                    <strong style={{color: '#186522', cursor: 'pointer'}} onClick={() => handleProfilePage(notification.senderId)}>{notification.senderName}</strong> {notification.message}.
                  </p>
                </div>
                {notification.type === 'friend-request' ? (
                  <div className="d-flex gap-2">
                  <Button
                    onClick={
                      () => handleRespondToRequest(notification._id) 
                    }
                    className="button_accept"
                  >
                    Accept
                  </Button>
                  <Button
                    onClick={
                      () => handleDeclineNotification(notification._id) 
                    }
                    className="button_decline"
                  >
                    Decline
                  </Button>
                </div>
                ) : (
                  <div className="d-flex gap-2">
                    <TiDelete style={{fontSize: '25px', cursor: 'pointer'}} onClick={
                      () => handleDeclineNotification(notification._id) 
                    }/>
                  </div>
                )}
                
              </div>
            ))
          ) : (
            <p>No notifications.</p>
          )}
        </Modal.Body>
      </Modal>
  )
}

export default NotificationsModal