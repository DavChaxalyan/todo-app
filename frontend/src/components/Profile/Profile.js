import React, { useEffect, useState } from 'react';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBTypography } from 'mdb-react-ui-kit';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import imageProfile from "../../assets/images/profile-empty.png"
import { FaUserEdit } from "react-icons/fa";
import { CiSaveDown2 } from "react-icons/ci";
import { MdLockReset } from "react-icons/md";
import "./Profile.css"

const Profile = () => {
  const [user, setUser] = useState({
    name: '',
    username: '',
    email: '',
    profileImage: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState(user);
  const [image, setImage] = useState(null);
  const [todoCount, setTodoCount] = useState(0);
  const [friendsCount, setFriendsCount] = useState(0);
  const navigate = useNavigate();

  const handleViewFriends = () => {
    navigate('/friends')
  }

  const handleViewTodos = () => {
    navigate('/todos')
  }

  const handleResetPassword = () => {
    setIsResetPassword(prevState => !prevState);
    setIsEditing(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
  };

  const handleSavePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New password and confirmation do not match.');
      return;
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      alert('The new password must be different from the current password.');
      return;
    }
  
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        userId: user._id
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      alert('Password successfully changed!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      localStorage.removeItem('token')
      setTimeout(() => {
        window.location.reload();
      }, 500)
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Failed to change password');
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token'); 
        const response = await axios.get('http://localhost:5000/api/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        setUser(response.data);
        setUpdatedUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const fetchTodoCount = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/todo', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        setTodoCount(response.data.length); 
      } catch (error) {
        console.error('Error fetching todo count:', error);
      }
    };

    const fetchFriendsCount = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/friends', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        setFriendsCount(response.data.length); 
      } catch (error) {
        console.error('Error fetching todo count:', error);
      }
    };

    fetchFriendsCount()
    fetchUserData();
    fetchTodoCount()
  }, [user.profileImage]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser({
      ...updatedUser,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(URL.createObjectURL(file));
    setUpdatedUser({
      ...updatedUser,
      profileImage: file 
    });
  };

  const handleEditProfile = () => {
    setIsEditing(prevState => !prevState);
    setIsResetPassword(false)
  };

  const handleSaveProfile = async () => {
    const formData = new FormData();
    formData.append('name', updatedUser.name);
    formData.append('username', updatedUser.username);
    formData.append('email', updatedUser.email);
    formData.append('age', updatedUser.age);
    formData.append('city', updatedUser.city);
    formData.append('interests', updatedUser.interests);
    if (updatedUser.profileImage) {
      formData.append('profileImage', updatedUser.profileImage);
    }

    try {
      const token = localStorage.getItem('token'); 
      await axios.put('http://localhost:5000/api/profile', formData, {
        headers: {
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'multipart/form-data' 
        }
      });
      setUser({
        ...updatedUser,
        profileImage: image 
      });
      setIsEditing(false);
      setTimeout(() => {
        window.location.reload();
      }, 500)
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const isDisableSaveButton = (updateUser, user) => {
    const userFields = ['name', 'username', 'email', 'profileImage', 'city', 'age', 'interests'];
    const hasChanges = userFields.some(field => updatedUser[field] !== user[field]);
    if (hasChanges) {
      return false
    }
    return true
  }

  return (
    <div className="gradient-custom-2">
      <MDBContainer className="py-5 h-100">
        <MDBRow className="justify-content-center align-items-center h-100">
          <MDBCol lg="9" xl="7">
            <MDBCard>
              <div className="rounded-top text-white d-flex flex-row" style={{ backgroundColor: '#000', height: '200px' }}>
                <div className="ms-4 mt-5 d-flex flex-column" style={{ width: '150px' }}>
                <MDBCardImage
                    src={isEditing && image ? image : user.profileImage ? `http://localhost:5000/${user.profileImage}` : imageProfile}
                    alt="Profile image"
                    className="img-thumbnail"
                    fluid
                    style={{ width: '150px', maxHeight: '250px', height: '100%', zIndex: '1' }}
                  />
                </div>
                <div className="ms-3" style={{ marginTop: '130px' }}>
                  <MDBTypography tag="h5">{user.name}</MDBTypography>
                  <MDBCardText>{user.username}</MDBCardText>
                </div>
              </div>
              <div className="p-4 text-black d-flex align-items-center justify-content-between" style={{ backgroundColor: '#f8f9fa' }}>
                <Button color="dark" className={isEditing ? 'editingProfile d-flex align-items-center gap-2' : 'notEditingProfile d-flex align-items-center gap-2'} onClick={handleEditProfile}>
                  <FaUserEdit />
                  {isEditing ? "Cancel" : "Edit Profile"}
                </Button>
                <div className="d-flex justify-content-end text-center py-1">
                  <div>
                    <MDBCardText className="mb-1 h5">{todoCount}</MDBCardText>
                    <MDBCardText className="small text-muted mb-0" style={{cursor: 'pointer'}} onClick={handleViewTodos}>Todo Lists</MDBCardText>
                  </div>
                  <div className="px-3">
                    <MDBCardText className="mb-1 h5">{friendsCount}</MDBCardText>
                    <MDBCardText className="small text-muted mb-0" style={{cursor: 'pointer'}} onClick={handleViewFriends}>Friends</MDBCardText>
                  </div>
                </div>
              </div>
              <MDBCardBody className="text-black p-4">
                <div className="mb-5">
                  <p className="lead fw-normal mb-1">Profile Details</p>
                  <div className="p-4" style={{ backgroundColor: '#f8f9fa' }}>
                    {isEditing ? (
                      <div className='profile-edit-block'>
                        <MDBCardText className="font-italic mb-1">
                          <label>Name:</label>
                          <input
                            type="text"
                            name="name"
                            value={updatedUser.name}
                            onChange={handleInputChange}
                            className="form-control"
                          />
                        </MDBCardText>
                        <MDBCardText className="font-italic mb-1">
                          <label>Username:</label>
                          <input
                            type="text"
                            name="username"
                            value={updatedUser.username}
                            onChange={handleInputChange}
                            className="form-control"
                          />
                        </MDBCardText>
                        <MDBCardText className="font-italic mb-1">
                          <label>Email:</label>
                          <input
                            type="email"
                            name="email"
                            value={updatedUser.email}
                            onChange={handleInputChange}
                            className="form-control"
                          />
                        </MDBCardText>
                        <MDBCardText className="font-italic mb-1">
                          <label>Age:</label>
                          <input
                            type="number"
                            name="age"
                            value={updatedUser.age}
                            onChange={handleInputChange}
                            className="form-control"
                            min={15}
                            max={80}
                          />
                        </MDBCardText>
                        <MDBCardText className="font-italic mb-1">
                          <label>City:</label>
                          <input
                            type="text"
                            name="city"
                            value={updatedUser.city}
                            onChange={handleInputChange}
                            className="form-control"
                          />
                        </MDBCardText>
                        <MDBCardText className="font-italic mb-1">
                          <label>Interests:</label>
                          <input
                            type="text"
                            name="interests"
                            value={updatedUser.interests || "It is not specified."}
                            onChange={handleInputChange}
                            className="form-control"
                          />
                        </MDBCardText>
                        <MDBCardText className="font-italic mb-1">
                          <label>Profile Image:</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="form-control"
                          />
                        </MDBCardText>
                      </div>
                    ) : (
                      <div>
                        <MDBCardText className="font-italic mb-1">Name: {user.name}</MDBCardText>
                        <MDBCardText className="font-italic mb-1">Username: {user.username}</MDBCardText>
                        <MDBCardText className="font-italic mb-1">Email: {user.email}</MDBCardText>
                        <MDBCardText className="font-italic mb-1">Age: {user.age}</MDBCardText>
                        <MDBCardText className="font-italic mb-1">City: {user.city}</MDBCardText>
                        <MDBCardText className="font-italic mb-1">Interests: {user.interests || "It is not specified."}</MDBCardText>
                      </div>
                    )}
                  </div>
                </div>
                {isEditing && (
                  <Button 
                    color="success" 
                    className='save-button-profile d-flex align-items-center gap-2 mb-3' 
                    onClick={handleSaveProfile} 
                    disabled={isDisableSaveButton(updatedUser, user)}>
                    <CiSaveDown2 style={{fontSize: '20px'}} />
                    Save Changes
                  </Button>
                )}
                  <Button variant="warning" onClick={handleResetPassword} className='d-flex align-items-center gap-2'>
                    <MdLockReset style={{fontSize: '20px'}}/>
                     Reset Password
                  </Button>

                  {isResetPassword && (
                      <div className="password-reset-block mt-2">
                        <MDBCardText className="font-italic mb-1">
                          <label>Current Password:</label>
                          <input
                            type="password"
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            className="form-control"
                          />
                        </MDBCardText>
                        <MDBCardText className="font-italic mb-1">
                          <label>New Password:</label>
                          <input
                            type="password"
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            className="form-control"
                          />
                        </MDBCardText>
                        <MDBCardText className="font-italic mb-1">
                          <label>Confirm New Password:</label>
                          <input
                            type="password"
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            className="form-control"
                          />
                        </MDBCardText>
                        <Button className='mt-2 d-flex align-items-center gap-2' variant="success" onClick={handleSavePassword}>
                        <CiSaveDown2 style={{fontSize: '20px'}} />
                          Save Password
                        </Button>
                      </div>
                      )}
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
};

export default Profile;
