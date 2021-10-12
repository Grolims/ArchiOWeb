var express = require('express');
var router = express.Router();
const Salepoint = require('../models/salepoint');




/**
 * @api {get} /salepoint/ list salepoints 
 * @apiName RetrieveSalepoints
 * @apiGroup Salepoint
 * @apiVersion 1.0.0
 * @apiDescription Retrieves a paginated list of movies ordered by title (in alphabetical order).
 *
 * @apiUse SalepointIdInUrlPath
 * @apiUse SalepointInResponseBody
 * @apiUse SalepointIncludes
 * @apiUse SalepointNotFoundError
 * 
 * @apiParam (URL query parameters) {Number} [rating] Select only salepoints with the specified rating (exact match)
 * @apiParam (URL query parameters) {Number} [ratedAtLeast] Select only salepoints with a rating greater than or equal to the specified rating
 * @apiParam (URL query parameters) {Number} [ratedAtMost] Select only salepoints with a rating lesser than or equal to the specified rating
 *
 * @apiExample Example
 *     GET /salepoint?page=2&pageSize=50 HTTP/1.1
 *
 * @apiSuccessExample 200 OK
 *     HTTP/1.1 200 OK
 *     Content-Type: application/json
 *
 *  [
 *     {
 *       "id": "58b2926f5e1def0123e97281",
 *       "name": "Les pommes d'adam",
 *       "type": "Fruits",
 *       "rating": 7.4,
 *       "createdAt": "1988-07-12T00:00:00.000Z"
 *       "coordinate": "46.7810030625192,6.647229773330583"
 *       "address": "Avenue des sports 20"
 *       "picture": "/img/salepoint1.jpg"
 *       "paymentMethod": "Twint"
 *     }
 * 
 *     {
 *       "id": "58b2926f5e1def0123e97281",
 *       "name": "Les pommes d'adam 2",
 *       "type": "Fruits",
 *       "rating": 3.4,
 *       "createdAt": "1988-07-12T00:00:00.000Z"
 *       "coordinate": "46.7810030625192,6.647229773330583"
 *       "address": "Avenue des sports 32"
 *       "picture": "/img/salepoint2.jpg"
 *       "paymentMethod": "Twint"
 *     }
 * 
 *     {
 *       "id": "58b2926f5e1def0123e97281",
 *       "name": "Les pommes d'adam 3",
 *       "type": "Fruits",
 *       "rating": 5.4,
 *       "createdAt": "1988-07-12T00:00:00.000Z"
 *       "coordinate": "46.7810030625192,6.647229773330583"
 *       "address": "Avenue des sports 46"
 *       "picture": "/img/salepoint3.jpg"
 *       "paymentMethod": "Twint"
 *     }
 * 
 *   ]
 */
router.get('/', (req, res, next) => {
  Salepoint.find().sort('name').exec((err, salepoints) => {
    if (err) {
      return next(err);
    }

    res.send(salepoints);
  })
});

/**
 * @api {get} /salepoint/:id Retrieve a Salepoint
 * @apiName RetrieveSalepoint
 * @apiGroup Salepoint
 * @apiVersion 1.0.0
 * @apiDescription Retrieves one Salepoint.
 *
 * @apiUse SalepointIdInUrlPath
 * @apiUse SalepointInResponseBody
 * @apiUse SalepointIncludes
 * @apiUse SalepointNotFoundError
 *
 * @apiExample Example
 *     GET /salepoint/58b2926f5e1def0123e97281 HTTP/1.1
 *
 * @apiSuccessExample 200 OK
 *     HTTP/1.1 200 OK
 *     Content-Type: application/json
 *
 *     {
 *       "id": "58b2926f5e1def0123e97281",
 *       "name": "Les pommes d'adam",
 *       "type": "Fruits",
 *       "rating": 7.4,
 *       "createdAt": "1988-07-12T00:00:00.000Z"
 *       "coordinate": "46.7810030625192,6.647229773330583"
 *       "address": "Avenue des sports 20"
 *       "picture": "/img/salepoint1.jpg"
 *       "paymentMethod": "Twint"
 *     }
 */
router.get('/:id', (req, res, next) => {
  res.send('Get salepoint ' + req.params.id);
});

/* post salepoint*/
router.post('/', (req, res, next) => {
  const newSalepoint = new Salepoint(req.body);

  newSalepoint.save( (err, savedSalepoint) => {
    if (err) {
      return next(err);
    }

    res.send(savedSalepoint);
  })
});


/**
 * @apiDefine SalepointIdInUrlPath
 * @apiParam (URL path parameters) {String} id The unique identifier of the Salepoint to retrieve
 */

/**
 * @apiDefine SalepointInRequestBody
 * @apiParam (Request body) {String{3..50}} name The name of the Salepoint (must be unique)
 * @apiParam (Request body) {Number{0..10}} [rating] How the Salepoint has been rated on a scale of 0 to 10
 */

/**
 * @apiDefine SalepointInResponseBody
 * @apiSuccess (Response body) {String} id The unique identifier of the Salepoint
 * @apiSuccess (Response body) {String} name The name of the salepoint
 * @apiSuccess (Response body) {String} type The type of the salepoint
 * @apiSuccess (Response body) {Number} rating How the Salepoint has been rated on a scale of 0 to 10
 * @apiSuccess (Response body) {String} address The address of the salepoint
 * @apiSuccess (Response body) {String} picture The picture's url of the salepoint
 * @apiSuccess (Response body) {String} createdAt The date at which the salepoint was registered
 * @apiSuccess (Response body) {String} paymentMethod The payment methode in the salepoint
 */

/**
 * @apiDefine SalepointIncludes
 * @apiParam (URL query parameters) {String} [include] Embed linked resources in the response body:
 * * `"director"` for the Salepoint's director
 */

/**
 * @apiDefine SalepointNotFoundError
 *
 * @apiError {Object} 404/NotFound No Salepoint was found corresponding to the ID in the URL path
 *
 * @apiErrorExample {json} 404 Not Found
 *     HTTP/1.1 404 Not Found
 *     Content-Type: text/plain
 *
 *     No Salepoint found with ID 58b2926f5e1def0123e97281
 */

/**
 * @apiDefine SalepointValidationError
 *
 * @apiError {Object} 422/UnprocessableEntity Some of the Salepoint's properties are invalid
 *
 * @apiErrorExample {json} 422 Unprocessable Entity
 *     HTTP/1.1 422 Unprocessable Entity
 *     Content-Type: application/json
 *
 *     {
 *       "message": "Salepoint validation failed",
 *       "errors": {
 *         "title": {
 *           "kind": "minlength",
 *           "message": "Path `title` (`0`) is shorter than the minimum allowed length (3).",
 *           "name": "ValidatorError",
 *           "path": "title",
 *           "properties": {
 *             "message": "Path `{PATH}` (`{VALUE}`) is shorter than the minimum allowed length (3).",
 *             "minlength": 3,
 *             "path": "title",
 *             "type": "minlength",
 *             "value": "0"
 *           },
 *           "value": "0"
 *         }
 *       }
 *     }
 */


module.exports = router;
