var sock = io();
sock.on('msg', onMessage);

function onMessage(text) {
	var list = document.getElementById('chat-space');
	var el = document.createElement('p');
	el.innerHTML = text;
	list.appendChild(el);
    list.scrollTop = list.scrollHeight;
}

var form = document.getElementById('chat-form');
form.addEventListener('submit', function(e) {
    var input = document.getElementById('chat-input');
    var value = input.value;
    input.value = '';
    sock.emit('msg', value);
    e.preventDefault();
});

function addTurnListener(id) {
    var button = document.getElementById(id);
    button.addEventListener('click', function() {
        sock.emit('turn', id);
    });
}

$(function() {
    $("#phrase").draggable({containment: "#tile"});
});
