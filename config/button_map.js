const button = require('../constants/buttons');

module.exports = {
    A: button.B,
    B: button.A,
    X: button.Y,
    Y: button.X,
    SELECT: button.SELECT,
    START: button.START,
    RIGHT: button.RIGHT,
    LEFT: button.LEFT,
    UP: button.UP,
    DOWN: button.DOWN,
    R1: button.R1,
    L1: button.L1,

    /**
     * Due to the way Nintendo has set up their second R and L
     * buttons, they're a little more difficult to map, so
     * leave these alone unless you want to reverse them.
     * By default, they are right and left bumpers.
     */
    R2: button.R2,
    L2: button.L2,
}
