'use strict'

const mongoose = require('mongoose')
const LocationModel = mongoose.model('Location')

function dev_SuccessResponse(res) {
	res.status(200)
	res.json(
		JSON.stringify({status: 'SUCCESS'})
	)
}

function setAverageRating(location) {
	if (location.reviews.length < 1) {
		return
	}

	let ratingSum	= 0
	location.reviews.forEach((element) => {
		ratingSum += element.rating
	})
	location.rating = parseInt(ratingSum / location.reviews.length, 10)
	location.save((err) => {
		if(err) {
			console.log("setAverageRating location.save error: ")
			console.dir(err)
			return
		} //else

		console.log(`Average Rating of ${location.name} updated to ${location.rating}`)
	})
}

function updateAverageRating(locationId) {
	LocationModel
	.findById(locationId)
	.select('name rating reviews')
	.exec((err, location) => {
		if(!err) {
			setAverageRating(location)
		}
	})
}

function addReview(req, res, location) {
	if (!location) {
		res.status(404)
		res.json({'message' : `Location with locationId (${req.params.locationId}) not found.`})
		return
	} //else

	console.log('Adding Review')
	console.dir(req)
	console.dir(req.headers)

	let reviewToAdd = {
		author: req.body.author,
		rating: req.body.rating,
		reviewText: req.body.reviewText
	}

	location.reviews.push(reviewToAdd)

	location.save((err, location) => {
		if (err) {
			console.log('Add Review Error Saving Location')
			console.dir(err)
			res.status(400)
			res.json(err)
			return
		} //else

		updateAverageRating(location._id)
		const newReview = location.reviews[location.reviews.length - 1]
		res.status(201)
		res.json(newReview)
	})
}

const reviewsController = {

	reviewsCreate: (req, res) => {
		let locationId = req.params.locationId
		if (!locationId) {
			res.status(404)
			res.json({'message' : 'Not Found, locationid required.'})
			return
		} //else

		LocationModel
		.findById(locationId)
		.select('reviews')
		.exec((err, location) => {
			if(err) {
				res.status(400)
				res.json(err)
				return
			} //else
			addReview(req, res, location)
		})
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
		if (!req.params.locationId || !req.params.reviewId) {
			res.status(404)
			res.json({'message' : 'Missing URL Params both locationId and reviewId are required.'})
			return
		} //else

		LocationModel
		.findById(req.params.locationId)
		.select('reviews')
		.exec((err, location) => {
			if (!location) {
				res.status(404)
				res.json({'message' : `Location with Id (${req.params.locationId}) not found.`})
			} //else

			if (err) {
				console.log('reviewsUpdateOne - LocationModel.findById error:')
				console.dir(err)
				res.status(400)
				res.json(err)
				return
			} //else

			let reviewToUpdate = location.reviews.id(req.params.reviewId)
			if (!reviewToUpdate) {
				res.status(404)
				res.json({'message' : `Review with Id (${req.params.reviewId}) not found.`})
				return
			} //else

			reviewToUpdate.author = req.body.author
			reviewToUpdate.rating = req.body.rating
			reviewToUpdate.reviewText = req.body.reviewText

			location.save((err, location) => {
				if (err) {
					console.log('Update Review Error Saving Location')
					console.dir(err)
					res.status(400)
					res.json(err)
					return
				} //else

				updateAverageRating(location._id)
				const newReview = location.reviews[location.reviews.length - 1]
				res.status(200)
				res.json(reviewToUpdate)
			})
		})
	},

	reviewsDeleteOne: (req, res) => {
		if(!req.params.locationId || !req.params.reviewId) {
			res.status(404)
			res.json({'message' : 'Missing URL Parameters - Expecting locationId and reviewId'})
			return
		} //else

		LocationModel
		.findById(req.params.locationId)
		.select('name reviews rating')
		.exec((err, location) => {
			if (!location) {
				res.status(404)
				res.json({'message' : `Location with Id (${req.params.locationId}) not found.`})
				return
			} //else

			if (err) {
				console.log('reviewsDeleteOne - Error Location.findById:')
				console.dir(err)

				res.status(404)
				res.json(err)
				return
			} //else

			let reviewToDelete = location.reviews.id(req.params.reviewId)
			if(!reviewToDelete) {
				res.status(404)
				res.json({'message' : `Review with Id (${req.params.reviewId}) not found.`})
				return
			} //else

			reviewToDelete.remove()

			location.save((err, location) => {
				if (err) {
					console.log('reviewDeleteOne Error Saving Location')
					console.dir(err)
					res.status(400)
					res.json(err)
					return
				} //else

				updateAverageRating(location._id)
				res.status(204)
				res.json(null)
			})
		})

	}
}

module.exports = reviewsController
