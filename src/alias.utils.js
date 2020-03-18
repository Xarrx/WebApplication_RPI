'use strict';
module.exports = {
  validate_color_pins: (value) => {
    return value >= 0 && value <= 255;
  }
}