define({ "api": [
  {
    "type": "get",
    "url": "/salepoint/:id",
    "title": "Request a salepoint's information",
    "name": "GetSalepoint",
    "group": "Salepoint",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Unique identifier of the salepoint</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "firstName",
            "description": "<p>First name of the user</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "lastName",
            "description": "<p>Last name of the user</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/salepoints.js",
    "groupTitle": "Salepoint"
  }
] });
