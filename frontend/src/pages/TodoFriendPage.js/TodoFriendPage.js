import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner, Button, Form } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./TodoFriendPage.css";
import axios from "axios";
import emptyImage from "../../assets/images/profile-empty.png";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import { RiDeleteBinLine } from "react-icons/ri";

const TodoFriendPage = () => {
  const { id } = useParams();
  const [friendTodos, setFriendTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [friend, setFriend] = useState(null);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);
  const [showComments, setShowComments] = useState({});
  const [comments, setComments] = useState({}); 
  const [commentsData, setCommentsData] = useState({});
  const navigate = useNavigate();

  const handlePage = () => {
    navigate(`/friends/viewProfile/${id}`);
  };

  const toggleComments = (todoId) => {
    setShowComments((prev) => ({
      ...prev,
      [todoId]: !prev[todoId],
    }));
  };

  const fetchFriendTodos = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/friend/todos/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFriendTodos(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchFriendProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/friends/viewProfile/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFriend(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error loading friends profile:", error);
      setError("Error loading profile.");
      setLoading(false);
    }
  };

  const handleLike = async (todo) => {
    const todoId = todo._id
    try {
      const token = localStorage.getItem("token");
      if (todo?.likes?.includes(userId)) {
        await axios.delete(`http://localhost:5000/api/todo/${todoId}/unlike`, {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
          data: {
            senderId: userId, 
          },
        });
      } else {
        await axios.post(
          `http://localhost:5000/api/todo/${todoId}/like`,
          { userId: id, senderId: userId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      fetchFriendTodos(); 
    } catch (err) {
      console.error("Error liking todo:", err);
    }
  };

  const handleCommentSubmit = async (todoId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/todo/${todoId}/comment`,
        { text: comments[todoId] || "", userId: id, senderId: userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComments((prev) => ({ ...prev, [todoId]: "" })); 
      fetchFriendTodos(); 
    } catch (err) {
      console.error("Error commenting on todo:", err);
    }
  };

  const handleCommentDelete = async (todoId, commentId) => {
    try {
      const token = localStorage.getItem("token");
  
      await axios.delete(`http://localhost:5000/api/todo/${todoId}/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      fetchFriendTodos(); 
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  const fetchComments = async (todoId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/todo/${todoId}/comments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCommentsData((prev) => ({
        ...prev,
        [todoId]: response.data,
      }));
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
      if (token) {
        const decodedToken = jwtDecode(token);
        setUserId(decodedToken.id);
      }
    fetchFriendProfile();
    fetchFriendTodos();
  }, [id]);

  useEffect(() => {
    if (friendTodos) {
      friendTodos.forEach((todo) => {
        fetchComments(todo._id); 
      });
    }
  }, [friendTodos]);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h1 className='text-white'>Todo List Your Friend</h1>
      {friend ? (
        <div className="friend-todo-title-block">
          <Card.Img
            variant="top"
            src={
              friend.profileImage
                ? `http://localhost:5000/${friend.profileImage}`
                : emptyImage
            }
            alt={friend.name}
            className="friend-profile-img"
            style={{ cursor: "pointer", height: "80px", width: "80px" }}
            onClick={handlePage}
          />
          <h2 style={{ cursor: "pointer", color: 'white' }} onClick={handlePage}>
            {friend.name}
          </h2>
        </div>
      ) : null}
      <Row>
        {friendTodos.length === 0 ? (
          <Col>
            <h4>No ToDo items found for this friend.</h4>
          </Col>
        ) : (
          friendTodos.map((todo) => (
            <Col md={4} key={todo._id} className="mb-4">
              <Card className={todo.completed ? "completed-todo" : ""}>
                <Card.Body>
                  <Card.Title>{todo.title}</Card.Title>
                  <Card.Text>{todo.description}</Card.Text>
                  <Card.Text>
                    {new Date(todo.createdAt).toLocaleString("en-US", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                    })}
                  </Card.Text>
                  {/* Button like */}
                  <Button
                    variant="primary"
                    onClick={() => handleLike(todo)}
                    className="mr-2 d-flex align-items-center gap-2 main-like-block"
                    disabled={todo.completed}
                  >
                    {
                      todo?.likes?.includes(userId) ? <FaHeart className="iconLike" /> : <FaRegHeart className="iconLike" />
                    }
                    {todo.likes.length || 0}
                  </Button>
                  <Form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleCommentSubmit(todo._id);
                    }}
                    className="mt-3"
                  >
                    <Form.Group controlId="comment">
                      <Form.Control
                        type="text"
                        placeholder="Leave a comment"
                        value={comments[todo._id] || ""} 
                        onChange={(e) =>
                          setComments((prev) => ({
                            ...prev,
                            [todo._id]: e.target.value,
                          }))
                        }
                        disabled={todo.completed}
                      />
                    </Form.Group>
                    <Button className="mt-1" variant="success" type="submit" disabled={todo.completed}>
                      Submit Comment
                    </Button>
                  </Form>
                  {/* Display Comments */}
                  <div className="comments-section mt-2">
                    {commentsData[todo._id] && commentsData[todo._id].length > 0 ? (
                      <>
                        <Button onClick={() => toggleComments(todo._id)} disabled={!commentsData[todo._id].length > 0 || todo.completed}>
                          {showComments[todo._id] ? "Hide Comments" : `Show Comments (${commentsData[todo._id].length})`}
                        </Button>
                        {showComments[todo._id] && commentsData[todo._id].map((comment) => (
                          <div key={comment._id} className="comment mt-2">
                            <div className="d-flex align-items-center">
                              <img src={comment.user.profileImage || ""} alt="" /> 
                              <strong>{comment.user._id === userId ? '(You)' : comment.user.name}:</strong>
                              <span>{comment.text}</span>
                              {comment.user._id === userId ?( 
                              <RiDeleteBinLine style={{ fill: 'red', fontSize: '20px', cursor: 'pointer', marginLeft: '10px'}} onClick={() => handleCommentDelete(todo._id, comment._id)}/>
                              ) : <></>}
                            </div>
                            <p style={{ fontSize: "11px", marginBottom: '0px' }}>
                              {new Date(comment.createdAt).toLocaleString("en-US", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                                hour: "numeric",
                                minute: "numeric",
                                hour12: true,
                              })}
                            </p>
                          </div>
                        ))}
                      </>
                    ) : (
                      <Button disabled={!commentsData[todo._id]?.length > 0} onClick={() => toggleComments(todo._id)}>Show Comments (0)</Button>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
};

export default TodoFriendPage;
