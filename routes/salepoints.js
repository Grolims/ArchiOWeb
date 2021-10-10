var express = require('express');
var router = express.Router();

/* get salpoint. */
router.get('/salepoint/:id', function(req, res, next) {
    res.send('Get item ' + req.params.id);
  });


module.exports = router;
