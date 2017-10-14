var sock = io();
sock.on('msg',onMessage);
function onMessage(text) {
	var list = document.getElementById('chat');
	var el = document.createElement('li');
	el.innerHTML = text;
	list.appendChild(el);
}

onMessage('Hi');
onMessage('I am connected');
