import React from 'react';
import { Container, Row, Col, Card, Button, ListGroup, Image } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

const Home = () => {

  const navigate = useNavigate();
  const handleChangePage = () => {
    navigate('/todos')
  }

  return (
    <div>
      {/* Welcome Section */}
      <Container className="my-5 text-center">
        <Row>
          <Col>
            <h1 className="display-4">Welcome to ToDo App!</h1>
            <p className="lead">Manage your tasks, connect with friends, and stay organized.</p>
          </Col>
        </Row>
      </Container>

      {/* Friends Section */}
      <Container className="my-5">
        <Row>
          <Col>
            <h2>Your Friends</h2>
            <p>Stay connected and see what your friends are working on.</p>
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <Card className="text-center">
              <Card.Body>
                <Image src="https://via.placeholder.com/150" roundedCircle className="mb-3" />
                <Card.Title>John Doe</Card.Title>
                <Card.Text>
                  Check out John's latest ToDo list.
                </Card.Text>
                <Button variant="outline-primary">View Profile</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="text-center">
              <Card.Body>
                <Image src="https://via.placeholder.com/150" roundedCircle className="mb-3" />
                <Card.Title>Jane Smith</Card.Title>
                <Card.Text>
                  Jane just completed a new task!
                </Card.Text>
                <Button variant="outline-primary">View Profile</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="text-center">
              <Card.Body>
                <Image src="https://via.placeholder.com/150" roundedCircle className="mb-3" />
                <Card.Title>Michael Brown</Card.Title>
                <Card.Text>
                  Michael added new tasks to his ToDo list.
                </Card.Text>
                <Button variant="outline-primary">View Profile</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Notifications Section */}
      <Container className="my-5">
        <Row>
          <Col>
            <h2>Notifications</h2>
            <p>See who added you as a friend and check other important updates.</p>
            <ListGroup>
              <ListGroup.Item>John Doe sent you a friend request.</ListGroup.Item>
              <ListGroup.Item>Jane Smith commented on your ToDo list.</ListGroup.Item>
              <ListGroup.Item>Michael Brown liked your ToDo list.</ListGroup.Item>
            </ListGroup>
          </Col>
        </Row>
      </Container>

      {/* ToDo Lists Section */}
      <Container className="my-5">
        <Row>
          <Col>
            <h2>Your ToDo Lists</h2>
            <p>Manage your tasks and stay organized.</p>
            <Button onClick={handleChangePage} variant="success" size="lg" className="mb-3">Create New ToDo List</Button>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Work Tasks</Card.Title>
                <Card.Text>
                  Finish project report, prepare presentation, schedule meeting with client.
                </Card.Text>
                <Button variant="outline-warning" className="me-2">Edit</Button>
                <Button variant="outline-danger">Delete</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Personal Tasks</Card.Title>
                <Card.Text>
                  Buy groceries, clean the house, call mom.
                </Card.Text>
                <Button variant="outline-warning" className="me-2">Edit</Button>
                <Button variant="outline-danger">Delete</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Fitness Goals</Card.Title>
                <Card.Text>
                  Go for a run, hit the gym, practice yoga.
                </Card.Text>
                <Button variant="outline-warning" className="me-2">Edit</Button>
                <Button variant="outline-danger">Delete</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Travel Plans</Card.Title>
                <Card.Text>
                  Book flights, pack bags, check passport expiration.
                </Card.Text>
                <Button variant="outline-warning" className="me-2">Edit</Button>
                <Button variant="outline-danger">Delete</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;
