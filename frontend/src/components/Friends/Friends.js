import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Spinner, InputGroup } from 'react-bootstrap';
import axios from 'axios';
import "./Friends.css"
import emptyImage from "../../assets/images/profile-empty.png"
import friendsImage from "../../assets/images/friends.jpeg"
import { useNavigate } from "react-router-dom";
import { IoSearchSharp } from "react-icons/io5";

const Friends = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/friends", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        setFriends(response.data); 
        setLoading(false);
      } catch (error) {
        console.error("Error loading friends.:", error);
        setError("Error loading friends.");
        setLoading(false);
      }
    };

    fetchFriends();
  }, []);

  const removeFriend = async (friendId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/friends/remove",
        { friendId }, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      setFriends(friends.filter(friend => friend._id !== friendId));
      
    } catch (error) {
      console.error("Error removing friend:", error);
      setError("Error removing friend.");
    }
  };

  const handleViewProfile = (friendId) => {
    navigate(`/friends/viewProfile/${friendId}`)
  }

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query); 
    setIsSearching(true); 

    setTimeout(() => {
      setIsSearching(false); 
    }, 500);
  };

  if (loading) {
    return <p>Loading friends...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const filteredFriends = friends.filter(friend => 
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mt-6 main-friends-block">
      <h2 className='text-white'>My Friends</h2>
        <img src={friendsImage} alt="No friends" className="no-friends-image" />
        {friends.length !== 0 && (
          <InputGroup className="mb-4" style={{maxWidth: '300px', width: '100%'}}>
            <InputGroup.Text>
              <IoSearchSharp />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search for friends by username..."
              value={searchQuery}
              onChange={handleSearchChange} 
              />
          </InputGroup>
        )}
      {isSearching ? (
        <Spinner animation="border" variant="primary" className="mb-3" />
      ) : 
      filteredFriends.length === 0 ? (
        <div className="no-friends-message">
          <h3>You don't have any friends yet!</h3>
          <p>Start searching for friends and adding them to your list to chat and share moments!</p>
        </div>
      ) : (
        <div className="row">
          {filteredFriends.map((friend) => (
            <div className="col-md-4" key={friend._id}>
              <Card className="mb-4">
                <Card.Img variant="top" src={friend.profileImage ? `http://localhost:5000/${friend.profileImage}` : emptyImage} alt={friend.name} style={{height: '300px'}} />
                <Card.Body>
                  <Card.Title>{friend.name}</Card.Title>
                  <Button
                    onClick={() => handleViewProfile(friend._id)} 
                  >
                    View Profile
                  </Button>
                  <Button 
                    variant="danger" 
                    onClick={() => removeFriend(friend._id)} 
                    style={{marginLeft: '20px'}}
                  >
                    Remove Friend
                  </Button>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      )
    }
    </div>
  );
};

export default Friends;
