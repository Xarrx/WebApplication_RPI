/*
	Aliases for pins go here.
*/
'use strict';

function _validateAlwaysPass(value){return true;}
function _validateAlwaysFail(value){return false;}

module.exports = {
	red_pin: {
		pin: 17,
		allowed_operations: ['digitalWrite'],
		validate: (value) => {
			return true;
		}
	},
	green_pin: {
		pin: 22,
		allowed_operations: ['digitalWrite'],
		validate: (value) => {
			return true;
		}
	},
	blue_pin: {
		pin: 24,
		allowed_operations: ['digitalWrite'],
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
    allowed_operations: ['read', 'digitalWrite'],
    validate: (value) => {
      return true;
    }
  },
  test_pin_write_novaidate: {
    pin: 25,
    allowed_operations: ['digitalWrite'],
  },
  test_pin_write_badvalidate: {
    pin: 25,
    allowed_operations: ['digitalWrite'],
    validate: 'not a function'
  },
  test_pin_write_validatefails: {
    pin: 25,
    allowed_operations: ['digitalWrite'],
    validate: _validateAlwaysFail
  }
};