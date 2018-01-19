'use strict'

const request = require('request')
const apiOptions = {
  server : 'http://localhost:3000'
}

const _formatDistance = function(distance) {
  let numDistance = parseFloat(distance).toFixed(2)
  let unit = 'mi.'

  return numDistance + ' ' + unit
}


const renderHomePage = function(req, res, responseBody) {
  let message = ''
  if(!(responseBody instanceof Array)) {
    message = "API Lookup Error"
    responseBody = []
  } else if (!responseBody.length) {
    message = "No places found nearby"
  }

  res.render('locations-list', {
      title: 'Loc8r - find a place to work with wifi',
      pageHeader: {
          title: 'Loc8r',
          strapline: 'Find places to work with wifi near you!'
      },
      sidebar: "Looking for wifi and a seat? Loc8r helps you find places to work when out and about. Perhaps with coffee, cake or a pint? Let Loc8r help you find the place you're looking for.",
      locations: responseBody,
      message: message
  })
}


/* GET 'home' page */
module.exports.homelist = function(req, res) {
  const apiPath = '/api/locations'
  const requestOptions = {
    url: apiOptions.server + apiPath,
    method: 'GET',
    json: {},
    qs : {
      lng : -86.779633,
      lat : 33.543682,
      maxDistance: 20
    }
  }

  request(requestOptions, (err, response, body) => {

    let data = body
    if (response.statusCode === 200) {
      data.forEach( (element) => {
        element.distance = _formatDistance(element.distance)
      })
    }


    renderHomePage(req, res, data)
  })
}

let renderLocationInfo = (req, res, responseBody) => {
  
}

/* GET 'Location info' page */
module.exports.locationInfo = function(req, res) {
  let locationId = req.params.locationId


  res.render('location-info', {
      title: 'Starcups',
      pageHeader: {
          title: 'Starcups'
      },
      sidebar: {
          context: 'is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.',
          callToAction: 'If you\'ve been and you like it - or if you don\'t - please leave a review to help other people just like you.'
      },
      location: {
          name: 'Starcups',
          address: '125 High Street, Reading, RG6 1PS',
          rating: 3,
          facilities: ['Hot drinks', 'Food', 'Premium wifi'],
          coords: {
              lat: 51.455041,
              lng: -0.9690884
          },
          openingTimes: [{
              days: 'Monday - Friday',
              opening: '7:00am',
              closing: '7:00pm',
              closed: false
          }, {
              days: 'Saturday',
              opening: '8:00am',
              closing: '5:00pm',
              closed: false
          }, {
              days: 'Sunday',
              closed: true
          }],
          reviews: [{
              author: 'Simon Holmes',
              rating: 5,
              timestamp: '16 July 2013',
              reviewText: 'What a great place. I can\'t say enough good things about it.'
          }, {
              author: 'Charlie Chaplin',
              rating: 3,
              timestamp: '16 June 2013',
              reviewText: 'It was okay. Coffee wasn\'t great, but the wifi was fast.'
          }]
      }
  });
};

/* GET 'Add review' page */
module.exports.addReview = function(req, res) {
    res.render('location-review-form', {
        title: 'Review Starcups on Loc8r',
        pageHeader: {
            title: 'Review Starcups'
        }
    });
};
