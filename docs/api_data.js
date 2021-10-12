define({ "api": [
  {
    "type": "get",
    "url": "/salepoint/:id",
    "title": "Retrieve a Salepoint",
    "name": "RetrieveSalepoint",
    "group": "Salepoint",
    "version": "1.0.0",
    "description": "<p>Retrieves one Salepoint.</p>",
    "examples": [
      {
        "title": "Example",
        "content": "GET /salepoint/58b2926f5e1def0123e97281 HTTP/1.1",
        "type": "json"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "200 OK",
          "content": "HTTP/1.1 200 OK\nContent-Type: application/json\n\n{\n  \"id\": \"58b2926f5e1def0123e97281\",\n  \"name\": \"Les pommes d'adam\",\n  \"type\": \"Fruits\",\n  \"rating\": 7.4,\n  \"createdAt\": \"1988-07-12T00:00:00.000Z\"\n  \"coordinate\": \"46.7810030625192,6.647229773330583\"\n  \"address\": \"Avenue des sports 20\"\n  \"picture\": \"/img/salepoint1.jpg\"\n  \"paymentMethod\": \"Twint\"\n}",
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
            "description": "<p>The unique identifier of the Salepoint</p>"
          },
          {
            "group": "Response body",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>The name of the salepoint</p>"
          },
          {
            "group": "Response body",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>The type of the salepoint</p>"
          },
          {
            "group": "Response body",
            "type": "Number",
            "optional": false,
            "field": "rating",
            "description": "<p>How the Salepoint has been rated on a scale of 0 to 10</p>"
          },
          {
            "group": "Response body",
            "type": "String",
            "optional": false,
            "field": "address",
            "description": "<p>The address of the salepoint</p>"
          },
          {
            "group": "Response body",
            "type": "String",
            "optional": false,
            "field": "picture",
            "description": "<p>The picture's url of the salepoint</p>"
          },
          {
            "group": "Response body",
            "type": "String",
            "optional": false,
            "field": "createdAt",
            "description": "<p>The date at which the salepoint was registered</p>"
          },
          {
            "group": "Response body",
            "type": "String",
            "optional": false,
            "field": "paymentMethod",
            "description": "<p>The payment methode in the salepoint</p>"
          }
        ]
      }
    },
    "filename": "routes/salepoints.js",
    "groupTitle": "Salepoint",
    "parameter": {
      "fields": {
        "URL path parameters": [
          {
            "group": "URL path parameters",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>The unique identifier of the Salepoint to retrieve</p>"
          }
        ],
        "URL query parameters": [
          {
            "group": "URL query parameters",
            "type": "String",
            "optional": true,
            "field": "include",
            "description": "<p>Embed linked resources in the response body:</p> <ul> <li><code>&quot;director&quot;</code> for the Salepoint's director</li> </ul>"
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
            "field": "404/NotFound",
            "description": "<p>No Salepoint was found corresponding to the ID in the URL path</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "404 Not Found",
          "content": "HTTP/1.1 404 Not Found\nContent-Type: text/plain\n\nNo Salepoint found with ID 58b2926f5e1def0123e97281",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/salepoint/",
    "title": "list salepoints",
    "name": "RetrieveSalepoints",
    "group": "Salepoint",
    "version": "1.0.0",
    "description": "<p>Retrieves a paginated list of movies ordered by title (in alphabetical order).</p>",
    "parameter": {
      "fields": {
        "URL query parameters": [
          {
            "group": "URL query parameters",
            "type": "Number",
            "optional": true,
            "field": "rating",
            "description": "<p>Select only salepoints with the specified rating (exact match)</p>"
          },
          {
            "group": "URL query parameters",
            "type": "Number",
            "optional": true,
            "field": "ratedAtLeast",
            "description": "<p>Select only salepoints with a rating greater than or equal to the specified rating</p>"
          },
          {
            "group": "URL query parameters",
            "type": "Number",
            "optional": true,
            "field": "ratedAtMost",
            "description": "<p>Select only salepoints with a rating lesser than or equal to the specified rating</p>"
          },
          {
            "group": "URL query parameters",
            "type": "String",
            "optional": true,
            "field": "include",
            "description": "<p>Embed linked resources in the response body:</p> <ul> <li><code>&quot;director&quot;</code> for the Salepoint's director</li> </ul>"
          }
        ],
        "URL path parameters": [
          {
            "group": "URL path parameters",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>The unique identifier of the Salepoint to retrieve</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example",
        "content": "GET /salepoint?page=2&pageSize=50 HTTP/1.1",
        "type": "json"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "200 OK",
          "content": "   HTTP/1.1 200 OK\n   Content-Type: application/json\n\n[\n   {\n     \"id\": \"58b2926f5e1def0123e97281\",\n     \"name\": \"Les pommes d'adam\",\n     \"type\": \"Fruits\",\n     \"rating\": 7.4,\n     \"createdAt\": \"1988-07-12T00:00:00.000Z\"\n     \"coordinate\": \"46.7810030625192,6.647229773330583\"\n     \"address\": \"Avenue des sports 20\"\n     \"picture\": \"/img/salepoint1.jpg\"\n     \"paymentMethod\": \"Twint\"\n   }\n\n   {\n     \"id\": \"58b2926f5e1def0123e97281\",\n     \"name\": \"Les pommes d'adam 2\",\n     \"type\": \"Fruits\",\n     \"rating\": 3.4,\n     \"createdAt\": \"1988-07-12T00:00:00.000Z\"\n     \"coordinate\": \"46.7810030625192,6.647229773330583\"\n     \"address\": \"Avenue des sports 32\"\n     \"picture\": \"/img/salepoint2.jpg\"\n     \"paymentMethod\": \"Twint\"\n   }\n\n   {\n     \"id\": \"58b2926f5e1def0123e97281\",\n     \"name\": \"Les pommes d'adam 3\",\n     \"type\": \"Fruits\",\n     \"rating\": 5.4,\n     \"createdAt\": \"1988-07-12T00:00:00.000Z\"\n     \"coordinate\": \"46.7810030625192,6.647229773330583\"\n     \"address\": \"Avenue des sports 46\"\n     \"picture\": \"/img/salepoint3.jpg\"\n     \"paymentMethod\": \"Twint\"\n   }\n\n ]",
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
            "description": "<p>The unique identifier of the Salepoint</p>"
          },
          {
            "group": "Response body",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>The name of the salepoint</p>"
          },
          {
            "group": "Response body",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>The type of the salepoint</p>"
          },
          {
            "group": "Response body",
            "type": "Number",
            "optional": false,
            "field": "rating",
            "description": "<p>How the Salepoint has been rated on a scale of 0 to 10</p>"
          },
          {
            "group": "Response body",
            "type": "String",
            "optional": false,
            "field": "address",
            "description": "<p>The address of the salepoint</p>"
          },
          {
            "group": "Response body",
            "type": "String",
            "optional": false,
            "field": "picture",
            "description": "<p>The picture's url of the salepoint</p>"
          },
          {
            "group": "Response body",
            "type": "String",
            "optional": false,
            "field": "createdAt",
            "description": "<p>The date at which the salepoint was registered</p>"
          },
          {
            "group": "Response body",
            "type": "String",
            "optional": false,
            "field": "paymentMethod",
            "description": "<p>The payment methode in the salepoint</p>"
          }
        ]
      }
    },
    "filename": "routes/salepoints.js",
    "groupTitle": "Salepoint",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "404/NotFound",
            "description": "<p>No Salepoint was found corresponding to the ID in the URL path</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "404 Not Found",
          "content": "HTTP/1.1 404 Not Found\nContent-Type: text/plain\n\nNo Salepoint found with ID 58b2926f5e1def0123e97281",
          "type": "json"
        }
      ]
    }
  }
] });
