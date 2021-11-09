define({ "api": [
  {
    "type": "post",
    "url": "/api/user",
    "title": "Create a user",
    "name": "CreateUser",
    "group": "User",
    "version": "1.0.0",
    "description": "<p>Registers a new user.</p>",
    "success": {
      "fields": {
        "Response body": [
          {
            "group": "Response body",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>A unique identifier for the user generated by the server</p>"
          },
          {
            "group": "Response body",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>The username of the User</p>"
          },
          {
            "group": "Response body",
            "type": "Boolean",
            "optional": false,
            "field": "admin",
            "description": "<p>Is an admin account or not</p>"
          },
          {
            "group": "Response body",
            "type": "String",
            "optional": false,
            "field": "registrationdate",
            "description": "<p>The registration date of the User</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "201 Created",
          "content": "HTTP/1.1 201 Created\nContent-Type: application/json\nLocation: https://comem-rest-demo.herokuapp.com/api/user/58b2926f5e1def0123e97bc0\n\n{\n  \"id\": \"58b2926f5e1def0123e97bc0\",\n  \"username\": \"Kestar\",\n  \"admin\": true,\n  \"registrationdate\": \"2020-11-11T08:30:00.000Z\"\n}",
          "type": "json"
        }
      ]
    },
    "examples": [
      {
        "title": "Example",
        "content": "POST /api/user HTTP/1.1\nContent-Type: application/json\n\n{\n  \"username\": \"Kestar\",\n  \"admin\": true,\n  \"registrationdate\": \"1996-11-11T08:30:00.000Z\",\n  \"password\": \"zeqjfge6fedwe6e3f382\"\n}",
        "type": "json"
      }
    ],
    "filename": "routes/users.js",
    "groupTitle": "User",
    "parameter": {
      "fields": {
        "Request body": [
          {
            "group": "Request body",
            "type": "String",
            "size": "3..30",
            "optional": false,
            "field": "username",
            "description": "<p>The username of the User (must be unique)</p>"
          },
          {
            "group": "Request body",
            "type": "Boolean",
            "optional": false,
            "field": "admin",
            "description": "<p>Is an admin account or not</p>"
          },
          {
            "group": "Request body",
            "type": "String",
            "optional": false,
            "field": "registrationdate",
            "description": "<p>The registration date of the User (<a href=\"https://en.wikipedia.org/wiki/ISO_8601\">ISO-8601</a> format)</p>"
          },
          {
            "group": "Request body",
            "type": "String",
            "size": "min 8",
            "optional": false,
            "field": "password",
            "description": "<p>Password of the account</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "422/UnprocessableEntity",
            "description": "<p>Some of the User's properties are invalid</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "422 Unprocessable Entity",
          "content": "HTTP/1.1 422 Unprocessable Entity\nContent-Type: application/json\n\n{\n  \"message\": \"User validation failed\",\n  \"errors\": {\n    \"gender\": {\n      \"kind\": \"enum\",\n      \"message\": \"`foo` is not a valid enum value for path `gender`.\",\n      \"name\": \"ValidatorError\",\n      \"path\": \"gender\",\n      \"properties\": {\n        \"enumValues\": [\n          \"male\",\n          \"female\",\n          \"other\"\n        ],\n        \"message\": \"`{VALUE}` is not a valid enum value for path `{PATH}`.\",\n        \"path\": \"gender\",\n        \"type\": \"enum\",\n        \"value\": \"foo\"\n      },\n      \"value\": \"foo\"\n    }\n  }\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "delete",
    "url": "/api/movies/:id",
    "title": "Delete a user",
    "name": "DeleteUser",
    "group": "User",
    "version": "1.0.0",
    "description": "<p>Permanently deletes a user</p>",
    "filename": "routes/users.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "/api/user",
    "title": "List user",
    "name": "RetrieveUser",
    "group": "User",
    "version": "1.0.0",
    "description": "<p>Retrieves a paginated list of user sorted by name (in alphabetical order).</p>",
    "parameter": {
      "fields": {
        "URL query parameters": [
          {
            "group": "URL query parameters",
            "type": "String",
            "optional": true,
            "field": "gender",
            "description": "<p>Select only user of the specified gender</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example",
        "content": "GET /api/user?gender=male&page=2&pageSize=50 HTTP/1.1",
        "type": "json"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "200 OK",
          "content": "HTTP/1.1 200 OK\nContent-Type: application/json\nLink: &lt;https://comem-rest-demo.herokuapp.com/api/user?page=1&pageSize=50&gt;; rel=\"first prev\"\n\n[\n  {\n  \"id\": \"58b2926f5e1def0123e97bc0\",\n  \"username\": \"Kestar\",\n  \"admin\": false,\n  \"registrationdate\": \"2020-11-11T08:30:00.000Z\"\n},\n  {\n  \"id\": \"58b3226f5a1def0453e97bc0\",\n  \"username\": \"Mikvester\",\n  \"admin\": false,\n  \"registrationdate\": \"2020-06-11T08:30:00.000Z\"\n}\n]",
          "type": "json"
        }
      ],
      "fields": {
        "Response body": [
          {
            "group": "Response body",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>The unique identifier of the User</p>"
          },
          {
            "group": "Response body",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>The username of the User</p>"
          },
          {
            "group": "Response body",
            "type": "Boolean",
            "optional": false,
            "field": "admin",
            "description": "<p>Is an admin account or not</p>"
          },
          {
            "group": "Response body",
            "type": "String",
            "optional": false,
            "field": "registrationdate",
            "description": "<p>The registration date of the User</p>"
          }
        ]
      }
    },
    "filename": "routes/users.js",
    "groupTitle": "User"
  }
] });
