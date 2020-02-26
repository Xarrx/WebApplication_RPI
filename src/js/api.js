/*
  Module Description:
    Route which handles getting/setting the color of the LED strip.

  Modules to use:

  axios:
    Handle json requests for getting/setting data on jsonstore.

  pigpio:
    Handles GPIO operations.
*/
/* import modules */
var axios = require('axios');
//var gpio = require('pigpio');
require('dotenv').config();

function gethandler(req, res){
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
    console.log('DEBUG: Body contains key \'action\'');
    // handle request based on content of action...
    if(action === 'getColor'){
      // return the current color
      /*
        code to pull the current color value from jsonstore.io goes here
      */
      status = 200;
      resp = {message: 'Unimplemented action getColor'};
      
    }else if(action === 'getPowerState'){
      // return the current power state
      /*
        code to pull the current power state from jsonstore.io goes here
      */
      status = 200;
      resp = {message: 'Unimplemented action getPowerState'};
    }else if(action === 'getColors'){
      // return a list of all saved colors
      /*
        code to pull a list of all saved colors from jsonstore.io goes here
      */
      status = 200;
      resp = {message: 'Unimplemented action getColors'};
    }else{
      // invalid action string, respond with error
      status = 500;
      resp = {message: 'Received invalid action string.'};
    }
  }else{
    // body does not have action key, respond with error
    status = 500;
    console.log(req.body);
    resp = {message: 'No action string received.'};
  }

  // send json response
  res.status(status).json(resp);
}

function posthandler(req, res){
   /*
    handle different requests that wil come to the api route (GET).
  */
  // create variables
  let body = req.body;
  let resp = {};
  let status = 200;
  let action = '';
  // check contents of the request body (json expected)
  if(Object.prototype.hasOwnProperty(body, 'action')){
    // body has action key, assign to action variable
    action = body['action'];
  }else{
    // body does not have action key, respond with error
    status = 500;
    resp = {message: 'No action string received.'};
  }
}
module.exports = { get_handler:  gethandler, post_handler: posthandler};