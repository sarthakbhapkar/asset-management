# API Documentation

#### POST /login
#### POST /employee
#### PUT /user?id 
#### DELETE /user?id

#### POST /asset
#### GET /assets  -- get asset by id and all assets using token
#### POST /assign-assets
#### POST /unassign-asset
#### DELETE /asset?id
#### GET /asset-history
#### GET /employee-requests

--------- Later on -------------
#### POST /request
#### GET /employee-request?emp_id
#### GET /employee-requests
#### PUT /employee-request?id

#### POST /make-admin

#### GET /employees/no-assets
#### GET /assets/unassigned-assets
#### GET /employees/with-assets
#### GET /pending-requests
----------------------------------------------------------
#### POST /forgot-password
#### POST /reset-password
#### GET /employees/software-assets
#### GET /assets/unassigned-hardware
#### GET /employees/unassigned-software


--------------------------------------------------------
### DONE



---------------------------------------------------------
# Login API

- **URL**: `POST /login`
- **Query Params**: None
- **Request Body**:
  ```
    email: sarthak@gmail.com
    password: sarthak
  ```
- **Response**:
  ```
    <token>
  ```

# USERS

## 1) Get All users API
- **URL**: `GET /users`
- **Query Params**: None
- **Request Header**:
    - **Authorization** : token
- **Response**:
  ```
  {
    users:[
    {
      id: 1,
      first_name: "Sarthak",
      last_name: "Bhapkar",
      email: "sarthak@gmail.com",
      role: "admin",
      seat_n: 1,
      active: true
    },
    {
      ...
    },
    ]
  }
  ```
## 2) Get user by id API
- **URL**: `GET /users/{user_id}`
- **Query Params**: None
- **Request Header**:
    - **Authorization** : token
- **Response**:
  ```
  {
      id: 1,
      first_name: "Sarthak",
      last_name: "Bhapkar",
      email: "sarthak@gmail.com",
      role: "admin",
      seat_n: 1,
      "active": true
  }
  ```
## 3) Update user API
- **URL**: `PUT /users/{user_id}`
- **Query Params**: None
- **Request Header**:
    - **Authorization** : token
- **Request Body**:
  ```
  {
      email: "shivam@gmail.com"
  }
  ```
- **Response**:
  ```
  {
    id: 2,
    first_name: "Shivam",
    last_name: "Chouksey",
    email: "shivam@gmail.com",
    role: "employee",
    seat_n: 2,
    active: true
  }
  ```
## 4) Delete user API
- **URL**: `DELETE /users/{user_id}`
- **Query Params**: None
- **Request Header**:
    - **Authorization** : token
- **Response**:
  ```
  {
  "message": "User deleted successfully."
  }
  ```
## 5) Add new user API
- **URL**: `POST /users`
- **Query Params**: None
- **Request Header**:
    - **Authorization** : token
- **Request Body**:
  ```
  {
    "first_name": "Aditya",
    "last_name": "Gaikwad",
    "email": "aditya@gmail.com",
    "role": "employee",
    "seat_n": 3,
    "active": true
  }
  ```
- **Response**:
  ```
  {
    "id": 3,
    "first_name": "Aditya",
    "last_name": "Gaikwad",
    "email": "aditya@gmail.com",
    "role": "employee",
    "seat_n": 3,
    "active": true
  }

  ```
## 6) Get All users with no assets API
- **URL**: `GET /users/no-assets`
- **Query Params**: None
- **Request Header**:
  - **Authorization** : token
- **Response**:
  ```
  {
    users:[
    {
      id: 1,
      first_name: "Sarthak",
      last_name: "Bhapkar",
      email: "sarthak@gmail.com",
      role: "admin",
      seat_n: 1,
      active: true
    },
    {
      ...
    },
    ]
  }
  ```

# ASSETS

## 1) Get All available assets API
- **URL**: `GET /assets`
- **Query Params**: None
- **Request Header**:
    - **Authorization** : token
