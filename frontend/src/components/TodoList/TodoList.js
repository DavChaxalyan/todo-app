import React, { useState, useEffect } from "react";
import {
  Button,
  Form,
  Card,
  Container,
  Row,
  Col,
  ListGroup,
  Modal,
} from "react-bootstrap";
import axios from "axios";
import "./TodoList.css";
import { FaRegComment } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import emptyImage from "../../assets/images/profile-empty.png"
import todoLogo from "../../assets/images/todo-create-logo.webp"

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [todoId, setTodoId] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedTodo, setEditedTodo] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [likesModalShow, setLikesModalShow] = useState(false);
  const [likesUsers, setLikesUsers] = useState([]);
  const [commentsModalShow, setCommentsModalShow] = useState(false);
  const [commentsUsers, setCommentsUsers] = useState([]);
  const navigate = useNavigate();

  const handleShowLikes = async (todo) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`https://todo-app-yuun.onrender.com/api/todo/${todo._id}/likes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLikesUsers(response.data);
      setLikesModalShow(true);
    } catch (error) {
      console.error("Error fetching likes:", error);
    }
  };
  const handleViewProfile = ( id ) => {
      navigate(`/friends/viewProfile/${id}`)
  }
  const handleShowComments = async (todo) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`https://todo-app-yuun.onrender.com/api/todo/${todo._id}/comments`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTodoId(todo._id)
      setCommentsUsers(response.data);
      setCommentsModalShow(true);
    } catch (error) {
      console.error("Error fetching likes:", error);
    }
  };

  const fetchTodos = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("https://todo-app-yuun.onrender.com/api/todo", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };
  
  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAddTodo = async () => {
    if (newTodo.trim()) {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.post(
          "https://todo-app-yuun.onrender.com/api/todo",
          { title: newTodo },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setTodos([...todos, response.data]);
        setNewTodo("");
      } catch (error) {
        console.error("Error adding todo:", error);
      }
    }
  };

  const handleDeleteTodo = async (index, todoId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://todo-app-yuun.onrender.com/api/todo/${todoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedTodos = todos.filter((_, idx) => idx !== index);
      setTodos(updatedTodos);
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const handleEditTodo = (index) => {
    setEditingIndex(index);
    setEditedTodo(todos[index].title);
    setShowModal(true);
  };

  const handleSaveEdit = async () => {
    const todoId = todos[editingIndex]._id;
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `https://todo-app-yuun.onrender.com/api/todo/${todoId}`,
        { title: editedTodo },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedTodos = [...todos];
      updatedTodos[editingIndex] = response.data;
      setTodos(updatedTodos);
      setShowModal(false);
    } catch (error) {
      console.error("Error editing todo:", error);
    }
  };

  const toggleCompleteTodo = async (index) => {
    const todoId = todos[index]._id; 
    const updatedTodos = [...todos];
  
    const isCompleted = !updatedTodos[index].completed;
    updatedTodos[index].completed = isCompleted;
  
    try {
      const token = localStorage.getItem("token");
  
      await axios.put(
        `https://todo-app-yuun.onrender.com/api/todo/${todoId}`,
        {
          completed: isCompleted, 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      setTodos(updatedTodos);
    } catch (error) {
      console.error("Error toggling completion:", error);
    }
  };

  const handleCommentDelete = async (todoId, commentId) => {
    try {
      const token = localStorage.getItem("token");
  
      await axios.delete(`https://todo-app-yuun.onrender.com/api/todo/${todoId}/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCommentsModalShow(false)
      fetchTodos()
  
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  return (
    <Container className="main-todos-block">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="p-4 shadow-lg">
            <div className="d-flex flex-column align-items-center">
              <img src={todoLogo} alt="create todo" style={{height: '100px', width: '100px'}}/>
              <h3 className="text-center mb-4">Creative To-Do List</h3>
            </div>

            {/* Add New To-Do */}
            <Form className="d-flex mb-3">
              <Form.Control
                type="text"
                placeholder="Add new task..."
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
              />
              <Button
                variant="primary"
                onClick={handleAddTodo}
                className="ms-2"
              >
                Add
              </Button>
            </Form>

            {/* To-Do List */}
            <ListGroup className="list-todo-lists">
              {todos.map((todo, index) => (
                <ListGroup.Item
                  key={index}
                  className={`d-flex justify-content-between align-items-center ${
                    todo.completed ? "completed" : ""
                  }`}
                >
                  <div className="d-flex align-items-center">
                  <Form.Check
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleCompleteTodo(index)}
                      className="me-3"
                    />
                    <div 
                      style={{
                        textDecoration: todo.completed ? "line-through" : "none",
                        cursor: todo.completed ? "default" : "pointer",
                        color: todo.completed ? "#6c757d" : "#000",
                      }}
                      onClick={() =>
                        !todo.completed && toggleCompleteTodo(index)
                      }
                    >

                    {todo.title}
                    <br />
                    <small className="text-muted">
                      Created on: {new Date(todo.createdAt).toLocaleString("en-US", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                          hour12: true,
                        })}
                    </small>
                    </div>
                  </div>
                  <div className="comments mt-2">
                    <Button className="d-flex align-items-center gap-2 main-likes-block-todo" disabled={todo.likes.length === 0} onClick={() => handleShowLikes(todo)}>
                      <FaRegHeart style={{fill: 'red'}} />
                      <span>{todo.likes.length}</span>
                    </Button>
                    <Button className="d-flex align-items-center gap-2 main-comments-block-todo" disabled={todo.comments.length === 0} onClick={() => handleShowComments(todo)}>
                      <FaRegComment style={{fill: 'white'}} />
                      <span>{todo.comments.length}</span>
                    </Button>
                </div>
                  <div className="d-flex gap-3">
                    <Button
                      variant="info"
                      onClick={() => handleEditTodo(index)}
                      disabled={todo.completed}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDeleteTodo(index, todo._id)}
                      disabled={todo.completed}
                    >
                      Delete
                    </Button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>
      </Row>

      {/* Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit To-Do</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            value={editedTodo}
            onChange={(e) => setEditedTodo(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveEdit}>
            Save changes
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={likesModalShow} onHide={() => setLikesModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Users Who Liked</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup>
            {likesUsers.length === 0 ? (
              <ListGroup.Item>No likes yet</ListGroup.Item>
            ) : (
              likesUsers.map((user, index) => (
                <div key={user._id} className="mb-3">
                  <img onClick={() => handleViewProfile(user._id)} style={{width: '200px', height: '200px', cursor: 'pointer'}} src={user.profileImage ? `https://todo-app-yuun.onrender.com/${user.profileImage}` : emptyImage} alt={user.name}/>
                  <ListGroup.Item onClick={() => handleViewProfile(user._id)} style={{ cursor: 'pointer '}} key={index}>{user.name} ({user.email})</ListGroup.Item>
                </div>
              ))
            )}
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setLikesModalShow(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={commentsModalShow} onHide={() => setCommentsModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Users Who Wrote Comments on This Todo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup>
            {commentsUsers.length === 0 ? (
              <ListGroup.Item>No Comments yet</ListGroup.Item>
            ) : (
              commentsUsers.map((comment) => (
                <div key={comment._id}>
                  <div className="comment">
                            User: <strong style={{ cursor: 'pointer'}} onClick={() => handleViewProfile(comment.user._id)}>{comment.user.name}</strong>
                            <div className="d-flex align-items-center">
                              <img src={comment.user.profileImage || ""} alt="" /> 
                              <span>comment: {comment.text}</span>
                              <RiDeleteBinLine style={{ cursor: 'pointer', fill: 'red', marginLeft: '15px'}} onClick={() => handleCommentDelete(todoId, comment._id)}/>
                            </div>
                            <p style={{ fontSize: "11px" }}>
                              Date: 
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
                </div>
              ))
            )}
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setCommentsModalShow(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default TodoList;
