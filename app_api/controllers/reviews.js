'use strict'

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
		dev_SuccessResponse(res)
	},

	reviewsUpdateOne: (req, res) => {
		dev_SuccessResponse(res)
	},

	reviewsDeleteOne: (req, res) => {
		dev_SuccessResponse(res)
	}
}

module.exports = reviewsController
