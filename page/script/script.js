


document.addEventListener('DOMContentLoaded', () => {
	const appDiv			= document.getElementById('app');
	// const eventSource		= new EventSource('/events');




	// eventSource.onopen		= function(event) {		console.log('Connection to server opened.');};

	// eventSource.onmessage	= function(event) {
	// 	console.log(event.data);
	// 	// const message = JSON.parse(event.data);
	// 	// if(message.HELLO	&& message.message == '....	is ready!'){			console.log("Ready? Lets see what shall we do?");}
	// 	// if(message.AUTH		&& message.message == 'user is authenticated!'){	console.log("Authenticated");}
	// };

	// eventSource.onerror		= function(event) {
	// 	console.error('Error with SSE connection:', event);
	
	// 	appDiv.innerHTML = `<h2>Server Down!!</h2>
	// 						<div id="initialize" class="dots"></div>`;
	
	// 	if(eventSource.readyState === EventSource.CLOSED) {
	// 		console.log('Connection closed');
	// 	}
	// };
});

