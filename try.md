# 1. Executive Summary

Below is the comprehensive API documentation for HadatHub’s ticket management system. It covers how companies are onboarded and how they host events, manage venues, and efficiently collect payments for attendees through ticket purchases.

# 2. Domain Analysis

### Overview

The following schema facilitates event hosting and ticket purchasing. It allows companies to onboard themselves, register venues, and create events. Simultaneously, it provides a platform for attendees to browse the events.

### Entities Definitions

| Table Name | Fields (Attributes) |
| --- | --- |
| **hosting_company** | id, name, location_address, owner_id (FK to user.id), created_at, update_at |
| **venue** | id, name, location_address, capacity, created_at, update_at |
| **user** | id, name, email, role [COMPANY_OWNER, ATTENDEE], created_at, updated_at |
| **event** | id, name, description, scheduled_on, attendance_fee, max_attendees, company_id (FK), venue_id (FK), created_at, updated_at |
| **order** | id, user_id (FK), event_id (FK), status (PAID, PENDING), created_at, updated_at |
| **payment** | id, order_id (FK), amount, created_at, updated_at |
| **ticket** | id, order_id (FK), use_status (AVAILABLE, USED), created_at, update_at |

### Entity Relationships

* **One-to-Many:** One User (Owner) can own one or more Hosting Companies.
* **One-to-Many:** One Hosting Company can host multiple Events.
* **One-to-Many:** One Venue can host multiple Events over time.
* **One-to-Many:** One User (Attendee) can place multiple Orders.
* **One-to-One:** One Order typically generates one Payment and one Ticket (upon successful payment).

### Operations

**Company & Event Onboarding (Role: COMPANY_OWNER)**

1. **Company Registration:** A user with the COMPANY_OWNER role registers their company details.
2. **Venue Setup:** The owner selects an existing venue or registers a new one if it is not already in the system.
3. **Event Creation:** The owner creates an event, linking it to their company and the chosen venue, while setting the attendance fee and capacity.

**Ticket Procurement (Role: ATTENDEE)**

1. **Searching:** The attendee browses the list of available events.
2. **Ordering:** The attendee selects an event, creating a record in the Order table with a PENDING status.
3. **Transaction:** Once payment is processed, a Payment record is created. The Order status is updated to PAID.
4. **End:** A Ticket is automatically generated with a status of AVAILABLE, serving as the user's proof of entry.

### Data Points

* **Centrality:** The Event table acts as the bridge between companies, venues, and customers.
* **Tracking:** The separation of Order and Payment allows the system to track "abandoned orders" (pending orders) versus successful ones.
* **Validation:** The Ticket entity ensures that attendance is verified, preventing multiple entries with the same purchase through the use_status attribute.

# 3. Resource Modeling

The following resource model outlines the relational architecture and provides comprehensive field definitions for the seven core entities within our system.

# 4. Endpoint Documentation

### Standard CRUD APIs

This table covers the fundamental operations for managing your resources.

