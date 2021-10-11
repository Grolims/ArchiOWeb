var express = require('express');
var router = express.Router();

/* get salepointes */

/* get salepoint ID */
router.get('/salepoints/:id', function(req, res) {
    res.send('Get item ' + req.params.id);
  });

/* post salepoint*/



module.exports = router;
