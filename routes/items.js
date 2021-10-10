var express = require('express');
var router = express.Router();

/* get item ID. */
router.get('/item/:id', function(req, res, next) {
    res.send('Get item ' + req.params.id);
  });

/* post item. */


module.exports = router;
