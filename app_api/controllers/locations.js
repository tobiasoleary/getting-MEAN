'use strict'

function dev_SuccessResponse(res) {
	res.status(200)
	res.json(JSON.stringify({status: "SUCCESS"}))
}

const locationsController = {

	locationsListByDistance: (req, res) => {
		tmpSuccessResponse(res)
	},

	locationsCreate: (req, res) => {
		tmpSuccessResponse(res)
	},

	locationsReadOne: (req, res) => {
		tmpSuccessResponse(res)
	},

	locationsUpdateOne: (req, res) => {
		tmpSuccessResponse(res)
	},

	locationsDeleteOne: (req, res) => {
		tmpSuccessResponse(res)
	}
}

module.exports = locationsController
