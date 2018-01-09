module.exports = {
    /**
     * How often the process will fetch the controller
     * state in milliseconds. The lower the number,
     * the more accuracy and more CPU required.
     */
    interval: 5,

    /**
     * Where to send the data - usually displayed in the
     * top right corner after turning on input redirection
     * in Luma3DS.
     */
    ipAddress: '192.168.1.11',

    /**
     * Port Input Rediraction listens on for
     * controller data via UDP.
     */
    port: 4950,
}