- **Response**:
  ```
  {
   "assets": [
    {
      "id": 1,
      "name": "Laptop",
      "type": "Dell XPS 13",
      "created_at": "2024-10-20"
    },
    {
      ...
    }
   ]
  }
  ```
## 2) Get asset by id API
- **URL**: `GET /assets/{asset_id}`
- **Query Params**: None
- **Request Header**:
    - **Authorization** : token
- **Response**:
  ```
  {
     "id": 1,
     "name": "Laptop",
     "type": "Hardware",
     "created_at": "2024-10-20"
  }
  ```

## 3) Update asset API
- **URL**: `PUT /assets/{asset_id}`
- **Query Params**: None
- **Request Header**:
    - **Authorization** : token
- **Request Body**:
  ```
    {
      "name": "Lenovo",
      "type": "Hardware",
      "status": "assigned"
    }
  ```
- **Response**:
  ```
  {
    "id": 1,
    "name": "Lenovo",
    "type": "Hardware",
    "status": "assigned",
    "assigned_to": 1
  }
  ```
## 4) Delete asset API
- **URL**: `DELETE /assets/{asset_id}`
- **Query Params**: None
- **Request Header**:
    - **Authorization** : token
- **Response**:
  ```
  {
  "message": "Asset deleted successfully."
  }
  ```
## 5) Add new asset API
- **URL**: `POST /assets`
- **Query Params**: None
- **Request Header**:
    - **Authorization** : token
- **Request Body**:
  ```
  {
    "name": "MacBook-11",
    "type": "Hardware",
    "created_at": "2024-10-22",
    "status": "available"
  }
  ```
- **Response**:
  ```
  {
    "id": 4,
    "name": "MacBook-11",
    "type": "Hardware",
    "created_at": "2024-10-22",
    "status": "available",
    "user_id": null,
    "assigned_at":null,
    "unassigned_at":null
  }
  ```

## 6) Assign asset API
- **URL**: `POST /assets/{asset_id}/assign`
- **Query Params**: None
- **Request Header**:
    - **Authorization** : token
- **Request Body**:
  ```
    {
      "user_id":1
    }
  ```
- **Response**:
  ```
  {
     "message": "Asset Unassigned successfully.",
     "asset": {
       "id": 1,
       "name": "Laptop",
       "assigned_at": null,
       "unassign_at": "2024-10-22",
       "status": "Available"
     }
  }
  ```
## 7) Unassign Asset API
- **URL**: `POST /assets/{asset_id}/unassign`
- **Query Params**: None
- **Request Header**:
    - **Authorization** : token
- **Request Body**:
  ```
    {
      "user_id":1
    }
  ```
- **Response**:
  ```
  {
    "message": "Asset Unassigned successfully.",
    "asset": {
      "id": 1,
      "name": "Laptop",
      "assigned_at" null,
      "unassign_at" "2024-10-22",
      "status": "Available"
    }
  }
  ```

## 8) Get asset by user_id API
- **URL**: `GET /assets/user/{user_id}`
- **Query Params**: None
- **Request Header**:
    - **Authorization** : token
- **Response**:
  ```
  {
     "assets": [
      {
        "id": 1,
        "name": "Laptop",
        "type": "Dell XPS 13",
        "created_at": "2024-10-20",
        "status": "assigned",
        "assigned_to": 1,
        "assigned_at": "2024-10-20"
      },
      {
        ...
      }
    ]
  }
  ```
# ASSET HISTORY API

## 1) Get All asset-history API
- **URL**: `GET /asset-history`
- **Query Params**: None
- **Request Header**:
    - **Authorization** : token
- **Response**:
  ```
  {
    "asset_history": [
      {
        "id": 1,
        "user_id": 1,
        "asset_id": 1,
        "assigned_at": "2024-10-20",
        "unassigned_at": null
      },
      ...
     ]
  }
  ```
## 2) Get asset-history by asset_id API
- **URL**: `GET /asset-history/asset/{asset_id}`
- **Query Params**: None
- **Request Header**:
    - **Authorization** : token
