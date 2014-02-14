/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * maxAngle: 0 ~ maxAngle(degree)
 */

var _arduino, _pin, _max_angle, _pulse_period, _pulse_zero_time, _pulse_on_max_time;
var _angle, _pulse_on_time, _pulse_off_time;

exports.Servo = function (arduino, pin, maxAngle, pulsePeriod, pulseZeroTime, pulseOnMaximumTime){
	_arduino = arduino;
	_pin = pin;
	_max_angle = maxAngle;
	_pulse_zero_time = pulseZeroTime;
	_pulse_on_max_time = pulseOnMaximumTime;
	_pulse_period = pulsePeriod;
	this.setAngle(0);
	
	//pin mode
	_arduino.pinMode(_pin, true);
};


exports.getAngle = function() {
	return _angle;
};

exports.setAngle = function(angleDegree) {
	_angle = angleDegree;
	//calculates ON time
	var ratio = _angle/_max_angle;
	var ontime = Math.round( (_pulse_on_max_time-_pulse_zero_time)*ratio );
	_pulse_on_time = ontime + _pulse_zero_time;
	_pulse_off_time = _pulse_period - _pulse_on_time;
//	alert(this.pulse_on_time+" "+this.pulse_zero_time+" "+this.pulse_off_time);
	this.update();
};

exports.update = function() {
	_arduino.pulse(_pin, _pulse_on_time, _pulse_off_time);
};