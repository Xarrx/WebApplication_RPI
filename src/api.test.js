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
			operation: <read, digitalWrite, etc.>,
			[value: <value>],
		},
		...
	]
*/
'use strict';
const api = require('./api');
jest.mock('./alias');
//jest.mock('pigpio');
// response object mock
const mockJson = jest.fn((x) => {return;});
const mockStatus = jest.fn((x) => {return {json: mockJson};});
const res = {status: mockStatus};

// reset the mock functions after each test run
afterEach(() => {
  mockJson.mockClear();
  mockStatus.mockClear();
  //pigpio.mockClear();
});

describe('Test that api fails when expected (pass 1).', () => {
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
          operation: 'digitalWrite',
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
          operation: 'digitalWrite',
          value: 0
        },
        {
          operation: 'digitalWrite',
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
          operation: 'digitalWrite',
          value: 0
        },
        {
          alias: 'red_pin',
          operation: 'digitalWrite',
          value: 0
        },
        {
          operation: 'digitalWrite',
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
          operation: 'digitalWrite',
          value: 0
        },
        {
          alias: 'green_pin',
          operation: 'digitalWrite',
          value: 0
        },
        {
          alias: 'red_pin',
          operation: 'digitalWrite',
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
          operation: 'digitalWrite',
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
          operation: 'digitalWrite',
          value: 0
        },
        {
          alias: 'sadfsadf',
          operation: 'digitalWrite',
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
          operation: 'digitalWrite',
          value: 0
        },
        {
          alias: 'red_pin',
          operation: 'digitalWrite',
          value: 0
        },
        {
          alias: 'sadfsadf',
          operation: 'digitalWrite',
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
          operation: 'digitalWrite',
          value: 0
        },
        {
          alias: 'green_pin',
          operation: 'digitalWrite',
          value: 0
        },
        {
          alias: 'red_pin',
          operation: 'digitalWrite',
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
          operation: 'digitalWrite',
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
          operation: 'digitalWrite',
          value: 255
        },
        {
          alias: 'green_pin',
          operation: 'digitalWrite',
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
          operation: 'digitalWrite',
          value: 255
        },
        {
          alias: 'green_pin',
          operation: 'digitalWrite',
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

  test('Test failure when object in body list has invalid operation (only 1).', () => {
    // api function input
    const req = {
      body: [
        {
          alias: 'blue_pin',
          operation: '',
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
  test('Test failure when object in body list has invalid operation (1 good before).', () => {
    // api function input
    const req = {
      body: [
        {
          alias: 'blue_pin',
          operation: 'digitalWrite',
          value: 255
        },
        {
          alias: 'blue_pin',
          operation: '',
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
  test('Test failure when object in body list has invalid operation (2 good before).', () => {
    // api function input
    const req = {
      body: [
        {
          alias: 'blue_pin',
          operation: 'digitalWrite',
          value: 255
        },
        {
          alias: 'blue_pin',
          operation: 'digitalWrite',
          value: 255
        },
        {
          alias: 'blue_pin',
          operation: '',
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
  test('Test failure when object in body list has invalid operation (1 bad before).', () => {
    // api function input
    const req = {
      body: [
        {
          alias: 'blue_pin',
          operation: '',
          value: 255
        },
        {
          alias: 'blue_pin',
          operation: 'digitalWrite',
          value: 255
        },
        {
          alias: 'blue_pin',
          operation: 'digitalWrite',
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

  test('Test failure when object in body list has invalid valid operation (only 1).', () => {
    // api function input
    const req = {
      body: [
        {
          alias: 'blue_pin',
          operation: 'read',
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
  test('Test failure when object in body list has invalid valid operation (1 good before).', () => {
    // api function input
    const req = {
      body: [
        {
          alias: 'blue_pin',
          operation: 'digitalWrite',
          value: 255
        },
        {
          alias: 'blue_pin',
          operation: 'read',
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
  test('Test failure when object in body list has invalid valid operation (2 good before).', () => {
    // api function input
    const req = {
      body: [
        {
          alias: 'blue_pin',
          operation: 'digitalWrite',
          value: 255
        },
        {
          alias: 'blue_pin',
          operation: 'digitalWrite',
          value: 255
        },
        {
          alias: 'blue_pin',
          operation: 'read',
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
  test('Test failure when object in body list has invalid valid operation (1 bad before).', () => {
    // api function input
    const req = {
      body: [
        {
          alias: 'blue_pin',
          operation: 'read',
          value: 255
        },
        {
          alias: 'blue_pin',
          operation: 'digitalWrite',
          value: 255
        },
        {
          alias: 'blue_pin',
          operation: 'digitalWrite',
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



/* 

  Week 2 test additions




*/
describe('Test that api fails on digitalWrite operation when value is missing (pass 2.1).', () => {
  test('Test digitalWrite failure when value is missing (only 1).', () => {
    // api function input
    const req = {
      body: [
        {
          alias: 'blue_pin',
          operation: 'digitalWrite'
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
      message: 'Failed to validate alias\' value.'
    }));
  });
test('Test digitalWrite failure when value is missing (1 good before).', () => {
    // api function input
    const req = {
      body: [
        {
          alias: 'red_pin',
          operation: 'digitalWrite',
          value: 100
        },
        {
          alias: 'blue_pin',
          operation: 'digitalWrite'
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
      message: 'Failed to validate alias\' value.'
    }));
  });
  test('Test digitalWrite failure when value is missing (2 good before).', () => {
    // api function input
    const req = {
      body: [
        {
          alias: 'red_pin',
          operation: 'digitalWrite',
          value: 100
        },
        {
          alias: 'green_pin',
          operation: 'digitalWrite',
          value: 100
        },
        {
          alias: 'blue_pin',
          operation: 'digitalWrite'
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
      message: 'Failed to validate alias\' value.'
    }));
  });
  test('Test digitalWrite failure when value is missing (1 bad before).', () => {
    // api function input
    const req = {
      body: [
        {
          alias: 'blue_pin',
          operation: 'digitalWrite'
        },
        {
          alias: 'red_pin',
          operation: 'digitalWrite',
          value: 100
        },
        {
          alias: 'green_pin',
          operation: 'digitalWrite',
          value: 100
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
      message: 'Failed to validate alias\' value.'
    }));
  });
});

describe('Test that api fails on digitalWrite operation when validate function is undefined (pass 2.2).', () => {
  test('Test digitalWrite failure when validate is missing from alias (1 bad alias).', () => {
    // api function input
    const req = {
      body: [
        {
          alias: 'test_pin_digitalWrite_novaidate',
          operation: 'digitalWrite',
          value: 100
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
      message: 'Failed to validate alias\' value.'
    }));
  });
  test('Test digitalWrite failure when validate is missing from alias (1 good before).', () => {
    // api function input
    const req = {
      body: [
        {
          alias: 'green_pin',
          operation: 'digitalWrite',
          value: 255
        },
        {
          alias: 'test_pin_digitalWrite_novaidate',
          operation: 'digitalWrite',
          value: 100
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
      message: 'Failed to validate alias\' value.'
    }));
  });
  test('Test digitalWrite failure when validate is missing from alias (2 good before).', () => {
    // api function input
    const req = {
      body: [
        {
          alias: 'green_pin',
          operation: 'digitalWrite',
          value: 255
        },
        {
          alias: 'blue_pin',
          operation: 'digitalWrite',
          value: 255
        },
        {
          alias: 'test_pin_digitalWrite_novaidate',
          operation: 'digitalWrite',
          value: 100
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
      message: 'Failed to validate alias\' value.'
    }));
  });
  test('Test digitalWrite failure when validate is missing from alias (1 bad before).', () => {
    // api function input
    const req = {
      body: [
        {
          alias: 'test_pin_digitalWrite_novaidate',
          operation: 'digitalWrite',
          value: 100
        },
        {
          alias: 'green_pin',
          operation: 'digitalWrite',
          value: 255
        },
        {
          alias: 'blue_pin',
          operation: 'digitalWrite',
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
      message: 'Failed to validate alias\' value.'
    }));
  });
});

describe('Test that api fails on digitalWrite operation when validate function is not a function (pass 2.3).', () => {
  test('Test digitalWrite failure when validate is not a function (1 bad alias).', () => {
    // api function input
    const req = {
      body: [
        {
          alias: 'test_pin_digitalWrite_badvalidate',
          operation: 'digitalWrite',
          value: 100
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
      message: 'Failed to validate alias\' value.'
    }));
  });
  test('Test digitalWrite failure when validate is not a function (1 good before).', () => {
    // api function input
    const req = {
      body: [
        {
          alias: 'green_pin',
          operation: 'digitalWrite',
          value: 255
        },
        {
          alias: 'test_pin_digitalWrite_badvalidate',
          operation: 'digitalWrite',
          value: 100
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
      message: 'Failed to validate alias\' value.'
    }));
  });
  test('Test digitalWrite failure when validate is not a function (2 good before).', () => {
    // api function input
    const req = {
      body: [
        {
          alias: 'green_pin',
          operation: 'digitalWrite',
          value: 255
        },
        {
          alias: 'blue_pin',
          operation: 'digitalWrite',
          value: 255
        },
        {
          alias: 'test_pin_digitalWrite_badvalidate',
          operation: 'digitalWrite',
          value: 100
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
      message: 'Failed to validate alias\' value.'
    }));
  });
  test('Test digitalWrite failure when validate is not a function (1 bad before).', () => {
    // api function input
    const req = {
      body: [
        {
          alias: 'test_pin_digitalWrite_badvalidate',
          operation: 'digitalWrite',
          value: 100
        },
        {
          alias: 'green_pin',
          operation: 'digitalWrite',
          value: 255
        },
        {
          alias: 'blue_pin',
          operation: 'digitalWrite',
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
      message: 'Failed to validate alias\' value.'
    }));
  });
});

describe('Test that api fails on digitalWrite operation when validate function returns false (pass 2.4).', () => {
  test('Test digitalWrite failure when validate fails (1 bad alias).', () => {
    // api function input
    const req = {
      body: [
        {
          alias: 'test_pin_digitalWrite_validatefails',
          operation: 'digitalWrite',
          value: 100
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
      message: 'Failed to validate alias\' value.'
    }));
  });
  test('Test digitalWrite failure when validate fails (1 good before).', () => {
    // api function input
    const req = {
      body: [
        {
          alias: 'green_pin',
          operation: 'digitalWrite',
          value: 255
        },
        {
          alias: 'test_pin_digitalWrite_validatefails',
          operation: 'digitalWrite',
          value: 100
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
      message: 'Failed to validate alias\' value.'
    }));
  });
  test('Test digitalWrite failure when validate fails (2 good before).', () => {
    // api function input
    const req = {
      body: [
        {
          alias: 'green_pin',
          operation: 'digitalWrite',
          value: 255
        },
        {
          alias: 'blue_pin',
          operation: 'digitalWrite',
          value: 255
        },
        {
          alias: 'test_pin_digitalWrite_validatefails',
          operation: 'digitalWrite',
          value: 100
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
      message: 'Failed to validate alias\' value.'
    }));
  });
  test('Test digitalWrite failure when validate fails (1 bad before).', () => {
    // api function input
    const req = {
      body: [
        {
          alias: 'test_pin_digitalWrite_validatefails',
          operation: 'digitalWrite',
          value: 100
        },
        {
          alias: 'green_pin',
          operation: 'digitalWrite',
          value: 255
        },
        {
          alias: 'blue_pin',
          operation: 'digitalWrite',
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
      message: 'Failed to validate alias\' value.'
    }));
  });
});

describe('Test that api fails when expected (pass 3).', () => {
  test('Test failure when object in body list is missing alias property (only 1)', () => {
    // api function input
    const req = {
      body: [
        {
          operation: 'pwmWrite',
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
          operation: 'pwmWrite',
          value: 0
        },
        {
          operation: 'pwmWrite',
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
          operation: 'pwmWrite',
          value: 0
        },
        {
          alias: 'red_pin',
          operation: 'pwmWrite',
          value: 0
        },
        {
          operation: 'pwmWrite',
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
          operation: 'pwmWrite',
          value: 0
        },
        {
          alias: 'green_pin',
          operation: 'pwmWrite',
          value: 0
        },
        {
          alias: 'red_pin',
          operation: 'pwmWrite',
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
          operation: 'pwmWrite',
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
          operation: 'pwmWrite',
          value: 0
        },
        {
          alias: 'sadfsadf',
          operation: 'pwmWrite',
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
          operation: 'pwmWrite',
          value: 0
        },
        {
          alias: 'red_pin',
          operation: 'pwmWrite',
          value: 0
        },
        {
          alias: 'sadfsadf',
          operation: 'pwmWrite',
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
          operation: 'pwmWrite',
          value: 0
        },
        {
          alias: 'green_pin',
          operation: 'pwmWrite',
          value: 0
        },
        {
          alias: 'red_pin',
          operation: 'pwmWrite',
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
          operation: 'pwmWrite',
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
          operation: 'pwmWrite',
          value: 255
        },
        {
          alias: 'green_pin',
          operation: 'pwmWrite',
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
          operation: 'pwmWrite',
          value: 255
        },
        {
          alias: 'green_pin',
          operation: 'pwmWrite',
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

  test('Test failure when object in body list has invalid operation (only 1).', () => {
    // api function input
    const req = {
      body: [
        {
          alias: 'blue_pin',
          operation: '',
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
  test('Test failure when object in body list has invalid operation (1 good before).', () => {
    // api function input
    const req = {
      body: [
        {
          alias: 'blue_pin',
          operation: 'pwmWrite',
          value: 255
        },
        {
          alias: 'blue_pin',
          operation: '',
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
  test('Test failure when object in body list has invalid operation (2 good before).', () => {
    // api function input
    const req = {
      body: [
        {
          alias: 'blue_pin',
          operation: 'pwmWrite',
          value: 255
        },
        {
          alias: 'blue_pin',
          operation: 'pwmWrite',
          value: 255
        },
        {
          alias: 'blue_pin',
          operation: '',
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
  test('Test failure when object in body list has invalid operation (1 bad before).', () => {
    // api function input
    const req = {
      body: [
        {
          alias: 'blue_pin',
          operation: '',
          value: 255
        },
        {
          alias: 'blue_pin',
          operation: 'pwmWrite',
          value: 255
        },
        {
          alias: 'blue_pin',
          operation: 'pwmWrite',
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

  test('Test failure when object in body list has invalid valid operation (only 1).', () => {
    // api function input
    const req = {
      body: [
        {
          alias: 'blue_pin',
          operation: 'read',
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
  test('Test failure when object in body list has invalid valid operation (1 good before).', () => {
    // api function input
    const req = {
      body: [
        {
          alias: 'blue_pin',
          operation: 'pwmWrite',
          value: 255
        },
        {
          alias: 'blue_pin',
          operation: 'read',
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
  test('Test failure when object in body list has invalid valid operation (2 good before).', () => {
    // api function input
    const req = {
      body: [
        {
          alias: 'blue_pin',
          operation: 'pwmWrite',
          value: 255
        },
        {
          alias: 'blue_pin',
          operation: 'pwmWrite',
          value: 255
        },
        {
          alias: 'blue_pin',
          operation: 'read',
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
  test('Test failure when object in body list has invalid valid operation (1 bad before).', () => {
    // api function input
    const req = {
      body: [
        {
          alias: 'blue_pin',
          operation: 'read',
          value: 255
        },
        {
          alias: 'blue_pin',
          operation: 'pwmWrite',
          value: 255
        },
        {
          alias: 'blue_pin',
          operation: 'pwmWrite',
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



/* 

  Week ? test additions




*/
describe('Test that api fails on digitalWrite operation when value is missing (pass 3.1).', () => {
  test('Test pwmWrite failure when value is missing (only 1).', () => {
    // api function input
    const req = {
      body: [
        {
          alias: 'blue_pin',
          operation: 'pwmWrite'
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
      message: 'Failed to validate alias\' value.'
    }));
  });
test('Test pwmWrite failure when value is missing (1 good before).', () => {
    // api function input
    const req = {
      body: [
        {
          alias: 'red_pin',
          operation: 'pwmWrite',
          value: 100
        },
        {
          alias: 'blue_pin',
          operation: 'pwmWrite'
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
      message: 'Failed to validate alias\' value.'
    }));
  });
  test('Test pwmWrite failure when value is missing (2 good before).', () => {
    // api function input
    const req = {
      body: [
        {
          alias: 'red_pin',
          operation: 'pwmWrite',
          value: 100
        },
        {
          alias: 'green_pin',
          operation: 'pwmWrite',
          value: 100
        },
        {
          alias: 'blue_pin',
          operation: 'pwmWrite'
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
      message: 'Failed to validate alias\' value.'
    }));
  });
  test('Test pwmWrite failure when value is missing (1 bad before).', () => {
    // api function input
    const req = {
      body: [
        {
          alias: 'blue_pin',
          operation: 'pwmWrite'
        },
        {
          alias: 'red_pin',
          operation: 'pwmWrite',
          value: 100
        },
        {
          alias: 'green_pin',
          operation: 'pwmWrite',
          value: 100
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
      message: 'Failed to validate alias\' value.'
    }));
  });
});

describe('Test that api fails on pwmWrite operation when validate function is undefined (pass 3.2).', () => {
  test('Test pwmWrite failure when validate is missing from alias (1 bad alias).', () => {
    // api function input
    const req = {
      body: [
        {
          alias: 'test_pin_pwmWrite_novaidate',
          operation: 'pwmWrite',
          value: 100
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
      message: 'Failed to validate alias\' value.'
    }));
  });
  test('Test pwmWrite failure when validate is missing from alias (1 good before).', () => {
    // api function input
    const req = {
      body: [
        {
          alias: 'green_pin',
          operation: 'pwmWrite',
          value: 255
        },
        {
          alias: 'test_pin_pwmWrite_novaidate',
          operation: 'pwmWrite',
          value: 100
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
      message: 'Failed to validate alias\' value.'
    }));
  });
  test('Test pwmWrite failure when validate is missing from alias (2 good before).', () => {
    // api function input
    const req = {
      body: [
        {
          alias: 'green_pin',
          operation: 'pwmWrite',
          value: 255
        },
        {
          alias: 'blue_pin',
          operation: 'pwmWrite',
          value: 255
        },
        {
          alias: 'test_pin_pwmWrite_novaidate',
          operation: 'pwmWrite',
          value: 100
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
      message: 'Failed to validate alias\' value.'
    }));
  });
  test('Test pwmWrite failure when validate is missing from alias (1 bad before).', () => {
    // api function input
    const req = {
      body: [
        {
          alias: 'test_pin_pwmWrite_novaidate',
          operation: 'pwmWrite',
          value: 100
        },
        {
          alias: 'green_pin',
          operation: 'pwmWrite',
          value: 255
        },
        {
          alias: 'blue_pin',
          operation: 'pwmWrite',
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
      message: 'Failed to validate alias\' value.'
    }));
  });
});

describe('Test that api fails on pwmWrite operation when validate function is not a function (pass 3.3).', () => {
  test('Test pwmWrite failure when validate is not a function (1 bad alias).', () => {
    // api function input
    const req = {
      body: [
        {
          alias: 'test_pin_pwmWrite_badvalidate',
          operation: 'pwmWrite',
          value: 100
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
      message: 'Failed to validate alias\' value.'
    }));
  });
  test('Test pwmWrite failure when validate is not a function (1 good before).', () => {
    // api function input
    const req = {
      body: [
        {
          alias: 'green_pin',
          operation: 'pwmWrite',
          value: 255
        },
        {
          alias: 'test_pin_pwmWrite_badvalidate',
          operation: 'pwmWrite',
          value: 100
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
      message: 'Failed to validate alias\' value.'
    }));
  });
  test('Test pwmWrite failure when validate is not a function (2 good before).', () => {
    // api function input
    const req = {
      body: [
        {
          alias: 'green_pin',
          operation: 'pwmWrite',
          value: 255
        },
        {
          alias: 'blue_pin',
          operation: 'pwmWrite',
          value: 255
        },
        {
          alias: 'test_pin_pwmWrite_badvalidate',
          operation: 'pwmWrite',
          value: 100
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
      message: 'Failed to validate alias\' value.'
    }));
  });
  test('Test pwmWrite failure when validate is not a function (1 bad before).', () => {
    // api function input
    const req = {
      body: [
        {
          alias: 'test_pin_pwmWrite_badvalidate',
          operation: 'pwmWrite',
          value: 100
        },
        {
          alias: 'green_pin',
          operation: 'pwmWrite',
          value: 255
        },
        {
          alias: 'blue_pin',
          operation: 'pwmWrite',
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
      message: 'Failed to validate alias\' value.'
    }));
  });
});

describe('Test that api fails on pwmWrite operation when validate function returns false (pass 3.4).', () => {
  test('Test pwmWrite failure when validate fails (1 bad alias).', () => {
    // api function input
    const req = {
      body: [
        {
          alias: 'test_pin_pwmWrite_validatefails',
          operation: 'pwmWrite',
          value: 100
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
      message: 'Failed to validate alias\' value.'
    }));
  });
  test('Test pwmWrite failure when validate fails (1 good before).', () => {
    // api function input
    const req = {
      body: [
        {
          alias: 'green_pin',
          operation: 'pwmWrite',
          value: 255
        },
        {
          alias: 'test_pin_pwmWrite_validatefails',
          operation: 'pwmWrite',
          value: 100
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
      message: 'Failed to validate alias\' value.'
    }));
  });
  test('Test pwmWrite failure when validate fails (2 good before).', () => {
    // api function input
    const req = {
      body: [
        {
          alias: 'green_pin',
          operation: 'pwmWrite',
          value: 255
        },
        {
          alias: 'blue_pin',
          operation: 'pwmWrite',
          value: 255
        },
        {
          alias: 'test_pin_pwmWrite_validatefails',
          operation: 'pwmWrite',
          value: 100
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
      message: 'Failed to validate alias\' value.'
    }));
  });
  test('Test pwmWrite failure when validate fails (1 bad before).', () => {
    // api function input
    const req = {
      body: [
        {
          alias: 'test_pin_pwmWrite_validatefails',
          operation: 'pwmWrite',
          value: 100
        },
        {
          alias: 'green_pin',
          operation: 'pwmWrite',
          value: 255
        },
        {
          alias: 'blue_pin',
          operation: 'pwmWrite',
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
      message: 'Failed to validate alias\' value.'
    }));
  });
});

/*
  Test success conditions

describe('Test that calls gpio functions when validation is successful (pass 2.5).', () => {
  test('Test that on successful validation of a digitalWrite operation request, that an instance of the gpio class is created and the digitalWrite function is called on it. ', () => {
    const req = {
      body: [
        {
          alias: 'test_pin_digitalWrite_validateSuccess',
          operation: 'digitalWrite',
          value: 1
        }
      ]
    };

    // run api with constructed arguments
    api(req, res);

    // 
    expect(pigpio).toHaveBeenCalled();

  });
});
*/