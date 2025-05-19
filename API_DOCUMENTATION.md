
# API Documentation for Notification Service

## Overview
This Notification Service provides APIs to send notifications via Email, SMS, and In-App notifications. It uses RabbitMQ for queuing notifications, MongoDB for storing notification data, and integrates with AWS SNS for SMS and Nodemailer for emails.

---

## Base URL
```
http://localhost:5000/api
```

---

## Endpoints

### 1. Send Notification
- **URL:** `/notifications`
- **Method:** `POST`
- **Description:** Accepts notification details and queues them for sending.
- **Request Body:**
```json
{
  "userId": "string (required)",
  "type": "string (required) - one of ['email', 'sms', 'in_app']",
  "title": "string (required)",
  "message": "string (required)",
  "emailId": "string (required if type is 'email')",
  "phone": "string (required if type is 'sms')"
}
```
- **Response:** `202 Accepted`
```json
{
  "message": "Notification queued"
}
```
- **Errors:**
  - `400 Bad Request` if required fields are missing.
  - `500 Internal Server Error` for server issues.

---

### 2. Get In-App Notifications for a User
- **URL:** `/users/:id/notifications`
- **Method:** `GET`
- **Description:** Fetches in-app notifications for a given user ID, sorted by newest first.
- **Parameters:**
  - `id` (path) - user ID to fetch notifications for.
- **Response:** `200 OK`
```json
[
  {
    "_id": "string",
    "userId": "string",
    "type": "string ('in_app')",
    "title": "string",
    "message": "string",
    "emailId": "string or null",
    "phone": "string or null",
    "status": "string",
    "retries": "number",
    "createdAt": "ISODate string"
  },
  
]
```
- **Errors:** `500 Internal Server Error` for server issues.

---

## Notification Lifecycle

1. Client sends a notification request to `/notifications` endpoint.
2. The server validates the request and stores the notification in MongoDB with status `pending`.
3. The notification is added to RabbitMQ queue (`notifications` queue).
4. The `readQueue` worker listens to the queue, processes notifications:
   - Sends Email via Nodemailer if type is `email`.
   - Sends SMS via AWS SNS if type is `sms`.
   - Updates notification status to `delivered` upon success.
   - Retries on failure up to MAX_RETRIES (currently 0), then marks as `failed`.
5. In-App notifications are directly marked as delivered.

---
