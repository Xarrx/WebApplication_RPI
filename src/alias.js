/*
	Aliases for pins go here.
*/
'use strict';
// require the module containing the alias utility functions
const autils = require('./alias.utils.js')
module.exports = {
	red_pin: {
		pin: 17,
		allowed_operations: ['pwmWrite'],
		validate: autils.validate_color_pins
	},
	green_pin: {
		pin: 22,
		allowed_operations: ['pwmWrite'],
		validate: autils.validate_color_pins
	},
	blue_pin: {
		pin: 24,
		allowed_operations: ['pwmWrite'],
		validate: autils.validate_color_pins
	}
};