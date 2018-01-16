'use strict'

const mongoose = require('mongoose')
const LocationModel = mongoose.model('Location')

function dev_SuccessResponse(res) {
	res.status(200)
	res.json(
		JSON.stringify({status: 'SUCCESS'})
	)
}

const reviewsController = {

	reviewsCreate: (req, res) => {
		dev_SuccessResponse(res)
	},

	reviewsReadOne: (req, res) => {
		let locationId = null
		let reviewId = null

		if (req.params && req.params.locationId && req.params.reviewId) {
			locationId = req.params.locationId
			reviewId = req.params.reviewId
		}

		if (locationId === null || reviewId === null) {
			res.status('404')
			res.json({ 'status' : 'Not Found', 'message' : 'Missing parameter locationId or reviewId.'})
			return
		} //else


		let handleMissingLocation = (res, err, location) => {
			if(err) {
				console.log(`!!!ERROR finding location with id: ${locationId}.\t\n${err}`)
				res.status(500)
				res.json({'status': 'error', 'message' : err.toString()})
				return
			} //else

			if(!location) {
				console.log(`!!!No location found with id: ${locationId}.\t\n${err}`)
				res.status(404)
				res.json({'status': 'Not Found', 'message' : `No location with id: ${locationId}`})
				return
			} //else
		}

		let handleMissingReview = (res, location, reviewId) => {
			console.log(`!!!No Review with id: ${reviewId}, found on location: ${location}`)
			res.status(404)
			res.json({'status' : 'Not Found', 'message' : `No review found with id: ${reviewId}`})
			return
		}

		LocationModel
			.findById(locationId)
			.select('name reviews')
			.exec((err, location)=> {
				if(err || !location) {
					handleMissingLocation(res, err, location)
					return
				}

				let review = null
				if (location.reviews && location.reviews.length > 0) {
					review = location.reviews.id(reviewId)
				}

				if (!review) {
					handleMissingReview(res, location, reviewId)
					return
				} //else

				res.status(200)
				res.json(review)
			})

	},

	reviewsUpdateOne: (req, res) => {
		dev_SuccessResponse(res)
	},

	reviewsDeleteOne: (req, res) => {
		dev_SuccessResponse(res)
	}
}

module.exports = reviewsController
