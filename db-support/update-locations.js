'use strict'

const mongoose = require('mongoose')
require('../app_server/models/locations')
const dbURI = 'mongodb://localhost/loc8r';
const LocationModel = mongoose.model('Location')


function main() {

	mongoose.connect(dbURI, {useMongoClient: true});

	let allLocations = []
	const processLocation = (index) => {
		if (index >= allLocations.length) {
			return
		} //else

		let location = allLocations[index]
		if (location.reviews.length < 1) {
			location.rating = 0
		} else {
			let ratingSum = 0
			location.reviews.forEach((review) => {
				ratingSum = review.rating
			})
			location.rating = parseInt(ratingSum / location.reviews.length, 10)
		}

		location.save((err, location) => {
			if (err) {
				console.log('Error Saving Location: ')
				console.dir(err)
			}
			console.log(`Updated Rating for ${location.name} to ${location.rating}`)
			processLocation(index+1)
		})

	}

	LocationModel
	.find()
	.exec((err, foundLocations) => {
		allLocations = foundLocations
		processLocation(0)
	})

	setTimeout(() => {
		mongoose.connection.close(() => {
			console.log('Mongoose Disconnected')
		})
	}, 5000)


}

main()
