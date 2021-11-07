var express = require('express');
const asyncHandler = require('express-async-handler');
var router = express.Router();
const { ObjectId } = require('bson');
const Salepoint = require('../models/salepoint');
const Item = require('../models/item')
const { authenticate } = require('./auth');

/* POST new salepoint */
router.post('/', authenticate, asyncHandler(async (req, res, next) => {
    if (!req.body.userId || !ObjectId.isValid(req.body.userId)) {
      return res.status(400).send(`${req.body.userId} is not a valid User ID`);
    }

    const newSalepoint = new Salepoint(req.body);
    await newSalepoint.save();
    res.status(201).send(newSalepoint);

  })
);

/* GET paginated salepoints listing */
router.get('/', asyncHandler(async (req, res, next) => {
    const total = await Salepoint.count();
    let query = Salepoint.find();

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

/* GET salepoint by id and associated user & items */
router.get('/:id', loadSalepointFromParamsMiddleware, async function (req, res, next) {
  res.send(req.salepoint);
});

/* PATCH salepoint by id */
router.patch('/:id', authenticate, loadSalepointFromParamsMiddleware, checkOwnerOrAdmin, asyncHandler(async (req, res, next) => {
    
    if (req.body.address !== undefined) {
      req.salepoint.address = req.body.address;
    }

    if (req.body.paymentMethod !== undefined) {
      req.salepoint.paymentMethod = req.body.paymentMethod;
    }

    if (req.body.picture !== undefined) {
      req.salepoint.picture = req.body.picture;
    }

    if (req.body.items !== undefined) {
      if (!Array.isArray(req.body.items)) { return res.status(400).send('Invalid items structure') }
      req.body.items.forEach(itemId => {
        if (!ObjectId.isValid(itemId)) {
          return res.status(400).send('Invalid itemId')
        }
        req.salepoint.items.push(itemId);
      })
    }

    await req.salepoint.save();
    res.status(200).send(`Salepoint ${req.salepoint.address} has been succesfully updated!`)

  })
);

/* DELETE salepoint by id */
router.delete('/:id', authenticate, loadSalepointFromParamsMiddleware, checkOwnerOrAdmin, asyncHandler( async(req, res, next) => {
    await Salepoint.deleteOne({
      _id: req.params.id
    });

    res.status(200).send(`Ressource : ${req.salepoint.address} deleted`)
  })
);


function querySalepoints(req) {

  let query = Salepoint.find();

  if (ObjectId.isValid(req.query.userId)) {
    query = query.where('userId').equals(req.query.userId);
  }

  if (Array.isArray(req.query.items)) {
    const items = req.query.items(filter(ObjectId.isValid));
    query = query.where('items').in(items);
  } else if (ObjectId.isValid(req.query.items)) {
    query = query.where('items').equals(req.query.items);
  }

  if (!isNaN(req.query.paymentMethod)) {
    query = query.where('paymentMethod').equals(req.query.paymentMethod);
  }

  return query;
}

function loadSalepointFromParamsMiddleware(req, res, next) {
  const salepointId = req.params.id;
  if (!ObjectId.isValid(salepointId)) {
    return salepointNotFound(res, salepointId)
  }

  Salepoint.findById(req.params.id, function (err, salepoint) {
    if (err) {
      return next(err);
    } else if (!salepoint) {
      return salepointNotFound(res, salepointId);
    }

    req.salepoint = salepoint;
    next();
  })
}

function salepointNotFound(res, salepointId) {
  return res.status(404).type('text').send(`No salepoint found with ID ${salepointId}`)
}

function checkOwnerOrAdmin(req, res, next) {
  const autho = req.currentUserPermissions === 'admin' || req.salepoint.userId === req.currentUserId;
  if (!autho) {
    return res.status(403).send('Insufficient permissions')
  }
  next();
}

module.exports = router;
