/*
  Module Description:
    [OLD] Route which handles getting/setting the color of the LED strip.

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
//const Gpio = require('pigpio');

module.exports = function(req, res){
  /*
    handle different requests that wil come to the api route.
  */

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
	
  Expected structure of body:
  
  [
    {
      alias: <alias>,
      operation: <read, write, etc.>,
      [value: <value>],
    },
    ...
  ]
  */
  
  // create variables
  let resp = {};
  let status = 200;
  let queue = [];
  
  // make sure that req.body is iterable
  if(Symbol.iterator in req.body){
    // Iterate over all objects in the body object
    if(req.body.length){
        for(let a of req.body){
        // check that a has an alias property and that it is in the alias module
        if(a.hasOwnProperty('alias') && alias.hasOwnProperty(a.alias)){
          let als = alias[a.alias];
          // validate the operation and ensure that it is allowed
          if(a.hasOwnProperty('operation') 
          && als.hasOwnProperty('allowed_operations')
          && als.allowed_operations.includes(a.operation)){
            // check if operation is digitalWrite
            if(a.operation === 'digitalWrite' ||
            a.operation === 'pwmWrite'){
              // operation is digitalWrite, validate the value
              if(a.hasOwnProperty('value') && als.hasOwnProperty('validate')
              && typeof als.validate === 'function'
              && als.validate(a.value)){
                // requested operation has validated, add it to the queue
                queue.push({
                  pin: als.pin,
                  operation: a.operation,
                  value: a.value
                });
              }else{
                // set status/message and break out of loop
                status = 500;
                resp = {message: 'Failed to validate alias\' value.'};
                break;
              }
            }else{
              // operation is something other than digitalWrite so no value to validate
              queue.push({
                pin: als.pin,
                operation: a.operation,
              });
            }
          }else{
            // set status/message and break out of loop
            status = 500;
            resp = {message: 'Failed to validate alias\' operation.'};
            break;
          }
        }else{
          // set status/message and break out of loop
          status = 500;
          resp = {message: 'Failed to validate alias.'};
          break;
        }
      }
    }else{
      // set status/message and break out of loop
      status = 500;
      resp = {message: 'Aborted validation due to empty body.'};
    }
    
  }else{
    // set status/message and break out of loop
    status = 500;
    resp = {message: 'Failed to validate request body.'};
  }
  

  // if nothing failed, apply the operations
  if(status === 200){
    /*
      do pin operations with pigpio
    */
    while(queue.length){
      let a = queue.pop();
      if(a.operation === 'digitalWrite'){
        // digitalWrite value to pin
        let message = 'MESSAGE: [PH] Value written to pin!';
        console.log(message);
        resp = {message: message};
      }else if(a.operation === 'pwmWrite'){
        let message = 'MESSAGE: [PH] Value written to pin!'
        console.log(message);
        resp = {message: message};
      }else if(a.operation === 'read'){
        // read value from pin and modify resp
        let message = 'MESSAGE: [PH] Value read from pin!';
        console.log(message);
        resp = {message: message};
      }else{
        let message = 'MESSAGE: [PH] This message should never print...';
        console.log(message);
        resp = {message: message};
      }
    }
  }
  // send json response
  res.status(status).json(resp);
};