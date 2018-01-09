# Input Redirection for 3DS via Luma3DS CFW

This is a Node.js implementation for input redirection with minimal build steps. Based heavily on [InputRedirection-Qt](https://github.com/TuxSH/InputRedirectionClient-Qt) and [xinputjs](https://github.com/thraaawn/xinputjs), this node process wraps Microsoft's xinput game controller API, encodes controller input, and sends it to the UDP port on the 3DS waiting patiently for binary controller data.

*Does not currently support touchscreen, home, or power buttons.

## Contents

- [Requirements](#requirements)
- [Installation](#installation)
- [Configuration](#configuration)
- [Recognition](#recognition)
- [License](#license)

## Requirements

- Windows >7 (tested on Win10)
- [Node.js](http://nodejs.org) > 4.4.3 (tested on 8.9.4)
- Windows Build Tools (see [installation](#installation))
- node-gyp

## Installation
**If you're a developer:**

Clone this repository, run these commands from an **elevated** command prompt:
```
npm install -g --production windows-build-tools
npm install -g node-gyp
```
then these commands inside the project:
```
npm install
node 3ds
``` 

**If you're not a developer:**

1. (< 1 min) Download and install the Node.js binary from the [Node.js website](http://nodejs.org). Go with whatever they're calling "LTS" at the time you visit the website. At the time of this writing, LTS is v8.9.4.

2. (< 1 min) Open an elevated command prompt (run cmd.exe as an administrator) and type `node -v` followed by enter to verify you've installed node correctly. Make sure the number that appears in the console is greater than v4.4.3.

3. (4 - 8 min) Issue the following command: `npm install -g --production windows-build-tools` to start the installation process for the Windows Build Tools. This will automatically install Python 2.7 and the Visual Studio Build Tools. This is the most time-consuming step.

4. (< 1 min) Enter the command: `npm install -g node-gyp` to install node-gyp, a cross-platform compiler for native modules.

5. (< 1 min) Download [this package](https://github.com/paulhbarker/input-redirection/archive/master.zip) (or clone with git) and unzip it to a convenient location. If windows tells you it has a virus, worry not, windows defender is a liar liar pants on fire. Whitelist the file or disable the worthless antivirus software.

6. (< 1 min) Go back to your command prompt and navigate to the unzipped folder (should be called input-redirection-master) with the command `cd <location>`. If you're not familiar with the command line and navigation, use [this](https://www.digitalcitizen.life/command-prompt-how-use-basic-commands) as a reference.

7. (1 - 2  min) When you're inside the extracted folder, run `npm install`. If this command fails, or you see a lot of lines that begin with `npm ERR!`, make sure you're in the right folder (the folder should have a `package.json` file) and that you've completed all the previous steps.

8. (1 - 5 min) Configure the input redirection button mappings and IP Address (see [configuration](#configuration)).

9. ( ~ ) To start the input redirection, make sure your configuration is set up properly and that your Xbox controller is connected to your PC, and then when you're ready to turn your Xbox controller into a 3DS controller, issue the command `node 3ds`.

You computer will (invisibly) start sending data accross the wire to the IP Address you specified in `config.js`. When you wish to finish sending data, either close your command prompt window, or press the keyboard shortcut `CTRL + C`. 

Make sure your Xbox controller is connected and powered on **before** you run `node 3ds`.

## Configuration

#### Network

The program needs you to tell it where to send the controller data, and you can do so by opening the `config.js` file in the `config` folder. The file is commented, so you shouldn't have an issue deciphering which settings do what. Set your ip address to the one supplied to you by Luma3DS in the upper-right-hand corner, and save the file.

#### Button Mapping

The great thing about this build is that the buttons are (almost) completely customizable via the `button_map.js` file in the `config` folder. With the exception of the bumpers (which are reserved for L2 and R2 on the NEW 3DS) any of the buttons in this file may be remapped. 

The letters on the left are the button presses that the the program will issue, and their values on the right are whatever you'd like them to be. For example, inversing "A" and "B" would look like this: 

```
module.exports = {
    A: button.B,
    B: button.A,
    X: button.X,
    ...
}
```
By default, "A" and "B" are inversed, as are "X" and "Y".
## Recognition

A huge thanks to the creators of [xinputjs](https://github.com/thraaawn/xinputjs) and [InputRedirection-Qt](https://github.com/TuxSH/InputRedirectionClient-Qt), on which this code was heavily based.

## License

MIT
