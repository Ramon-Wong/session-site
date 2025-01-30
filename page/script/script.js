
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
	appDiv.outerHTML = `<h2>Login</h2>
						<form id="loginForm">
							<label for="first">Username:</label>
							<input type="text" id="username" name="username" placeholder="Enter your Username" required>
							<label for="password">Password:</label>
							<input type="password" id="password" name="password" placeholder="Enter your Password" required>
							<button type="submit">Submit</button>
						</form>`;

	listenToServer();

	const form = document.getElementById('loginForm');
	form.addEventListener('submit', async (event) => {
		event.preventDefault();
		const username			= form.username.value;
		const password			= form.password.value;

		try{
			const response = await fetch('/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username, password }),
			});
			
			const result = await response.json();
			if(result.success){
				console.log("this is a success");
			}else{
				console.log(result.message);
				form.username.value		= '';
				form.password.value		= '';
			}
		}catch (error) {
			console.error('Login error:', error);
		}
	});



});

