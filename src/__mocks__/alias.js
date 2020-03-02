/*
	Aliases for pins go here.
*/
'use strict';

function _validateAlwaysPass(value){return true;}
function _validateAlwaysFail(value){return false;}

module.exports = {
	red_pin: {
		pin: 17,
		allowed_operations: ['write'],
		validate: (value) => {
			return true;
		}
	},
	green_pin: {
		pin: 22,
		allowed_operations: ['write'],
		validate: (value) => {
			return true;
		}
	},
	blue_pin: {
		pin: 24,
		allowed_operations: ['write'],
		validate: (value) => {
			return true;
		}
	},
  test_pin_readonly: {
    pin: 23,
    allowed_operations: ['read'],
    validate: (value) => {
      return true;
    }
  },
  test_pin_readwrite: {
    pin: 25,
    allowed_operations: ['read', 'write'],
    validate: (value) => {
      return true;
    }
  },
  test_pin_write_novaidate: {
    pin: 25,
    allowed_operations: ['write'],
  },
  test_pin_validatefail_onlywrite: {
    pin: 26,
    allowed_operations: ['write'],
    validate: _validateAlwaysFail
  },
  test_pin_validatefail_onlyread: {
    pin: 27,
    allowed_operations: ['read'],
    validate: _validateAlwaysFail
  },
  test_pin_validatefail_readwrite: {
    pin: 28,
    allowed_operations: ['read', 'write'],
    validate: _validateAlwaysFail
  },
};