const express								= require('express');
const session								= require('express-session');
const path									= require('path');

const app									= express();
const PORT									= 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
	secret: 'your_secret_key',
	resave: false,
	saveUninitialized: true,
	cookie: { secure: false }
}));

// Serve static files
app.use('/script',      express.static(path.join(__dirname, 'page/script')));
app.use('/style',       express.static(path.join(__dirname, 'page/style')));
app.listen(PORT, () => {console.log(`Server running on http://localhost:${PORT}`);});

// Hardcoded login credentials
const USERNAME = "admin";
const PASSWORD = "password123";


// index route
app.get('/', (req, res) => {
	console.log("Index page visited");
	res.sendFile(path.join(__dirname, 'page/index.html'));
});


// Login route
app.post('/login', (req, res) => {
	const { username, password } = req.body;
	if(username === USERNAME && password === PASSWORD){
		req.session.user = username;
		res.json({ success: true, message: "Login successful" });
	}else{
		res.json({ success: false, message: "Invalid credentials" });
	}
});

// Protected route example
app.get('/dashboard', (req, res) => {
	if(req.session.user) {
		res.json({ message: `Welcome, ${req.session.user}!` });
	}else{
		res.status(401).json({ message: "Unauthorized" });
	}
});

// Logout route
app.post('/logout', (req, res) => {
	req.session.destroy(err => {
		if(err){return res.status(500).json({ message: "Logout failed" });}
		res.json({ success: true, message: "Logged out successfully" });
	});
});
