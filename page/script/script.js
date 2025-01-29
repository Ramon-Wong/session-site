
function listenToServer() {
	const eventSource = new EventSource('/events');

	eventSource.onmessage = function(event) {		
		const message = JSON.parse(event.data);
		console.log(`received message: ${message}`);
	};

	eventSource.onerror = (err) => {
		console.error("EventSource Error:", err);
	};

}


document.addEventListener('DOMContentLoaded', () => {
	const appDiv			= document.getElementById('app');

	listenToServer();


});

