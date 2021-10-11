GET /user
GET /user/:id 
GET /user/:registrationDate
GET /user/:username
GET /user/:mail

GET /item/
POST /item/
DELETE /item/:id
PUT /item/:id


GET /salepoint/:id


Aggregated data : 

GET /items?label=vegan 
GET /items?price=max / min 
GET /items?type=chicken/salepoints 
GET /salepoints/:id?include=user 
GET /salepoints/:id?include=items
GET /salepoints/:location
GET /items/:id?include=user
