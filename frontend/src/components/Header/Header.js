import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Header.css";
import axios from "axios";
import imageProfile from "../../assets/images/profile-empty.png";
import HeaderNavbar from "./Navbar/Navbar";
import SearchModal from "./Search/SearchModal";
import NotificationsModal from "./NotificationsModal/NotificationsModal";

const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [allNotifications, setAllNotifications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState({})
  const navigate = useNavigate();

  const handlePage = (page) => {
    if (page === 'login') {
        localStorage.removeItem("token");
    }
    navigate(`/${page}`)
  }

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchTerm) {
      try {
        const token = localStorage.getItem("token");
        let userId = null;
        if (token) {
          const decodedToken = jwtDecode(token);
          userId = decodedToken.id;
          setUserId(userId);
        }
        const response = await axios.get(
          `https://todo-app-yuun.onrender.com/api/users/search?name=${searchTerm}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const resp = await axios.get("https://todo-app-yuun.onrender.com/api/friends", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const res = await axios.get(
          "https://todo-app-yuun.onrender.com/api/notifications/all",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const friendsIds = resp.data.map((friend) => friend._id); 
        const notificationsId = res.data.map(
          (notification) => notification.senderId._id
        ); 
        const notificationUserIds = res.data.map(
            (notification) => notification.userId
          ); 

        const updatedSearchResults = response.data.map((user) => {
          if (friendsIds.includes(user._id)) {
            return { ...user, hasFriendList: "friend" }; 
          }
          if (notificationsId.includes(userId) && notificationUserIds.includes(user._id)) {
            return { ...user, hasFriendList: "request" };
          } 
          return { ...user, hasFriendList: "no" };   
        });

        setAllNotifications(res.data);
        setSearchResults(updatedSearchResults);
        setShowModal(true); 
      } catch (error) {
        console.error("Error searching for users:", error);
      }
    }
  };

  useEffect(() => {
    if (userId) {
      console.log("User ID updated:", userId);
    }
  }, [userId]);

  useEffect(() => {
    const fetchUserData = async () => {
        try {
          const token = localStorage.getItem('token'); 
          const response = await axios.get('https://todo-app-yuun.onrender.com/api/profile', {
            headers: {
              'Authorization': `Bearer ${token}` 
            }
          });
          
          setUser(response.data);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };

      fetchUserData()
  }, []);

  const handleCloseModal = () => setShowModal(false);
  const handleCloseNotificationsModal = () => setShowNotificationsModal(false);

  const handleSendFriendRequest = async (user) => {
    const userId = user._id;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://todo-app-yuun.onrender.com/api/check-request?userId=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.exists) {
        alert("You have already sent a request to this user.");
        return; 
      }

      await axios.post(
        `https://todo-app-yuun.onrender.com/api/send-friend-request`,
        { user },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      handleCloseModal();
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  const handleShowNotifications = async () => {
    setShowNotificationsModal(true);
  };

  useEffect(() => {
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://todo-app-yuun.onrender.com/api/notifications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNotifications(
        response.data.map((notification) => ({
          ...notification,
          profileImage: notification.senderProfileImage,
          senderName: notification.senderName,
        }))
      );
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }
  fetchNotifications()
  }, [])

  const handleRespondToRequest = async (notificationId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `https://todo-app-yuun.onrender.com/api/friend-requests/respond`,
        { notificationId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNotifications((prev) =>
        prev.filter((notification) => notification._id !== notificationId)
      );
      handleCloseNotificationsModal()
    } catch (error) {
      console.error("Error responding to friend request:", error);
    }
  };

  const handleDeclineNotification = async (notificationId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `https://todo-app-yuun.onrender.com/api/delete-notification/${notificationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications((prev) =>
        prev.filter((notification) => notification._id !== notificationId)
      );
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data.message : error.message
      );
    }
  };

  return (
    <>
    {/* Navbar  */}

      <HeaderNavbar 
        handlePage={handlePage} 
        handleSearch={handleSearch} 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        user={user} 
        imageProfile={imageProfile} 
        handleShowNotifications={handleShowNotifications} 
        notifications={notifications}  
      />

      {/* Modal window with search results  */}

      <SearchModal 
        showModal={showModal} 
        handleCloseModal={handleCloseModal} 
        searchResults={searchResults} 
        userId={userId} 
        imageProfile={imageProfile} 
        handleSendFriendRequest={handleSendFriendRequest} 
        allNotifications={allNotifications} 
      />

      {/* Modal window with notifications */}

      <NotificationsModal 
        showNotificationsModal={showNotificationsModal} 
        handleCloseNotificationsModal={handleCloseNotificationsModal} 
        notifications={notifications} imageProfile={imageProfile} 
        handleRespondToRequest={handleRespondToRequest} 
        handleDeclineNotification={handleDeclineNotification} 
      />
    </>
  );
};

export default Header;
