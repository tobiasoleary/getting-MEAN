'use strict'

const faker = require('faker')
const mongoose = require('mongoose')
require('../app_server/models/locations')
const dbURI = 'mongodb://localhost/loc8r';
const Location = mongoose.model('Location')

function main() {

	let locationsToCreate = []
	for(var i = 0; i < 5; ++i) {
		locationsToCreate.push(createRandomLocation())
	}

	mongoose.connect(dbURI, {useMongoClient: true});



	locationsToCreate.forEach((item) => {

		let newLocation = new Location(item)
		console.dir(newLocation)
		console.log('')
		newLocation.save((err) => {
			if (err) {
				console.log('!!!Error Saving Location: ' + err.errmsg)
			} else {
				console.log(`Saved Location: ${item.name}`)
			}
		})
	})

	setTimeout(() => {
		mongoose.connection.close(() => {
			console.log('Mongoose Disconnected')
		})
	}, 5000)

}

function createRandomReview() {
	let author = faker.name.findName()
	let rating = faker.random.number({min: 1, max: 5})
	let reviewText = faker.lorem.paragraph()
	let createdOn = faker.date.past(2)

	return {
		author: author,
		rating: rating,
		reviewText: reviewText,
		createdOn: createdOn
	}
}

function createRandomOpeningTimes() {

	let closedMondays = faker.random.boolean
	let closedSundays = faker.random.boolean

	let weekdayOpening = `${faker.random.number({min:5, max:9})}:00 AM`
	let weekendOpening = `${faker.random.number({min:6, max:10})}:30 AM`
	let weekdayClosing = `${faker.random.number({min:6, max:11})}:30 PM`
	let weekendClosing = `${faker.random.number({min:5, max:9})}:00 PM`


	let openingTimes = []
	if (closedMondays) {
		openingTimes.push({
			days: 'M',
			closed: true
		})
		openingTimes.push({
			days: 'T-F',
			closed: false,
			opening: weekdayOpening,
			closing: weekdayClosing
		})
	} else {
		openingTimes.push({
			days: 'Weekdays',
			closed: false,
			opening: weekdayOpening,
			closing: weekdayClosing
		})
	}

	if(closedSundays) {
		openingTimes.push({
			days: 'Saturday',
			closed: false,
			opening: weekendOpening,
			closing: weekendClosing
		})

		openingTimes.push({
			days: 'Sunday',
			closed: true
		})
	} else {
		openingTimes.push({
			days: 'Weekends',
			closed: false,
			opening: weekendOpening,
			closing: weekendClosing
		})
	}

	return openingTimes
}

function createRandomLocation() {
	let openingTimes = createRandomOpeningTimes()
	let reviews = []
	let reviewCount = faker.random.number(5)
	for(var i = 0; i < reviewCount; ++i) {
		reviews.push(createRandomReview())
	}

	let address = `${faker.address.streetAddress()}\n${faker.address.city()}, ${faker.address.stateAbbr()}\n${faker.address.zipCode()}`

	const possibleFacilities = ['Hot Drinks', 'Cold Drinks', 'Beer & Wine', 'Sandwiches', 'Pastries', 'Breakfast', 'Lunch', 'Lots of Seating', 'Workspace', 'Charging Areas']

	let facilities = ['Wi-Fi']
	faker.helpers.shuffle(possibleFacilities).slice(faker.random.number(possibleFacilities.length)).forEach((element) => {
		facilities.push(element)
	})

	return {
		name: faker.company.companyName(0) + ' Coffee',
		address: address,
		facilities: facilities,
		coords: [faker.address.longitude(), faker.address.latitude()],
		openingTimes: openingTimes,
		reviews: reviews
	}

}

main()
