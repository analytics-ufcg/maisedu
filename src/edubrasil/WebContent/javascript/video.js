function Video(state) {
		
		var div = document.getElementById("idVideo");
		var iframe = div.getElementsByTagName("iframe")[0].contentWindow;
		div.style.display = state == 'hide' ? 'none' : '';
		func = state == 'hide' ? 'pauseVideo' : 'playVideo';
		iframe.postMessage('{"event":"command","func":"' + func + '","args":""}', '*');
	}
	
	function criaCookie(chave, value) { 
		var expira = new Date(); 
		expira.setTime(expira.getTime() + 25375000000); 
		//expira dentro de 1 semana 
		document.cookie = chave + '=' + value + ';expires=' + expira.toUTCString(); 
	} 
	
	function lerCookie(chave) { 
		var ChaveValor = document.cookie.match('(^|;) ?' + chave + '=([^;]*)(;|$)'); 
		return ChaveValor ? ChaveValor[2] : null; 

	}

	function checkCokie(name) {
		if (lerCookie(name) == 'iniciar_video') {
			//alert(lerCookie(name));
			Video('hide');
		}
		else{
			document.getElementById('botao').click();
			criaCookie(name, 'iniciar_video');
		}	
	} 
