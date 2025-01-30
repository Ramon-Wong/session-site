

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


function loadDashboard() {	
	const appDiv = document.getElementById('app');
	appDiv.outerHTML = `<div id='app'><h2>Dashboard</h2>
						<button id="logoutButton">Logout</button></div>`;

	console.log("[Client] Dashboard loaded. Listening to server events...");
	listenToServer();

	document.getElementById('logoutButton').addEventListener('click', async () => {
		console.log("[Client] Logout button clicked.");
		try{
			const response = await fetch('/logout', { method: 'POST' });
			const result = await response.json();

			if(result.success) {
				console.log("[Client] Successfully logged out. Redirecting to login page...");
				loadLoginPage();
			}else{
				console.error("[Client] Logout failed:", result.message);
			}
		}catch(error){
			console.error("[Client] Logout error:", error);
		}
	});
}


function loadLoginPage() {
	const appDiv = document.getElementById('app');
	appDiv.outerHTML = `<div id='app'><h2>Login</h2>
							<form id="loginForm">
								<label for="username">Username:</label>
								<input type="text" id="username" name="username" required>
								<label for="password">Password:</label>
								<input type="password" id="password" name="password" required>
							<button type="submit">Submit</button>
						</form></div>`;

	console.log("[Client] Login page loaded.");
	listenToServer();

	document.getElementById('loginForm').addEventListener('submit', async (event) => {
		event.preventDefault();
		const username = event.target.username.value;
		const password = event.target.password.value;

		console.log("[Client] Attempting to log in as:", username);

		try{const response = await fetch('/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username,password })});
			const result = await response.json();
            if(result.success){
				console.log("[Client] Login successful! Loading dashboard...");
				loadDashboard();
            }else{
				console.log("[Client] Login failed:", result.message);
				event.target.username.value = '';
				event.target.password.value = '';
			}
		}catch(error){
			console.error("[Client] Login error:", error);
		}
	});
}


document.addEventListener('DOMContentLoaded', async () => {

	try{
		const response = await fetch('/check-auth');
		const result = await response.json();

		if (result.success) {
			console.log("[Client] User is authenticated. Loading dashboard...");
			loadDashboard();
		} else {
			console.log("[Client] User not authenticated. Redirecting to login...");
			loadLoginPage();
		}

	}catch(error){
		console.error("[Client] Auth check failed:", error);
		loadLoginPage();
	}
});
