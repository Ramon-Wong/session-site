const fs				= require('fs');


function _readJSON(filePath) {
	return new Promise((resolve, reject) => {

		fs.readFile(filePath, 'utf8', (err, data) => {
			if(err)return reject(err);
			try{ resolve(JSON.parse(data));}												// Parse JSON 
			catch(parseError){	reject(parseError);}
		});

	});
}


function _sendMessage( _app, message){
	if(_app.locals.client){ 
		_app.locals.client( message );
	}else {
		console.warn('No client available to send the message.');
    }
};


function _setupSSE(req, res, next){

	res.setHeader('Content-Type', 'text/event-stream');
	res.setHeader('Cache-Control', 'no-cache');
	res.setHeader('Connection', 'keep-alive');

	req.app.locals.client = (message) => {res.write(`data: ${JSON.stringify(message)}\n\n`);};
	
	next();
}


function _addPeekaboo() {

	console.peekaboo = (message) =>{
		const error = new Error();
		const stack = error.stack.split('\n')[2].trim();
		console.log(`${stack}\t\t >> ${message}`);
	}
}


function _Authenticated( req, res, next){
	if(req.session.user){
		next();
	}else{
		res.status(401).json({ success: false, message: "Unauthorized access!", action: "redirect_login" });
	}
}


module.exports = { _readJSON, _sendMessage, _setupSSE, _addPeekaboo, _Authenticated};