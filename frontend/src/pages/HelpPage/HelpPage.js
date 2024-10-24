import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import "./HelpPage.css"

const HelpPage = () => {
  return (
    <Container className='main-container-help'>
      <h1 className="mt-4">Help</h1>
      <p>Welcome to the Help page! Here you will find information on how to use our project.</p>

      <Row className="mt-4 main-content-help">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>How to Use the Project</Card.Title>
              <Card.Text>
              Our application allows you to effectively manage your tasks. You can create, edit, and delete your ToDo lists, find users, and add them as friends. Additionally, you can view your friends' ToDo lists and explore them in more detail.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Technologies Used</Card.Title>
              <Card.Text>
                This project is built using the following technologies:
              </Card.Text>
                <ul>
                  <li>React: For building the user interface.</li>
                  <li>React Bootstrap: For responsive design and components.</li>
                  <li>Node.js & Express: For building the backend server.</li>
                  <li>MongoDB: For storing user data and ToDo lists.</li>
                </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default HelpPage;
