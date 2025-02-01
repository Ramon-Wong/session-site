const { Client }				= require('whatsapp-web.js');
const EventEmitter				= require('events');
const emitter					= new EventEmitter();

const _event					= ['qr','ready','authenticated','message','disconnected'];
const _states					= {	logged_off: 0, initialize: 1, qrcode: 2, ready: 3,};


class whatsApp {

	constructor(){
		this.client				= new Client();
		this.state				= _states.logged_off;																// keeping the states of the client
		this.me;

		this.client.on(_event[0], 	   (qr) => { this.state = _states.qrcode;	emitter.emit(_event[0], qr);});		// 0. qr code
		this.client.on(_event[3], 		msg => { 								emitter.emit(_event[3], msg);});	// 3. message		
		this.client.on(_event[2],	    ()	=> {								emitter.emit(_event[2]);});			// 2. authenticated
		this.client.on(_event[4],  	    () 	=> { 								emitter.emit(_event[4]);});			// 4. disconnected
		this.client.on(_event[1], async ()	=> {
			try{
				this.state = _states.ready;
				this.me = await this.client.info.wid; emitter.emit(_event[1]); 										// 1. ready	
			}catch(err){	
				console.error('Error in ready event:', err);
			}
		});		
	};

	getMe(){ return	this.me;}

	async initialize(	handle, err_handle){ try{ await this.client.initialize();this.state = _states.initialize; handle();}catch(err){ err_handle(err);}};
	async logout(		handle, err_handle){ try{ await this.client.logout();	 this.state = _states.logged_off; handle();}catch(err){ err_handle(err);}};
	async destroy(		handle, err_handle){ try{ await this.client.destroy();	 this.state = _states.logged_off; handle();}catch(err){ err_handle(err);}};

	async sendMessages( id, message, handler, err_handler){ 
		if(this.state === _states.ready) {
			try{ 
				const resp = await this.client.sendMessage( id, message); 
				if(handler) handler(resp);
			}catch(err){ err_handler(err);}
		}else{
			err_handler('SendMessage is not ready');
		}
	}		
};


function setup_Shutdown(funct){

	process.on('SIGINT', () => {		
		funct();		// releasing other objects 
		emitter.removeAllListeners();
		process.exit(0); // Exit the process
	});	
}


module.exports = {	_whatsApp: () => new whatsApp(), setup_Shutdown, emitter, _event,};

// this.client.info.wid;