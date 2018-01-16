'use strict'

const mongoose = require('mongoose')
require('../app_server/models/locations')
const dbURI = 'mongodb://localhost/loc8r';
const LocationModel = mongoose.model('Location')

function main() {

	mongoose.connect(dbURI, {useMongoClient: true});

	let location = LocationModel
	location.deleteMany({}, (err) => {
		if (err) {
			console.log('>>>ERROR: Deleting Many: ${err.errmsg}')
			return
		} //else

		console.log('>D SUCCESS - Deleting Many')
	})


	setTimeout(() => {
		mongoose.connection.close(() => {
			console.log('Mongoose Disconnected')
		})
	}, 5000)

}

main()
