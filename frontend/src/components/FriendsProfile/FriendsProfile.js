import React, { useState, useEffect } from 'react';
import { Card, Button, ListGroup, Badge } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './FriendsProfile.css'; 
import emptyImage from "../../assets/images/profile-empty.png";
import { jwtDecode } from 'jwt-decode';

const FriendsProfile = () => {
  const { id } = useParams();
  const [friend, setFriend] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  const handlePage = () => {
    navigate(`/friend/todos/${id}`)
  }

  useEffect(() => {
    
    const fetchFriendProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/friends/viewProfile/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        setFriend(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error loading friends profile:', error);
        setError('Error loading profile.');
        setLoading(false);
      }
    };

    fetchFriendProfile();
  }, [id]);

  useEffect(() => {
    const token = localStorage.getItem("token");
      if (token) {
        const decodedToken = jwtDecode(token);
        setUserId(decodedToken.id);
      }
  }, [id]);

  if (loading) {
    return <p>Loading profile...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="container mt-4">
      {friend ? (
        <Card className="friend-profile-card">
          <Card.Header className="text-center">
            <Card.Img 
              variant="top" 
              src={friend && friend.profileImage ? `http://localhost:5000/${friend.profileImage}` : emptyImage} 
              alt={friend.name} 
              className="friend-profile-img"
            />
            <h2>{friend.name}</h2>
            <h6>{friend.email}</h6>
            <Badge bg="info">{friend.status}</Badge>
          </Card.Header>

          <Card.Body>
            <h4>Information</h4>
            <ListGroup variant="flush">
              <ListGroup.Item><strong>City:</strong> {friend.city || "not specified"}</ListGroup.Item>
              <ListGroup.Item><strong>Age:</strong> {friend.age || "not specified"}</ListGroup.Item>
              <ListGroup.Item><strong>Interests:</strong> {friend?.interests || "not specified"}</ListGroup.Item>
            </ListGroup>

            <h4 className="mt-4">Friends ({friend?.friends?.friends?.length || 0})</h4>
            <ListGroup horizontal className='main-friends-friends-block'>
              {friend?.friends?.friends?.length > 0 ? (
                friend?.friends?.friends?.map((f) => (
                  <ListGroup.Item key={f._id}>
                    <img src={f.profileImage ? `http://localhost:5000/${f.profileImage}` : emptyImage} alt={f.name} className="mini-friend-img" />
                    <p style={{textAlign: 'center'}}>{f.name}</p>
                  </ListGroup.Item>
                ))
              ) : (
                <p>No friends</p>
              )}
            </ListGroup>

            <div className="mt-4 text-center">
              {friend?.friends?.friends?.some(friend => friend._id === userId) ? (
                <Button variant="primary" onClick={handlePage}>View Todo Lists</Button>  
              ) : <span disabled={true}>You can only view the ToDo lists of your friends.</span> 
            }
            </div>
          </Card.Body>
        </Card>
      ) : (
        <p>Profile not found.</p>
      )}
    </div>
  );
};

export default FriendsProfile;