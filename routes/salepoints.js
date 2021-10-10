var express = require('express');
var router = express.Router();

/* get salpoint ID. */
router.get('/salepoint/:id', function(req, res) {
    res.send('Get item ' + req.params.id);
  });

/* post salepoint*/



module.exports = router;
