
# Notification Service

Notification Service built using **Node.js**, **Express**, **MongoDB**, and supports **Email (via Nodemailer)** and **SMS (via AWS SNS)** notifications.

FOR API USAGE REFER API DOCUMENTATION

##  Features

- Queue-based notification delivery
- Supports Email ,In-app and SMS types
- MongoDB for persistence
- Retry mechanism for failed deliveries
- AWS SNS integration for SMS
- Nodemailer integration for Email

---

##  Tech Stack

- Node.js
- Express
- MongoDB (Mongoose)
- Nodemailer (Gmail SMTP)
- AWS SDK (SNS for SMS)
- RabbitMQ (for message queuing)

---

##  Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/your-username/notification-service.git
cd notification-service
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup `.env` file

Create a `.env` file at the root with the following variables:

```env
PORT=5000
MONGO_URI=your_mongo_db_connection_string

EMAIL_USER=your_gmail_address@gmail.com
EMAIL_PASS=your_app_specific_password

AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=ap-south-1

RABBITMQ_URL=amqp://localhost
```

> **Note:** For Gmail, use an [App Password](https://support.google.com/accounts/answer/185833) instead of your regular password.

---

### 4. Start MongoDB and RabbitMQ

Make sure MongoDB and RabbitMQ services are running locally or accessible remotely.

---

### 5. Start the Server

```bash
node server.js
```

---

### 6. Test the API

#### Add a notification

```http
POST /notifications
Content-Type: application/json

{
  "userId": "2003",
  "type": "email",  // or "sms"
  "title": "Welcome to Pepsale!",
  "message": "Thank you for signing up with us.",
  "emailId": "test@example.com",
  "phone": "+919876543210"
}
```

#### Get notifications for a user

```http
GET /users/:id/notifications
```
This retruns all the in_app notifications according to receive time.


---



## Assumptions

- Phone numbers must be in **E.164** format (e.g., +919876543210)
- Email sending via Gmail SMTP requires an app password
- MongoDB URI is valid and accessible
- RabbitMQ is used for notification queuing and processing

---


