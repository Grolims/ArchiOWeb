var express = require('express');
var router = express.Router();

/* get salepointes */
router.get('/', () => {

}),

/* get salepoint ID */
router.get('/:id', function(req, res) {
    res.send('Get item ' + req.params.id);
  });

/* post salepoint*/



module.exports = router;
