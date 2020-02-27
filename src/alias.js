/*
	Aliases for pins go here.
*/
'use strict';
module.exports = {
	red_pin: {
		pin: 17,
		allowed_operations: ['write'],
		validate: (value) => {
			return false;
		}
		format: (value) => {
			return 0;
		}
	},
	green_pin: {
		pin: 22,
		allowed_operations: ['write'],
		validate: (value) => {
			return false;
		},
		format: (value) => {
			return 0;
		}
	},
	blue_pin: {
		pin: 24,
		allowed_operations: ['write'],
		validate: (value) => {
			return false;
		},
		format: (value) => {
			return 0;
		}
	}
};