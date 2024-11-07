# Todo App

Todo App is a fully functional web application built using React and Express, allowing users to manage their tasks and interact with others through social features. The application includes user authentication, friend requests, notifications, and various task management capabilities.

## Key Features

### User Authentication
- **Registration and Login:** Users can create an account and log in to access their personalized task lists.
- **Password Management:** Users can change their password in the settings, and if they forget it, they can recover it via email.

### Social Features
- **Friend Requests:** Users can find other users and send friend requests.
- **Notifications:** After sending a friend request, the recipient receives a notification and can accept or decline the request.
- **Access to Friends' Lists:** Once a request is accepted, users can view each other's task lists and can like or comment on them.

### Task Management
- **Create, Edit, Delete:** Users can create new task lists, edit them, and delete them if they are no longer needed.
- **Interactions:** Users can like and comment on their friends' task lists, and they will receive notifications about such actions.

### User Settings
- **Profile Management:** Users can update their profile information, including email, username, and password, in the settings section.

## Technology Stack

- **Frontend:** React
- **Backend:** Express
- **Database:** MongoDB
- **Notifications:** Email for password recovery, in-app notifications for friend requests, likes, and comments.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/DavChaxalyan/todo-app.git
   cd todo-app

## Setup `.env` File

To run the backend server, you need to create a `.env` file in the root directory of your `backend` folder. Add the following variables to the file:

```plaintext
MONGODB_URI=your_mongoDB_URL   // example`  mongodb://localhost:27017/mydatabase
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS="your_email_app_password"
   
### Install dependencies for the frontend and backend:
1. Frontend:
   ```bash
   cd frontend
   npm install
2. Backend:
   ```bash
   cd ../backend
   npm install

## install MongoDB
Set up MongoDB. You can install MongoDB locally or use a cloud service like MongoDB Atlas.
Installing Local MongoDB
Download and install MongoDB from the official website: MongoDB Download Center.
Follow the instructions for your operating system to install and run MongoDB.

Ensure that the MongoDB server is running using the command:
1. Backend
   ```bash
   mongod

Start the development server for the backend:
1. Start Backend
   ```bash
   cd backend
   node server.js

In a separate terminal, run the frontend:
1. Start Frontend
   ```bash
   cd frontend
   npm start   

Now you can open the application in your browser at http://localhost:3000.

## Using All Features
To fully take advantage of all the application's features, it is recommended to create two accounts. This will allow you to:

Send and receive friend requests.
Like and comment on task lists.
See how notifications work when interacting with friends.

## Example Process:
1. Create the first account: Register with one email address.
2. Create the second account: Register with a different email address.
3. Send a friend request: Using one account, send a friend request to the second account.
4. Accept the request: Log into the second account and accept the request.
5. Start interacting: Now you can like, comment, and test all the application’s features using both accounts.
   
This will give you a chance to see how the application works in real user interactions.
