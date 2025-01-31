const express																= require('express');
const session																= require('express-session');
const path																	= require('path');
const { _readJSON, _sendMessage, _setupSSE, _addPeekaboo, _Authenticated}	= require('./utils/functions.js');
const rateLimit																= require('express-rate-limit');

const	dataPath															= path.join(__dirname, 'data', 'users.json');

const app			= express();
const PORT			= 3000;
const sessionLock	= {};
const loginLimiter	= rateLimit({ 
			windowMs: 15 * 60 * 1000,
			max: 5, 													// Limit each IP to 5 login requests per window
			message: { success: false, message: "Too many login attempts. Please try again later." },
			standardHeaders: true,										// Send rate limit headers
			legacyHeaders: false,										// Disable X-RateLimit headers	
		});

_addPeekaboo();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
		secret: 'your_secret_key',
		resave: false,
		saveUninitialized: true,
		cookie: { maxAge: 15 * 60 * 1000 }								// 15 mins
	}));


// Serve static files
app.use('/script',      express.static(path.join(__dirname, 'page/script')));
app.use('/style',       express.static(path.join(__dirname, 'page/style')));
app.listen(PORT, () => {console.log(`Server running on http://localhost:${PORT}`);});


// index route
app.get('/', (req, res) => {

	if(!req.session.viewCount){	 req.session.viewCount	= 1; }else{	req.session.viewCount  += 1; }		// Ensure it's a number

	console.peekaboo(`Index page visited ${req.session.viewCount}`);
	res.sendFile(path.join(__dirname, 'page/index.html'));
});

// Login route
app.post('/login', loginLimiter, (req, res) => {
	const { username, password } = req.body;	
	console.peekaboo(`Received login request: ${username}`);

	_readJSON(dataPath)
		.then((users) => {
			const { username, password } = req.body; 													// Get submitted data			
			const user = users.find((u) => u.username === username && u.password === password);			// Find a matching user			

			if(user){
				console.peekaboo(`Your Username/password is Valid`);
				req.session.user	= { username };
				res.json({ success: true,	message: `Initialize Setup, ${username}!`, action: `setup_wa`});				
			}else{
				console.peekaboo(`Your Username/password is Wrong`);
				res.json({ success: false,	message: `Incorrect username/password, ${username}!`, action: `redirect_login`});
			}
		})
		.catch((err) => {
			console.error('Error reading JSON:', err);													// Handle errors (e.g., file not found, JSON parsing errors)
			res.status(500).send('Server error. Please try again later.');
		});	

});


// Protected route example
app.get('/dashboard', _Authenticated, (req, res) => {
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
		console.peekaboo('success log out');
		res.json({ success: true, message: "Logged out successfully", action: "redirect_login"});
	});
});


app.get('/events', _setupSSE, (req, res) => {				// when refreshed 
	
	console.peekaboo('Setup SSE Events');
	_sendMessage( app, 'Welcome to the main page');
	req.on('close', () => {		
		// req.session.destroy();
		req.app.locals.client = null;
		res.end();
	});
});


app.get('/check-auth', (req, res) => {
	if(req.session.user){ res.json({ success: true, username: req.session.user.username });
    }else{ res.json({ success: false });}
});