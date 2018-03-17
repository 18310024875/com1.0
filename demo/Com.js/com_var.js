(function(w){
	window.log   = console.log ;
	window.error = console.error ;
	window.warn  = console.warn ;

	w.Com = function (option){

		var readyOption = Com.template( option );

		var routes = option.routes ;
		if( routes ){
			Com.router = new Com.Router( routes );
			Com.router.ROOT = new Com.component( readyOption ) ;
			return Com.router.ROOT ;
		}else{
			return new Com.component( readyOption );
		}
	}

}( window ));