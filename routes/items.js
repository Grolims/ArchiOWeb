const express = require('express');
const router = express.Router();
const Item = require('../models/item');

/* GET all items (sorted by name ASC) */
router.get('/', (req, res, next) => {
    Item.find().sort('name').exec((err, items) => {
      if (err) {
        return next(err);
      }

      res.send(items);
    })
});

/* get item ID. */
router.get('/:id', (req, res, next) => {
    res.send('Get item ' + req.params.id);
  });

/* POST item */
router.post('/', (req, res, next) => {
  const newItem = new Item(req.body);

  newItem.save( (err, savedItem) => {
    if (err) {
      return next(err);
    }

    res.send(savedItem);
  })
});


module.exports = router;
