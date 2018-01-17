'use strict'

const mongoose = require('mongoose')
const Location = mongoose.model('Location')

const MILES_TO_METERS = 1609.34
const METERS_TO_MILES = 0.000621371

function dev_SuccessResponse(res) {
	res.status(200)
	res.json(JSON.stringify({status: "SUCCESS"}))
}

function geoNearResultsToLocations(results) {
	let locations = []
	results.forEach((doc) => {
		locations.push({
			distance: doc.dis * METERS_TO_MILES,
			name: doc.obj.name,
			address: doc.obj.address,
			rating: doc.obj.rating,
			facilities: doc.obj.facilities,
			_id: doc.obj._id
		})
	})

	return locations
}

var theEarth = (function() {
	const earthRadius = 6371

	const getDistanceFromRads = (rads) => {
		return parseFloat(rads * earthRadius)
	}

	const getRadsFromDistance = (distance) => {
		return parseFloat(distance / earthRadius)
	}

	return {
		getDistanceFromRads : getDistanceFromRads,
		getRadsFromDistance : getRadsFromDistance
	}

})()

const locationsController = {

	locationsListAll: (req, res) => {
		Location.find().exec((err, locations) => {
			if (err) {
				res.status(500)
				res.json({'status':'error', 'message' : err.errmsg })
				return
			} //else

			console.log(locations)

			res.status(200)
			res.json(locations)

		})
	},

	locationsListByDistance: (req, res) => {

		let lat = null
		let lng = null
		let maxDistInMiles = null

		let nullTheNaN = (value) => { return value === NaN ? null : value }

		if (req.query && req.query.lat && req.query.lng) {
			lat = nullTheNaN(parseFloat(req.query.lat))
			lng = nullTheNaN(parseFloat(req.query.lng))
		}

		if (lat === null || lng === null) {
			res.status(400)
			res.json({
				'status' : 'error',
				'message' : 'missing lat and/or lng query parameters'
			})
			return
		}

		if (req.query && req.query.maxDist) {
			maxDistInMiles = nullTheNaN(parseFloat(req.query.maxDist))
		}

		if (maxDistInMiles === null) {
			maxDistInMiles = 20
		}



		console.log('Request Query:')
		console.dir(req.query)

		const point = {
			type: "Point",
			coordinates: [lng, lat]
		}

		let maxDistInMeters = maxDistInMiles * MILES_TO_METERS
		console.dir(point)
		const geoOptions = {
			spherical: true,
			num: 10,
			maxDistance: maxDistInMeters
		}

		Location.geoNear(point, geoOptions, (err, results, stats) => {
			if (err) {
				console.log('>>>ERROR: ' + err)
				res.status(500)
				res.json({ 'status' : 'ERROR', 'message' : err.toString() })
				return
			} //else

			console.log(`results (${results.length}):`)
			console.dir(results)

			let locations = geoNearResultsToLocations(results)

			res.status(200)
			res.json(locations)
		})

	},

	locationsCreate: (req, res) => {
		dev_SuccessResponse(res)
	},

	locationsReadOne: (req, res) => {
		let locationId = null
		if (req.params && req.params.locationId) {
			locationId = req.params.locationId
		}
		if (!locationId) {
			res.status(404)
			res.json({'status': 'error', 'message' : 'No locationId params in request.'})
			return
		} //else


		Location.findById(locationId).exec((err, location) => {
			if(err) {
				console.log(`!!!ERROR finding location with id: ${locationId}.\t\n${err}`)
				res.status(500)
				res.json({'status': 'error', 'message' : err.toString()})
				return
			} //else

			if(!location) {
				console.log(`!!!No location found with idlocation with id: ${locationId}.\t\n${err}`)
				res.status(404)
				res.json({'status': 'Not Found', 'message' : `No location with id: ${locationId}`})
				return
			} //else

			console.log(`Found Location using ID: ${locationId}`)
			console.log(location)

			res.status(200)
			res.json(location)

		})
	},

	locationsUpdateOne: (req, res) => {
		dev_SuccessResponse(res)
	},

	locationsDeleteOne: (req, res) => {
		dev_SuccessResponse(res)
	}
}

module.exports = locationsController
