/*
  Module Description:
    Route which handles getting/setting the color of the LED strip.

  Modules to use:

  axios:
    Handle json requests for getting/setting data on jsonstore.

  pigpio:
    Handles GPIO operations.
*/
'use strict';
require('dotenv').config();
const axios = require('axios');
const alias = require('./alias.js');
//const gpio = require('pigpio');

module.exports = function(req, res){
  /*
    handle different requests that wil come to the api route (GET).
  */
  // create variables
  let body = req.body;
  let resp = {};
  let status = 200;
  let action = '';
  
  // check contents of the request body (json expected)
  if(body.hasOwnProperty('action')){
    // body has action key, assign to action variable
    action = body['action'];
    //console.log('DEBUG: Body contains key \'action\'');
	
    // handle request based on content of action...
	if(action === 'setColor'){
		/*
			Do set color and update jsonstore.io
		*/
		status = 200;
		response = {message: 'Unimplemented action: \'setColor\'.'};
	}else if(action === 'setPowerState'){
		/*
			Do power state toggle and update jsonstore.io
		*/
		status = 200;
		response = {message: 'Unimplemented action: \'setPowerState\'.'};
	}else{
		status = 500;
		response = {message: 'Invalid action string received.'}
	}
  }else{
    // body does not have action key, respond with error
    status = 500;
    console.log(req.body);
    resp = {message: 'No action string received.'};
  }

  // send json response
  res.status(status).json(resp);
};