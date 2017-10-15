var sock = io();
sock.on('timer', changeTime);
var username = document.getElementById('username').innerHTML;

sock.on('msg', onMessage);
function onMessage(text) {
	var chat = document.getElementById('chat-space');
	var el = document.createElement('p');
    el.className = "user-message";
	el.innerHTML = username + ': ' + text;
	chat.appendChild(el);
    chat.scrollTop = chat.scrollHeight;
    console.log(text);
}

sock.on('sysNotif', onNotification);
function onNotification(text) {
    var chat = document.getElementById('chat-space');
    var el = document.createElement('p');
    el.className = "system-notification";
    el.innerHTML = text;
    console.log(text);
    chat.appendChild(el);
    chat.scrollTop = chat.scrollHeight;
}

var form = document.getElementById('chat-form');
form.addEventListener('submit', function(e) {
    var input = document.getElementById('chat-input');
    var value = input.value;
    input.value = '';
    sock.emit('msg', value);
    e.preventDefault();
});

function changeTime(text){
	let c = document.getElementById("time");
	c.innerHTML = text;
}

$(function() {
    $("#phrase").draggable({containment: "#tile"});
});