| Resource | Action | Method | URI | Request Example | Success Response (200/201) | Error Response (4xx/5xx) |
| --- | --- | --- | --- | --- | --- | --- |
| **Company** | Create | POST | `/api/v1/companies` | `{"name": "Hotel Nyandungu", "location_address": "22 KK 15 Rd, Kigali, Rwanda"}` | `{"success": true, "message": "Company created successfully"}` | `{"success": false, "message": "Error occurred"}` |
| **Company** | Get | GET | `/api/v1/companies/{id}` | `curl https://api.hadathub.com/api/v1/company/1` | `{"id": "1", "name": "Hotel Nyandungu", "ownerId": "user_550", "location_address": "22 KK 15 Rd, Kigali, Rwanda"}` | `{"success": false, "message": "Error occurred"}` |
| **Company** | Update | PUT | `/api/v1/companies/{id}` | `curl -X PUT ... -d '{"name": "New Hotel Name"}'` | `{"id": "1", "name": "New Hotel Name", "location_address": "22 KK 15 Rd, Kigali, Rwanda", "owner_id": "user_550", "update_at": "2026-01-15T21:30:00Z"}` | `{"success": false, "message": "Error occurred"}` |
| **Company** | Delete | DELETE | `/api/v1/companies/{id}` | `curl -X DELETE https://api.hadathub.com/api/v1/company/1` | `{"id": "1", "name": "Hotel Nyandungu", "location_address": "22 KK 15 Rd, Kigali, Rwanda", "owner_id": "user_550"}` | `{"success": false, "message": "Error occurred"}` |
| **Venue** | Create | POST | `/api/v1/venues` | `{"name": "BK Arena", "location_address": "KG 17 Ave", "capacity": 10000}` | `{"success": true, "message": "Venue created successfully"}` | `{"success": false, "message": "Error occurred"}` |
| **Venue** | Get | GET | `/api/v1/venues/{id}` | `curl https://api.hadathub.com/api/v1/venue/1` | `{"id": 1, "name": "BK Arena", "location_address": "KG 17 Ave", "capacity": 10000}` | `{"success": false, "message": "Error occurred"}` |
| **Venue** | Update | PUT | `/api/v1/venues/{id}` | `curl -X PUT ... -d '{"capacity": 12000}'` | `{"id": "1", "name": "BK Arena", "capacity": 12000}` | `{"success": false, "message": "Error occurred"}` |
| **Venue** | Delete | DELETE | `/api/v1/venues/{id}` | `curl -X DELETE https://api.hadathub.com/api/v1/venue/1` | `{"id": "1", "message": "Venue deleted successfully"}` | `{"success": false, "message": "Error occurred"}` |
| **User** | Create | POST | `/api/v1/users` | `{"username": "samdush", "email": "sam@example.com", "password": "secure_password_hash"}` | `{"success": true, "message": "User created successfully"}` | `{"success": false, "message": "Error occurred"}` |
| **User** | Get | GET | `/api/v1/users/{id}` | `curl https://api.hadathub.com/api/v1/user/1` | `{"id": "1", "username": "samdush", "email": "sam@example.com", "role": "ATTENDEE", "created_at": "2026-01-10T08:00:00Z"}` | `{"success": false, "message": "Error occurred"}` |
| **User** | Update | PUT | `/api/v1/users/{id}` | `curl -X PUT ... -d '{"username": "newusername"}'` | `{"id": "1", "username": "newusername", "email": "sam@example.com", "updated_at": "2026-01-15T09:00:00Z"}` | `{"success": false, "message": "Error occurred"}` |
| **Event** | Create | POST | `/api/v1/events` | `{"name": "Tech Conference", "venueId": "1", "date": "2026-03-01 T09:00:00Z"}` | `{"success": true, "message": "Event created successfully"}` | `{"success": false, "message": "Error occurred"}` |
| **Event** | Get | GET | `/api/v1/events/{id}` | `curl https://api.hadathub.com/api/v1/event/1` | `{"id": 1, "name": "Tech Conference", "venueId": "1", "date": "2026-03-01 T09:00:00Z"}` | `{"success": false, "message": "Error occurred"}` |
| **Event** | Update | PUT | `/api/v1/events/{id}` | `curl -X PUT ... -d '{"name": "Updated Tech Conference"}'` | `{"id": "1", "name": "Updated Tech Conference", "venue_id": "1", "attendance_fee": 15000, "updated_at": "2026-01-15T10:00:00Z"}` | `{"success": false, "message": "Error occurred"}` |
| **Event** | Delete | DELETE | `/api/v1/events/{id}` | `curl -X DELETE https://api.hadathub.com/api/v1/event/1` | `{"id": "1", "message": "Event deleted successfully"}` | `{"success": false, "message": "Error occurred"}` |
| **Order** | Create | POST | `/api/v1/orders` | `{"userId": "1", "eventId": "1", "quantity": 2}` | `{"success": true, "message": "Order created successfully"}` | `{"success": false, "message": "Error occurred"}` |
| **Order** | Get | GET | `/api/v1/orders/{id}` | `curl https://api.hadathub.com/api/v1/order/1` | `{"id": 1, "userId": "1", "eventId": "1", "quantity": 2}` | `{"success": false, "message": "Error occurred"}` |

# 5. Advanced Features

These endpoints handle the advanced logics and operations above the basic CRUDs, and effectively connect the multiple resource models in these operations.

| Category | Feature | Method | URI | Request Example | Success Response |
| --- | --- | --- | --- | --- | --- |
| **Associations** | User Tickets | GET | `/api/v1/users/{userId}/tickets` | `curl https://api.hadathub.com/api/v1/ticket/user/1` | `[{"id": "1", "eventId": "1", "userId": "1", "qrCode": "QR_7721_AX", "use_status": "AVAILABLE"}]` |
| **Associations** | User Orders | GET | `/api/v1/users/{userId}/orders` | `curl https://api.hadathub.com/api/v1/order/user/1` | `[ { "id": 1, "userId": "1", "eventId": "1", "quantity": 2, "status": "PAID" } ]` |
| **Domain Action** | Check-in Ticket | PUT | `/api/v1/tickets/{id}` | `curl -X PUT ... -d '{"status": "USED"}'` | `{"id": "1", "status": "USED", "qrCode": "QR_7721_AX"}` |
| **Domain Action** | Record Payment | POST | `/api/v1/payment-notification` | `{"orderId": "1", "amount": 5000, "status": "COMPLETED"}` | `{"success": true, "message": "Payment notification received"}` |

# 6. Rationale

My API technical design was inspired by how the major leading ticket management systems in Rwanda, like ([https://ticqet.rw/](https://ticqet.rw/)) work. And I tried to brainstorm and recreate the same model in the documentation as well.

---

**AI Use:** I crafted the whole and initial content of this document, but I afterwards used Gemini to: enhance my grammar, catch any mistakes in wording, rewrite any mistaken API snippets, format the document from docs to Markdown, and creating the tables.
