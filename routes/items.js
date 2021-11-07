const express = require('express');
const router = express.Router();
const { ObjectId } = require('bson');
const Item = require('../models/item');
const { authenticate } = require('./auth');
const asyncHandler = require('express-async-handler');

/* POST new item */
router.post('/', authenticate, asyncHandler(async (req, res, next) => {
    if (!req.body.userId || !ObjectId.isValid(req.body.userId)) {
      return res.status(400).send('User ID missing or invalid')
    }

    const newItem = new Item(req.body);
    await newItem.save();
    res.status(201).send(newItem);
  })
);

/* GET paginated items listing */
router.get('/', asyncHandler(async (req, res, next) => {
  
    const total = await Item.count();
    let query = Item.find();

    if (Array.isArray(req.query.userId)) {
      const user = req.query.userId.filter(ObjectId.isValid);
      query = query.where('userId').in(users);
    } else if (ObjectId.isValid(req.query.userId)) {
      query = query.where('userId').equals(req.query.userId);
    }
  
    if (!isNaN(req.query.price)) {
      query = query.where('price').equals(req.query.price);
    }
  
    if (!isNaN(req.query.priceHigh)) {
      query = query.where('price').gte(req.query.priceHigh);
    }
  
    if (!isNaN(req.query.priceLow)) {
      query = query.where('price').lte(req.query.priceLow);
    }
  
    //filter by 

    let page = parseInt(req.query.page, 10);
    if (isNaN(page) || page < 1) {
      page = 1;
    }
    // Parse the "pageSize" param (default to 100 if invalid)
    let pageSize = parseInt(req.query.pageSize, 10);
    if (isNaN(pageSize) || pageSize < 0 || pageSize > 100) {
      pageSize = 100;
    }
    // Apply skip and limit to select the correct page of elements
    query = query.skip((page - 1) * pageSize).limit(pageSize);

    query = await query.exec();

    res.send({
      page: page,
      pageSize: pageSize,
      total: total,
      data: query
    });
  })
);

/* GET item by id */
router.get('/:id', loadItemFromParamsMiddleware, asyncHandler(async (req, res, next) => {
    res.send(req.item);
  })
);

/* PATCH item by id */
router.patch('/:id', authenticate, loadItemFromParamsMiddleware, checkOwnerOrAdmin, asyncHandler(async (req, res, next) => {

    if (!req.body.name !== undefined) {
      req.item.name = req.body.name;
    }

    if (!req.body.type !== undefined) {
      req.item.type = req.body.type;
    }

    if (!req.body.picture !== undefined) {
      req.item.picture = req.body.picture;
    }

    if (!req.body.price !== undefined) {
      req.item.price = req.body.price;
    }

    if (!req.body.description !== undefined) {
      req.item.description = req.body.description;
    }

    if (!req.body.label !== undefined) {
      req.item.label = req.body.label;
    }

    await req.item.save();
    res.status(200).send(`Item ${req.item.name} has been succesfully updated!`)
  })
);

/* DELETE item by id */
router.delete('/:id', authenticate, loadItemFromParamsMiddleware, checkOwnerOrAdmin, asyncHandler(async (req, res, next) => {
    await Item.deleteOne({
      _id: req.params.id
    });

    res.status(200).send(`Ressource : ${req.item.name} deleted`)
  })
);

function loadItemFromParamsMiddleware(req, res, next) {
  const itemId = req.params.id;
  if (!ObjectId.isValid(itemId)) {
    return itemNotFound(res, itemId)
  }

  Item.findById(req.params.id, function (err, item) {
    if (err) {
      return next(err)
    } else if (!item) {
      return itemNotFound(res, itemId)
    }

    req.item = item;
    next();
  })
}

function itemNotFound(res, itemId) {
  return res.status(404).type('text').send(`No item found with ID ${itemId}`)
}

function checkOwnerOrAdmin(req, res, next) {

  const autho = req.currentUserPermissions === 'admin' || req.item.userId === req.currentUserId;
  if (!autho) {
    return res.status(403).send('Insufficient permissions')
  }


  next();
}




module.exports = router;
