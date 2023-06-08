## Users

- **Methods**: `GET`, `POST`, `PUT`, `DELETE`
- **Path**: `/api/users`, `/api/user/{user_id}`

Input: (for POST)
```
"email": string,
"password": string,
```

Input: (for PUT)
```
"id": int,
"first": string,
"last": string,
"avatar": string,
"email": string,
"username": string,
```

Output: (for GET all)
```
    "user": {
        "id": int,
        "email": string,
        }
```

Output: (for GET one)
```
    "id": int,
    "first": string,
    "last": string,
    "avatar": string,
    "email": string,
    "username": string,
```
