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
  
  /*
	Need to handle requests to change specific GPIO pins. Those pins need to 
	be in the alias file AND the operation requested by the client needs to be
	in the list of allowed operations for that pin.
	
	So for each pin included in the request body, we need to check:
	 - that the requested alias is included in the server side alias.js file
	 - that the requested operation is included in the server side alias.js file
	 - if the operation is a valid write, we need to check:
	  * that the requested value validates via the alias' validate function
	  * ...
	 - if the operation is a valid read, we need to check:
	  * ...
	  
	Before that can be done, we need to make sure that the request body contains
	valid request information...
	
  */
  
  

  // send json response
  res.status(status).json(resp);
};