var express = require('express');
var router = express.Router();

/* get item. */
router.get('/item/:id', function(req, res, next) {
    res.send('Get item ' + req.params.id);
  });


module.exports = router;
