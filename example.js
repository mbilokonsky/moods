#!/usr/bin/env node
const { GREAT, GOOD, OK, NEUTRAL, MEH, BAD, HORRIBLE } = require('./index.js')

// ensure fixed order
const data = [ HORRIBLE, BAD, MEH,	NEUTRAL, OK, GOOD, GREAT ]

const clear = () => process.stdout.clearLine();

let initialized = false;
// I believe they call this
//  <sunglasses meme>
// "mutable state".
let state;


const render_state = index => {
	clear();
	state = index;
	const line = data.map(({emoji}, i) => (i === state) ? `[${emoji}]` : ` ${emoji} `)
	process.stdout.cursorTo(0);
	process.stdout.write(`How do you feel?`)
	process.stdout.cursorTo(20);
	process.stdout.write(line.join('     '))
	process.stdout.write(` [${data[state].label}?]`)

	// I dunno about you but my shell keeps putting a distracting cursor
	// on the screen, so let's punch that all the way to the right
	// and out of the way.
	process.stdout.cursorTo(2000);
}

const worse = () => {
	if (state > 0 && initialized) {
		render_state(state - 1)
	}
}

const better = () => {
	if (state < data.length - 1 && initialized) {
		render_state(state + 1)
	}
}

const log = () => {
	const { label, emoji } = data[state]
	clear();
	process.stdout.cursorTo(0);
	process.stdout.write(`${emoji}  You feel ${label}!`)
	process.exit()
}

const stdin = process.stdin;
stdin.setRawMode(true);
stdin.resume();
stdin.setEncoding('utf8');

const initialize = () => {
	// I just cribbed this from a stack overflow answer
	// https://stackoverflow.com/questions/17470554/how-to-capture-the-arrow-keys-in-node-js/30687420

	stdin.on('data', key => {
		// use the left and right arrow keys to move between states
		if (key == '\u001B\u005B\u0044') { worse(); } 	// left
		if (key == '\u001B\u005B\u0043') { better(); }	// right

		// you can even select your state by pressing the corresponding number key!
		if (key == '\u0031') { render_state(0) }
		if (key == '\u0032') { render_state(1) }
		if (key == '\u0033') { render_state(2) }
		if (key == '\u0034') { render_state(3) }
		if (key == '\u0035') { render_state(4) }
		if (key == '\u0036') { render_state(5) }
		if (key == '\u0037') { render_state(6) }

		// Enter to select your current mood and exit the program, ctrl-c to quit.
		if (key == '\u000D') { log(); }									// enter
		if (key == '\u0003') { process.exit(); }				// ctrl-c
	})

	// start out in the middle, 'NEUTRAL'.
	render_state(3)
	initialized = true
}

initialize()
