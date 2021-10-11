var express = require('express');
var router = express.Router();
const Salepoint = require('../models/salepoint');

/* GET all salepoints (sorted by name ASC) */
router.get('/', (req, res, next) => {
  Salepoint.find().sort('name').exec((err, salepoints) => {
    if (err) {
      return next(err);
    }

    res.send(salepoints);
  })
});

/* get salepoint ID. */
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


module.exports = router;
