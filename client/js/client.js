var sock = io();

const BASE_URL = "http://api.giphy.com/v1/gifs/search?";
const LIMIT = 15;
const APIKEY = "dc6zaTOxFJmzC";
sock.on('timer', changeTime);
var username;

$("#name-button").click(function(e) {
	e.preventDefault();
	// username = $("#input-name").val();
	// $("#username").text(username);
	var temp = {};
	username = $("#input-name").val();
   	temp["name"] = username;
   	temp["score"] = 0;
   	$("#lobby").hide("fast");
	$("#main-window").show(1000);
	sock.emit('playerUpdate', temp);

});

//post scoreboard and list of users
sock.on('globalPlayers', k);
function k(datas) {
	var chat = document.getElementById('players');
	$("#players").empty();
    datas.forEach((data) => {
    	var el = document.createElement('p');
    	el.className = "user";
		el.innerHTML = data["name"] + ': ' + data["score"];
		chat.appendChild(el);
});

}

// posts messages from users in the chat 
sock.on('msg', onMessage);
function onMessage(text) {
	var chat = document.getElementById('chat-space');
	var el = document.createElement('p');
    el.className = "user-message";
	el.innerHTML = text.name + ': ' + text.value;
	chat.appendChild(el);
    chat.scrollTop = chat.scrollHeight;
    console.log(text);

    sock.emit('guess', text);
}

// posts messages from the system in the chat
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

sock.on('phraseChange', updatePhrase);
function updatePhrase(text){
	var phrase = $("#phrase-space");
	phrase.text(text);
}

// takes text from the input textbox and put it in the chat
var form = document.getElementById('chat-form');
form.addEventListener('submit', function(e) {
    var input = document.getElementById('chat-input');
    var value = input.value;
    input.value = '';
    var temp = {};
    temp["name"] = username;
    temp["value"] = value;
    sock.emit('msg', temp);
    e.preventDefault();
});

var searchForm = document.getElementById('search-form');
// When you submit the form, perform following function
searchForm.addEventListener('submit',function(e) {
	e.preventDefault();
});

function addTurnListener(id) {
    var button = document.getElementById(id);
    button.addEventListener('click', function() {
        sock.emit('turn', id);
    });
}

// When page loads, call jQuery functions
$(document).ready(function(){
	$('.gif-space').droppable();
	$('#submit').on('click', function(){
		$('#results').empty();
		var userInput = $('#search-input').val().trim();
		if (userInput) {
			$('#showResultsText').text("Showing results for ");
			$('#searchText').text(userInput);
		}
		$('#search-input').val(null);
		var query = userInput.replace(/ /g, "+");
		var queryURL = BASE_URL+'&q='+query+'&limit='+LIMIT+'&api_key='+APIKEY;
		$.ajax({url: queryURL, method: 'GET'}).done(function(response){
			console.log(response.data);
			response.data.forEach(function(element){
				let results = document.getElementById('results');
				let hints = document.getElementById('hints');
				let giphyURL = element.images.fixed_height.url;
				let gif = document.createElement('img');
				gif.setAttribute('src', giphyURL);
				gif.setAttribute('class', 'gifResults');
				gif.addEventListener('click',function() {
					hints.appendChild(gif);
				},false)
				results.appendChild(gif);
			});
		});
	});
});

function changeTime(text){
	let c = document.getElementById("time");
	c.innerHTML = text;
}

