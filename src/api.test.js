/*
	Jest tests for api.js
  
	Mocks:
	 - Need to create fake request and response objects for passing to the api 
	   function.
	 - Need to create a mock for axios (for when jsonstore.io is implemented).
	 - Need to create a mock for alias.js module.
	 
	Notes:
     - The for api, the expected structure of the data object is:
	[
		{
			alias: <alias>,
			operation: <read, write, etc.>,
			[value: <value>],
		},
		...
	]
*/
'use strict';
const api = require('./api');

// response object mock
const mockJson = jest.fn((x) => {return;});
const mockStatus = jest.fn((x) => {return {json: mockJson};});
const res = {status: mockStatus};

// tests
description('api Tests', () = {
  test('Test failure on non-list (not iterable) body.', () => {
    // api function input
    const req = {
      body: {}
    };
    // run api with constructed arguments
    api(req, res);
    
    // test output for expected behavior
    expect(mockStatus.mock.calls.length).toBe(1);
    expect(mockStatus.mock.calls[0][0]).toBe(500);
    expect(mockJson.mock.calls.length).toBe(1);
    expect(mockJson).toBeCalledWith(expect.objectContaining({
      message: 'Failed to validate request body.'
    }));
  });
});