'use strict'

const faker = require('faker')




function main() {

	for(var i = 0; i < 5; ++i) {
		let randomLocation = createRandomLocation()
		console.dir(randomLocation)
		console.log('')
	}

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
