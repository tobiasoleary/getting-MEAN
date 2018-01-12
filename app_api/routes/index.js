'use strict'

const express = require('express')
const router = express.Router()
const locationsController = require('../controllers/locations')
const reviewsController = require('../controllers/reviews')


/////////////////////////
// Routes for Locations

router.get('/locations', locationsController.locationsListByDistance)
router.post('/locations', locationsController.locationsCreate)
router.get('/locations/:locationId', locationsController.locationsReadOne)
router.put('/locations/:locationId', locationsController.locationsUpdateOne)
router.delete('/llcations/:locationId', locationsController.locationsDeleteOne)


///////////////////////////
// Routes for reviews

router.post('/locations/:locationId/reviews', reviewsController.reviewsCreate)
router.get('/locations/:locationId/reviews/:reviewId', reviewsController.reviewsReadOne)
router.put('/locations/:locationId/reviews/:reviewId', reviewsController.reviewsUpdateOne)
router.delete('/locations/:locationId/reviews/:reviewId', reviewsController.reviewsDeleteOne)

module.exports = router
