/*
	Jest tests for api.js
  
	Mocks:
	 - Need to create fake request and response objects for passing to the api 
	   function.
	 - Need to create a mock for axios (for when jsonstore.io is implemented).
	 - Need to create a mock for alias.js module.
   - Need to create a mock for pigpio module.
	 
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
//jest.mock('./alias');
// response object mock
const mockJson = jest.fn((x) => {return;});
const mockStatus = jest.fn((x) => {return {json: mockJson};});
const res = {status: mockStatus};

// reset the mock functions after each test run
afterEach(() => {
  mockJson.mockClear();
  mockStatus.mockClear();
});

describe('Test that api fails when expected.', () => {
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
    /*
      when pigpio is added, need to create mock of it and add
      checks to make sure the it is not called on failure.
    */
  });
  test('Test failure on empty iterable body.', () => {
    // api function input
    const req = {
      body: []
    };
    // run api with the costructed arguments
    api(req, res);

    // test output for expected behavior
    expect(mockStatus.mock.calls.length).toBe(1);
    expect(mockStatus.mock.calls[0][0]).toBe(500);
    expect(mockJson.mock.calls.length).toBe(1);
    expect(mockJson).toBeCalledWith(expect.objectContaining({
      message: 'Aborted validation due to empty body.'
    }));
  });
  test('Test failure when object in body list is missing alias property (only 1)', () => {
    // api function input
    const req = {
      body: [
        {
          operation: 'write',
          value: 0
        }
      ]
    };
    // run api with the costructed arguments
    api(req, res);

    // test output for expected behavior
    expect(mockStatus.mock.calls.length).toBe(1);
    expect(mockStatus.mock.calls[0][0]).toBe(500);
    expect(mockJson.mock.calls.length).toBe(1);
    expect(mockJson).toBeCalledWith(expect.objectContaining({
      message: 'Failed to validate alias.'
    }));
  });
  test('Test failure when object in body list is missing alias property (1 good before)', () => {
    // api function input
    const req = {
      body: [
        {
          alias: 'red_pin',
          operation: 'write',
          value: 0
        },
        {
          operation: 'write',
          value: 0
        }
      ]
    };
    // run api with the costructed arguments
    api(req, res);

    // test output for expected behavior
    expect(mockStatus.mock.calls.length).toBe(1);
    expect(mockStatus.mock.calls[0][0]).toBe(500);
    expect(mockJson.mock.calls.length).toBe(1);
    expect(mockJson).toBeCalledWith(expect.objectContaining({
      message: 'Failed to validate alias.'
    }));
  });
  test('Test failure when object in body list is missing alias property (2 good before)', () => {
    // api function input
    const req = {
      body: [
        {
          alias: 'green_pin',
          operation: 'write',
          value: 0
        },
        {
          alias: 'red_pin',
          operation: 'write',
          value: 0
        },
        {
          operation: 'write',
          value: 0
        }
      ]
    };
    // run api with the costructed arguments
    api(req, res);

    // test output for expected behavior
    expect(mockStatus.mock.calls.length).toBe(1);
    expect(mockStatus.mock.calls[0][0]).toBe(500);
    expect(mockJson.mock.calls.length).toBe(1);
    expect(mockJson).toBeCalledWith(expect.objectContaining({
      message: 'Failed to validate alias.'
    }));
  });
  test('Test failure when object in body list is missing alias property (1 bad before)', () => {
    // api function input
    const req = {
      body: [
        {
          operation: 'write',
          value: 0
        },
        {
          alias: 'green_pin',
          operation: 'write',
          value: 0
        },
        {
          alias: 'red_pin',
          operation: 'write',
          value: 0
        }
      ]
    };
    // run api with the costructed arguments
    api(req, res);

    // test output for expected behavior
    expect(mockStatus.mock.calls.length).toBe(1);
    expect(mockStatus.mock.calls[0][0]).toBe(500);
    expect(mockJson.mock.calls.length).toBe(1);
    expect(mockJson).toBeCalledWith(expect.objectContaining({
      message: 'Failed to validate alias.'
    }));
  });



  test('Test failure when object in body has invalid alias(only 1)', () => {
    // api function input
    const req = {
      body: [
        {
          alias: 'sadfsadf',
          operation: 'write',
          value: 0
        }
      ]
    };
    // run api with the costructed arguments
    api(req, res);

    // test output for expected behavior
    expect(mockStatus.mock.calls.length).toBe(1);
    expect(mockStatus.mock.calls[0][0]).toBe(500);
    expect(mockJson.mock.calls.length).toBe(1);
    expect(mockJson).toBeCalledWith(expect.objectContaining({
      message: 'Failed to validate alias.'
    }));
  });
  test('Test failure when object in body list has invalid alias(1 good before)', () => {
    // api function input
    const req = {
      body: [
        {
          alias: 'red_pin',
          operation: 'write',
          value: 0
        },
        {
          alias: 'sadfsadf',
          operation: 'write',
          value: 0
        }
      ]
    };
    // run api with the costructed arguments
    api(req, res);

    // test output for expected behavior
    expect(mockStatus.mock.calls.length).toBe(1);
    expect(mockStatus.mock.calls[0][0]).toBe(500);
    expect(mockJson.mock.calls.length).toBe(1);
    expect(mockJson).toBeCalledWith(expect.objectContaining({
      message: 'Failed to validate alias.'
    }));
  });
  test('Test failure when object in body list has invalid alias(2 good before)', () => {
    // api function input
    const req = {
      body: [
        {
          alias: 'green_pin',
          operation: 'write',
          value: 0
        },
        {
          alias: 'red_pin',
          operation: 'write',
          value: 0
        },
        {
          alias: 'sadfsadf',
          operation: 'write',
          value: 0
        }
      ]
    };
    // run api with the costructed arguments
    api(req, res);

    // test output for expected behavior
    expect(mockStatus.mock.calls.length).toBe(1);
    expect(mockStatus.mock.calls[0][0]).toBe(500);
    expect(mockJson.mock.calls.length).toBe(1);
    expect(mockJson).toBeCalledWith(expect.objectContaining({
      message: 'Failed to validate alias.'
    }));
  });
  test('Test failure when object in body list has invalid alias(1 bad before)', () => {
    // api function input
    const req = {
      body: [
        {
          alias: 'sadfsadf',
          operation: 'write',
          value: 0
        },
        {
          alias: 'green_pin',
          operation: 'write',
          value: 0
        },
        {
          alias: 'red_pin',
          operation: 'write',
          value: 0
        }
      ]
    };
    // run api with the costructed arguments
    api(req, res);

    // test output for expected behavior
    expect(mockStatus.mock.calls.length).toBe(1);
    expect(mockStatus.mock.calls[0][0]).toBe(500);
    expect(mockJson.mock.calls.length).toBe(1);
    expect(mockJson).toBeCalledWith(expect.objectContaining({
      message: 'Failed to validate alias.'
    }));
  });

  test('Test failure when object in body list has no operation (only 1).', () => {
    // api function input
    const req = {
      body: [
        {
          alias: 'red_pin',
          value: 0
        }
      ]
    };
    // run api with the costructed arguments
    api(req, res);

    // test output for expected behavior
    expect(mockStatus.mock.calls.length).toBe(1);
    expect(mockStatus.mock.calls[0][0]).toBe(500);
    expect(mockJson.mock.calls.length).toBe(1);
    expect(mockJson).toBeCalledWith(expect.objectContaining({
      message: 'Failed to validate alias\' operation.'
    }));
  });
  test('Test failure when object in body list has no operation (1 good before).', () => {
    // api function input
    const req = {
      body: [
        {
          alias: 'green_pin',
          operation: 'write',
          value: 255
        },
        {
          alias: 'red_pin',
          value: 0
        }
      ]
    };
    // run api with the costructed arguments
    api(req, res);

    // test output for expected behavior
    expect(mockStatus.mock.calls.length).toBe(1);
    expect(mockStatus.mock.calls[0][0]).toBe(500);
    expect(mockJson.mock.calls.length).toBe(1);
    expect(mockJson).toBeCalledWith(expect.objectContaining({
      message: 'Failed to validate alias\' operation.'
    }));
  });
  test('Test failure when object in body list has no operation (2 good before).', () => {
    // api function input
    const req = {
      body: [
        {
          alias: 'blue_pin',
          operation: 'write',
          value: 255
        },
        {
          alias: 'green_pin',
          operation: 'write',
          value: 255
        },
        {
          alias: 'red_pin',
          value: 0
        }
      ]
    };
    // run api with the costructed arguments
    api(req, res);

    // test output for expected behavior
    expect(mockStatus.mock.calls.length).toBe(1);
    expect(mockStatus.mock.calls[0][0]).toBe(500);
    expect(mockJson.mock.calls.length).toBe(1);
    expect(mockJson).toBeCalledWith(expect.objectContaining({
      message: 'Failed to validate alias\' operation.'
    }));
  });
  test('Test failure when object in body list has no operation (1 bad before).', () => {
    // api function input
    const req = {
      body: [
        {
          alias: 'red_pin',
          value: 0
        },
        {
          alias: 'blue_pin',
          operation: 'write',
          value: 255
        },
        {
          alias: 'green_pin',
          operation: 'write',
          value: 255
        }
      ]
    };
    // run api with the costructed arguments
    api(req, res);

    // test output for expected behavior
    expect(mockStatus.mock.calls.length).toBe(1);
    expect(mockStatus.mock.calls[0][0]).toBe(500);
    expect(mockJson.mock.calls.length).toBe(1);
    expect(mockJson).toBeCalledWith(expect.objectContaining({
      message: 'Failed to validate alias\' operation.'
    }));
  });
});
