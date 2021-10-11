var express = require('express');
var router = express.Router();
const Salepoint = require('../models/salepoint');

/* get salepointes */
router.get('/', () => {

}),

/* get salepoint ID */
router.get('/:id', function(req, res, next) {
  Salepoint.find().sort('name').exec((err, salepoints) => {
    if (err) {
      return next(err);
    }

    res.send(salepoints);
  })
  });

/* post salepoint*/
router.post('/', (req, res, next) => {
  const newSalepoint = new Item(req.body);

  newSalepoint.save( (err, savedSalepoint) => {
    if (err) {
      return next(err);
    }

    res.send(savedSalepoint);
  })
});


module.exports = router;
