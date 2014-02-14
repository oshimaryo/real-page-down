/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */


const {Cc,Ci,Cr} = require("chrome");
var arduino = require("arduino.js");
var servo = require("servo.js");
var timers = require("sdk/timers");
var cm = require("context-menu");
var tabs = require("sdk/tabs");
var pins = [
    {number:13, timerid: -1},
    {number:12, timerid: -1},
    {number:11, timerid: -1},
    {number:10, timerid: -1},
    {number:9, timerid: -1},
    {number:8, timerid: -1},
    {number:7, timerid: -1},
    {number:6, timerid: -1},
    {number:5, timerid: -1},
    {number:4, timerid: -1},
    {number:3, timerid: -1},
    {number:2, timerid: -1}
];

var count = 0;
var id;
var pin = 9;
var max_angle = 180;
var pulse_period = 20000;
var pulse_zero_time = 1800;
var pulse_on_maximum_time = 1050;


function p(){
    servo.setAngle(80);
    timers.setTimeout(pp,500);
    count++;
    if(count%10 === 0){
        timers.clearInterval(id);
    }
}

function pp(){
    servo.setAngle(180);
}


var PageDown = {
    init: function(){
        arduino.open("/dev/cu.usbmodem1411");
        for (var i = 0, n = pins.length; i < n; i++) {
            arduino.pinMode(pins[i].number, true);
        }
        servo.Servo(arduino, pin, max_angle, pulse_period, pulse_zero_time, pulse_on_maximum_time);
        this.process();
    },
    process: function(){
        servo.setAngle(90);
        id =timers.setInterval(p,1000);
    },
    close: function(){
        servo.setAngle(180);
        timers.clearInterval(id);
    }
};


cm.Item({
    label: "Real PageDown",
    context: cm.SelectionContext(),
    contentScript:  'self.on("click", function (node, data) {' +
                    '  self.postMessage("context");' +
                    '});',
    onMessage: function(){
        console.log("RealPageDown clicked");
        PageDown.init();
    }
});


tabs.on('close',function(tab){
    PageDown.close();
});

