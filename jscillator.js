window.addEventListener("DOMContentLoaded", start);

function start() {
	// var a = 4185.97 * Math.pow(1.059463, 12);
	// console.log(a.toFixed(2));

	var audio = new AudioContext();

	var volume = 0;
	var pan = 0;
	var attack = 0.01;
	var decay = 0;
	var sustain = 1;
	var release = 0.30;
	var envelope = false;

	var master_compressor = audio.createDynamicsCompressor();
	master_compressor.threshold.value = -10;
	master_compressor.knee.value = 0;
	master_compressor.ratio.value = 20;
	master_compressor.reduction.value = 0;
	master_compressor.attack.value = 0;
	master_compressor.release.value = 0.1;
	// master_compressor.connect(audio.destination);

	var master = audio.createGain();
	master.gain.value = 0.5;
	master_compressor.connect(master);
	master.connect(audio.destination);
	

	function Note(frequency) {
		var carrier = audio.createOscillator();
		carrier.frequency.value = frequency;
		carrier.type = "sine";
		carrier.start();

		var carrier_volume = audio.createGain();
		carrier_volume.gain.value = volume;

		carrier.connect(carrier_volume);
		carrier_volume.connect(master_compressor);

		this.playing = false;
		this.interval = 0;

		this.play = function() {
			carrier_volume.gain.cancelScheduledValues(audio.currentTime);
			carrier_volume.gain.setValueAtTime(carrier_volume.gain.value, audio.currentTime);
			carrier_volume.gain.linearRampToValueAtTime(1, audio.currentTime + attack);

			this.interval = setTimeout(function() {
				carrier_volume.gain.cancelScheduledValues(audio.currentTime);
				carrier_volume.gain.setValueAtTime(carrier_volume.gain.value, audio.currentTime);
				carrier_volume.gain.linearRampToValueAtTime(sustain, audio.currentTime + decay);
			}, (attack * 1000 + 1));

			this.playing = true;
		};

		this.stop = function() {
			carrier_volume.gain.cancelScheduledValues(audio.currentTime);
			carrier_volume.gain.setValueAtTime(carrier_volume.gain.value, audio.currentTime);
			carrier_volume.gain.linearRampToValueAtTime(0, audio.currentTime + release);
			clearInterval(this.interval);
			this.playing = false;
		};
	}

	document.addEventListener("keydown", function(event) {

		if(keyToEQTable[event.keyCode] && !keyToEQTable[event.keyCode].osc.playing) {
			keyToEQTable[event.keyCode].osc.play();
			console.log(keyToEQTable[event.keyCode].note);
		}
	});

	document.addEventListener("keyup", function(event) {
		if(keyToEQTable[event.keyCode] && keyToEQTable[event.keyCode].osc.playing) {
			keyToEQTable[event.keyCode].osc.stop();
		}
	});

	var keyToEQTable = {
		81: {
			osc: new Note(261.63), //C4
			note: "C4",
		},
		87: {
			osc: new Note(277.18),
			note: "C#4",
		},
		69: {
			osc: new Note(293.66),
			note: "D4",
		},
		82: {
			osc: new Note(311.13),
			note: "D#4",
		},
		84: {
			osc: new Note(329.63),
			note: "E4",
		},
		89: {
			osc: new Note(349.23),
			note: "F4",
		},
		85: {
			osc: new Note(369.99),
			note: "F#4",
		},
		73: {
			osc: new Note(392.00),
			note: "G4",
		},
		79: {
			osc: new Note(415.30),
			note: "G#4",
		},
		80: {
			osc: new Note(440.00),
			note: "A4",
		},
		65: {
			osc: new Note(466.16),
			note: "A#4",
		},
		83: {
			osc: new Note(493.88),
			note: "B4",
		},
		68: {
			osc: new Note(523.25), //C5
			note: "C5",
		},
		70: {
			osc: new Note(554.37),
			note: "C#5",
		},
		71: {
			osc: new Note(587.33),
			note: "D5",
		},
		72: {
			osc: new Note(622.25),
			note: "D#5",
		},
		74: {
			osc: new Note(659.25),
			note: "E5",
		},
		75: {
			osc: new Note(698.46),
			note: "F5",
		},
		76: {
			osc: new Note(739.99),
			note: "F#5",
		},
		90: {
			osc: new Note(783.99),
			note: "G5",
		},
		88: {
			osc: new Note(830.61),
			note: "G#5",
		},
		67: {
			osc: new Note(880.00),
			note: "A5",
		},
		86: {
			osc: new Note(932.33),
			note: "A#5",
		},
		66: {
			osc: new Note(987.77),
			note: "B5",
		},
		78: {
			osc: new Note(1046.50), //C6
			note: "C6",
		},
		77: {
			osc: new Note(1108.73),
			note: "C#6",
		},
	};
}
