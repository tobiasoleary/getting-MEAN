'use strict'

const mongoose = require('mongoose')
const Location = mongoose.model('Location')

function dev_SuccessResponse(res) {
	res.status(200)
	res.json(JSON.stringify({status: "SUCCESS"}))
}

const locationsController = {

	locationsListByDistance: (req, res) => {
		dev_SuccessResponse(res)
	},

	locationsCreate: (req, res) => {
		dev_SuccessResponse(res)
	},

	locationsReadOne: (req, res) => {
		let locationId = req.params.locationId

		Location.findById(locationId).exec((err, location) => {
			if(err) {
				console.log(`!!!ERROR finding location with id: ${locationId}.\t\n${err}`)
				res.status(500)
				res.json({'status': 'error'})
			} else {
				console.log(`Found Location using ID: ${locationId}`)
				console.log(location)

				res.status(200)
				res.json(location)
			}
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
