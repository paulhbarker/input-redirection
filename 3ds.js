const dgram = require('dgram');
const xinput = require('./xinput');
const socket = dgram.createSocket('udp4');
const config = require('./config/config');
const buttons = require('./config/button_map');

const M_SQRT1_2 = 1/Math.sqrt(2);

const CPAD_BOUND = 0x5d0;
const CPP_BOUND = 0x7f;

const gamePadConfig = { interval: config.interval };
const gamepad = xinput.WrapController(0, gamePadConfig);

startInputRedirection();

function startInputRedirection() {
    setInterval(() => {
        let state = xinput.GetState(0);

        const hidPad = setButtons(state);
        const touchScreenState = setTouchscreen(state);
        const circlePadState = setCirclePad();
        const newDSInputs = setNewDSInputs(state);
        const interfaceButtons = 0;

        const buffer = Buffer.allocUnsafe(20);

        buffer.writeUInt32LE(hidPad, 0);
        buffer.writeUInt32LE(touchScreenState, 4);
        buffer.writeUInt32LE(circlePadState, 8);
        buffer.writeUInt32LE(newDSInputs, 12);
        buffer.writeUInt32LE(interfaceButtons, 16);

        socket.send(buffer, config.port, config.ipAddress, err => {
            if (err) {
                console.log(err);
            }
        });
    }, 5);
}

/**
 * Map the appropriate XBox controller buttons
 * to 3DS controls
 *
 * @param state
 * @returns {number}
 */
function setButtons(state) {
    let hidPad = 0xfff;

    if (state.buttons.a) {
        hidPad &= ~(1 << buttons.A);
    }

    if (state.buttons.b) {
        hidPad &= ~(1 << buttons.B);
    }

    if (state.control.back) {
        hidPad &= ~(1 << (buttons.SELECT));
    }

    if (state.control.start) {
        hidPad &= ~(1 << (buttons.START));
    }

    if (state.dpad.right) {
        hidPad &= ~(1 << (buttons.RIGHT));
    }

    if (state.dpad.left) {
        hidPad &= ~(1 << (buttons.LEFT));
    }

    if (state.dpad.up) {
        hidPad &= ~(1 << (buttons.UP));
    }

    if (state.dpad.down) {
        hidPad &= ~(1 << (buttons.DOWN));
    }

    if (state.trigger.right) {
        hidPad &= ~(1 << (buttons.R1));
    }

    if (state.trigger.left) {
        hidPad &= ~(1 << (buttons.L1));
    }

    if (state.buttons.x) {
        hidPad &= ~(1 << (buttons.X))
    }

    if (state.buttons.y) {
        hidPad &= ~(1 << (buttons.Y))
    }

    return hidPad;
};

/**
 * Map bumpers to R2 and L2
 *
 * @param state
 * @returns {number}
 */
function setIRButtons(state) {
    let irButtonState = 0;

    if (state.shoulder.right) {
        irButtonState |= 1 << (buttons.R2 - 11)
    }

    if (state.shoulder.left) {
        irButtonState |= 1 << (buttons.L2 - 11)
    }

    return irButtonState;
}

/**
 * Map the touchscreen
 *
 * @param state
 * @returns {number}
 */
function setTouchscreen(state) {
    return 0x2000000;
    // TODO: Creaete a GUI touchscreen
}

/**
 * Map the left joystick to the analog 3DS joystick
 *
 * @returns {number}
 */
function setCirclePad() {
    let circlePadState = 0x7ff7ff;

    const lx = gamepad.getNormalizedState('leftstick', 'x');
    const ly = gamepad.getNormalizedState('leftstick', 'y');

    if (lx != 0.0 || ly != 0.0) {
        let x = parseInt(lx * CPAD_BOUND + 0x800);
        let y = parseInt(ly * CPAD_BOUND + 0x800);
        x = x >= 0xfff ? (lx < 0.0 ? 0x000 : 0xfff) : x;
        y = y >= 0xfff ? (ly < 0.0 ? 0x000 : 0xfff) : y;

        circlePadState = (y << 12) | x;
    }

    return circlePadState;
}

/**
 * Map NEW 3DS L2, R2, and C-Stick to left and right
 * bumpers and right joystick.
 *
 * @param state
 * @returns {number}
 */
function setNewDSInputs(state) {
    let cStickState = 0x80800081;

    const rx = gamepad.getNormalizedState('rightstick', 'x');
    const ry = gamepad.getNormalizedState('rightstick', 'y');

    const irButtonsState = setIRButtons(state);

    if (rx != 0.0 || ry != 0.0 || irButtonsState != 0) {
        // We have to rotate the c-stick position 45°. Thanks, Nintendo.

        let x = toUint32(M_SQRT1_2 * (rx + ry) * CPP_BOUND + 0x80);
        let y = toUint32(M_SQRT1_2 * (ry - rx) * CPP_BOUND + 0x80);
        x = x >= 0xff ? (rx < 0.0 ? 0x00 : 0xff) : x;
        y = y >= 0xff ? (ry < 0.0 ? 0x00 : 0xff) : y;

        cStickState = toUint32((y << 24) | (x << 16) | (irButtonsState << 8) | 0x81);
    }

    return cStickState;
}

function modulo(a, b) {
    return a - Math.floor(a/b)*b;
}

function toUint32(x) {
    return modulo(toInteger(x), Math.pow(2, 32));
}

function toInteger(x) {
    x = Number(x);
    return x < 0 ? Math.ceil(x) : Math.floor(x);
}
