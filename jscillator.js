window.addEventListener("DOMContentLoaded", start);

function start() {
	// console.log("hi");
	// var a = 4185.97 * Math.pow(1.059463, 12);
	// console.log(a.toFixed(2));

	var audio = new AudioContext();

	var volume = 0;
	var pan = 0;
	var attack = 1;
	var delay = 0;
	var sustain = 0;
	var release = 1;
	var envelope = false;
	var playing = false;

	function Note(frequency) {
		var carrier = audio.createOscillator();
		carrier.frequency.value = frequency;
		carrier.type = "sine";
		carrier.start();

		var carrier_volume = audio.createGain();
		carrier_volume.gain.value = volume;
		carrier.connect(carrier_volume);
		carrier_volume.connect(audio.destination);

		this.playing = false;

		this.play = function() {
			carrier_volume.gain.cancelScheduledValues(audio.currentTime);
			carrier_volume.gain.setValueAtTime(carrier_volume.gain.value, audio.currentTime);
			carrier_volume.gain.linearRampToValueAtTime(0.25, audio.currentTime + attack);
			this.playing = true;
		};

		this.stop = function() {
			carrier_volume.gain.cancelScheduledValues(audio.currentTime);
			carrier_volume.gain.setValueAtTime(carrier_volume.gain.value, audio.currentTime);
			carrier_volume.gain.linearRampToValueAtTime(0, audio.currentTime + release);
			this.playing = false;
		};
	}

	var n1 = new Note(261.63);
	var n2 = new Note(523.25);

	document.addEventListener("keydown", function(e) {
		console.log(e.keyCode);

		if(e.keyCode == 81 && !n1.playing) {
			n1.play();
		}
		else if(e.keyCode == 87 && !n2.playing) {
			n2.play();
		}
	});

	document.addEventListener("keyup", function(e) {
		if(e.keyCode == 81 && n1.playing) {
			n1.stop();
		}
		else if(e.keyCode == 87 && n2.playing) {
			n2.stop();
		}
	});
}