- **Response**:
  ```
  {
    "asset_history": [
      {
        "id": 1,
        "user_id": 1,
        "asset_id": 1,
        "assigned_at": "2024-10-20",
        "unassigned_at": null
      },
      {
        "id": 2,
        "user_id": 2,
        "asset_id": 1,
        "assigned_at": "2024-10-21",
        "unassigned_at": "2024-10-22"
      }
    ]
  }
  ```
## 3) Create asset-history API
- **URL**: `Post /asset-history`
- **Query Params**: None
- **Request Header**:
    - **Authorization** : token
- **Request Body**:
  ```
    {
      "user_id": 1,
      "asset_id": 1,
      "assigned_at": "2024-10-20T12:00:00Z",
      "unassigned_at": null
    }
  ```
- **Response**:
  ```
  {
    "id": 2,
    "user_id": 1,
    "asset_id": 1,
    "assigned_at": "2024-10-20",
    "unassigned_at": null
  }
  ```

## 4) Update asset-history API
- **URL**: `PUT /asset-history/{id}`
- **Query Params**: None
- **Request Header**:
    - **Authorization** : token
- **Request Body**:
  ```
  {
    "unassigned_at": "2024-10-22"
  }
  ```
- **Response**:
  ```
  {
    "id": 1,
    "user_id": 1,
    "asset_id": 1,
    "assigned_at": "2024-10-20",
    "unassigned_at": "2024-10-22"
  }
  ```

# EMPLOYEE HISTORY API

## 1) Get All employee-request API
- **URL**: `GET /employee-requests`
- **Query Params**: None
- **Request Header**:
    - **Authorization** : token
- **Response**:
  ```
  {
    "request_history": [
    {
      "id": 1,
      "user_id": 1,
      "asset_id": 1,
      "status": "requested"
    },
    ...
    ]
  }
  ```
## 2) Get employee-requests by user_id API
- **URL**: `GET /employee-requests/user/{user_id}`
- **Query Params**: None
- **Request Header**:
    - **Authorization** : token
- **Response**:
  ```
  {
    "request_history": [
      {
        "id": 1,
        "user_id": 1,
        "asset_id": 1,
        "status": "approved"
      },
      {
        "id": 2,
        "user_id": 1,
        "asset_id": 3,
        "status": "approved"
      }
    ]
  }
  ```
## 3) Create employee-requests API
- **URL**: `POST /employee-request`
- **Query Params**: None
- **Request Header**:
    - **Authorization** : token
- **Request Body**:
  ```
    {
      "user_id": 1,
      "asset_id": 1,
      "status": "requested"
    }
  ```
- **Response**:
  ```
  {
    "id": 2,
    "user_id": 1,
    "asset_id": 1,
    "status": "requested"
  }
  ```

## 4) Update employee-request API
- **URL**: `PUT /employee-request/{emp_id}`
- **Query Params**: None
- **Request Header**:
    - **Authorization** : token
- **Request Body**:
  ```
    {
      "status": "approved"
    }
  ```
- **Response**:
  ```
  {
    "id": 1,
    "user_id": 1,
    "asset_id": 1,
    "status": "approved"
  }
  ```

## 5) Get All pending requests API
- **URL**: `GET /pending-requests`
- **Query Params**: None
- **Request Header**:
  - **Authorization** : token
- **Response**:
  ```
  {
    "request_history": [
    {
      "id": 1,
      "user_id": 1,
      "asset_id": 1,
      "status": "pending"
    },
    ...
    ]
  }
  ```

# Forgot Password API


## 1) Forgot Password API
- **URL**: `POST /forgot-password`
- **Query Params**: None
- **Request Header**: None 
- **Request Body**:
  ```
    {
      "email": "sarthak@gmail.com"
    }
  ```
- **Response**:
  ```
  {
    "message": "If the email exists, a password reset link has been sent."
  }
  ```

## 2) Reset Password API
- **URL**: `POST /reset-password`
- **Query Params**: None
- **Request Header**: None
- **Request Body**:
  ```
    {
      "token": "<token>",
      "new_password": "newPassword123"
    }
  ```
- **Response**:
  ```
  {
    "message": "Password has been reset successfully."
  }
  ```
  

