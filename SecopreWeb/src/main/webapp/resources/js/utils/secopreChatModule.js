/*utilidades*/
utils = new SecopreUtils();

baseSocketURL = utils.Constants.SOCKET_URL;

urls = {
		chat : utils.Constants.SOCKET_URL,
		updateSeen : utils.Constants.SOCKET_URL + "v1/chat/updateSeen/",
		getConversation : utils.Constants.SOCKET_URL + "v1/chat/getConversation/",
		getConversations : utils.Constants.SOCKET_URL + "v1/chat/getConversations/",
		getFrecuentUsers : utils.Constants.SOCKET_URL +  "v1/chat/getFrecuentUsers/",
		createConversation : utils.Constants.SOCKET_URL + "v1/chat/createConversation/",
		getMoreMessages : utils.Constants.SOCKET_URL +  "v1/chat/getMoreMsgs/",
		getConversationId : utils.Constants.SOCKET_URL + "v1/chat/getConversationId/",
		ping : utils.Constants.SOCKET_URL + "v1/",
}

function replaceURLBasePath(newUrl, urls){
	urls.chat = newUrl;
	urls.updateSeen = newUrl + "v1/chat/updateSeen/";
	urls.getConversation = newUrl + "v1/chat/getConversation/";
    urls.getConversations = newUrl + "v1/chat/getConversations/";
    urls.getFrecuentUsers = newUrl +  "v1/chat/getFrecuentUsers/";
    urls.createConversation = newUrl + "v1/chat/createConversation/";
    urls.getMoreMessages = newUrl +  "v1/chat/getMoreMsgs/";
    urls.getConversationId = newUrl + "v1/chat/getConversationId/";
    urls.ping = newUrl + "v1/";
}


/*modulo de chat*/
var SecopreChat = function(){
	
	var self = this;
	/* propiedades internas del modulo */
	this.userId = -1;
	this.socket = {};
	
	this.windowState = "close";
	
	/*-------------------------------------------------------------------------------------
		UTILERIAS
	--------------------------------------------------------------------------------------*/

	/*
	 * funcion privada para realizar peticion ajax y ejecutar callback con los resultados
	 */
	function _getAjaxRequest(urlRequest, callback ){
		$.ajax({
			url: urlRequest,
			dataType: 'json'
		}).done(function(r) {
			callback(r);
		});
	}
	
	/*
	 * funcion privada para activar una plantilla 
	 */
	function _activateTemplate(id) {
		console.log("cargando plantilla: " + id);
	    var t = document.querySelector(id);
	    return document.importNode(t.content, true);
	}

	/*
	 * funcion privada para actualizar el estatus del encabezado del sidebar 
	 */
	function _updateSideBarHeader(type, name, cId, userId, avatar){
		var complexNav = $('.sp__nav__comp');
		if (type == 'chat'){
			$('.page-quick-sidebar-wrapper').find('.page-quick-sidebar-chat').addClass("page-quick-sidebar-content-item-shown");
			$('.sp__nav__basic').css("cssText", "display: none !important;");
			complexNav.css("cssText", "display: table-cell !important;");
		}else{
			$('.sp__nav__basic').css("cssText", "display: table-cell !important;");
			complexNav.css("cssText", "display: none !important;");
		}
		complexNav.find('a').html(name);
	    complexNav.attr('cId', cId);
	    complexNav.attr('userId', userId);
	    complexNav.attr('avatar', avatar);
	}

	/*
	 * funcion privada para actualizar el contador de conversaciones pendientes del id recibido
	 */
	function _updateNotificationCounter(id, value){
		console.log("actualizando contador");
		var counter = $(id);
		if (value == 0 ){
			counter.hide();
		}else{
			counter.show().html(value);
		}
	}

	/*
	 * funcion privada para actualizar mensaje de en bandeja de inbox al ser visto
	 */
	function _updateInboxMessageAsSeen(cId){
		/*se actualiza el estatus de la conversacion*/
		var conversation = $('[data-inbox-message][data-cId="'+ cId +'"]');
		conversation.removeClass();
		conversation.attr('class', 'sp__message__readed');
		
		var currentPending = parseInt($("#new_messages_badge").text());
		if (currentPending > 0){
			if ((currentPending - 1 ) > 0){
				$('#sp_new_msgs_mumber').html(currentPending - 1);
			}else{
				$('#sp_new_messages_label').html("No hay mensajes nuevos");
			}
			_updateNotificationCounter("#new_messages_badge", currentPending - 1);
		}
	}

	/*
	 * funcion privada para actualizar mensaje en sidebar de conversaciones al ser visto
	 */
	function _updateConversationMessageAsSeen(cId){
		var conversation = $('[data-conversation][data-cId="'+ cId +'"]');
		conversation.find('[data-cStatus]').html('');
		var currentPending = parseInt($('#pndConvCounter').text());
		if (currentPending > 0){
			_updateNotificationCounter('#pndConvCounter', currentPending - 1);
		}
	}

	/*
	 * funcion privada que retorna el alto de un elemento para hacer scroll
	 */
	function _getElementHeigth(id) {
		var e = $(document).find(id);
        var height = 0;
		e.find(".post").each(function() {
        	height = height + $(this).outerHeight();
        });
        return height;
    }

    /*
	 * funcion interna para agregar el attributo de fuente al boton regresar del chat
	 */
	function _addChatSource(source){
		$('#chatReturnButton').attr('data-source', source);
	}

	/*
	 * funcion privada para generar objeto de datos a partir de objeto jQuery de conversacion
	 */
	function _getConversationObject(c){
		var conversation = {};
	    conversation.userId = $(c).attr("data-userId");
	    conversation.userName = $(c).attr("data-userName");
	    conversation.id = $(c).attr("data-cId");
	    conversation.dir = $(c).attr('data-dir');
	    conversation.status = parseInt($(c).attr('data-status'));
	    conversation.avatar  = $(c).find('[data-avatar]').attr('src');
	    return conversation;
	}
	
	/*
	 * funcion para actualizar el estatus del visto en el dom para que no truene 
	 */
	function _updateInDOM(c){
		$('[data-inbox-message][data-cId="' + c.id + '"]').attr('data-status', 1);
		$('[data-conversation][data-cId="' + c.id + '"]').attr('data-status', 1);
	}

	/*
	 * funcion para agregar un nuevo msj al chat
	 */
	function _addMessageToChat(dir, data){
		var className = "";
		var avatar = "";
		var userName = "";

		if (dir == 'IN'){
			className = 'post in';
			avatar =  $('.sp__nav__comp').attr('avatar');
			userName =  $('.sp__nav__comp').find('a').html();
		}else{
			className = 'post out';
			avatar = $('#loggedUserAvatar').attr('src');
			userName = $('.username').html();
		}
		
		var element = _activateTemplate("#chat_message");				
		
		element.querySelector("[msg]").className = className;
		element.querySelector("[data-avatar]").src = avatar;
		element.querySelector("[data-username]").innerHTML = userName;
		element.querySelector("[data-msg-body]").innerHTML = data.msg;
		element.querySelector("[data-time]").innerHTML= 'Ahora';			
		
		var chatContainer = $(document).find("#chat_container");
		chatContainer.append(element);
		
		//scroll
		var alto = _getElementHeigth('#chat_container');
        chatContainer.slimScroll({
            scrollTo: alto
        });
	}

	/*
	 * funcion para actualizar sidebar cuando llegue un nuevo msg
	 */
	function _processNewMessageInSidebar(data){
		self.loadAllConversations();
	}

	/*
	 * function privada para actualizar el estado de un usuario frecuente
	*/
	function _updateFrecuentUserStatus(userId, online){		
		var list = document.querySelector('#frecuent__users__list');
		var element = list.querySelector('[data-userId="'+userId+'"]');
		if(online){
			$(element).find('[data-online]').show();
			$(element).find('[data-lastConnection]').hide();
		}else{
			$(element).find('[data-online]').hide();
			$(element).find('[data-lastConnection]').show();
			$(element).find('[data-lastConnection]').html('Justo Ahora');
		}
	}
	
	function _updatePopupLabel(pendingMessages){
		var numberMessagesBadge = $(document).find('#sp_new_msgs_mumber');
		
		//si en dom existen msjs pendientes
		if (numberMessagesBadge.length > 0){
			//si en ajax hay mensajes pendientes
			if (pendingMessages > 0){
				document.querySelector("#sp_new_msgs_mumber").innerHTML = pendingMessages;
				$("#new_messages_badge").html(pendingMessages);
			//si en ajax no hay mensajes pendientes
			}else{
				$('#sp_new_messages_label').html("No hay msjs nuevos");
				$("#new_messages_badge").hide();
			}
		//si en dom no existen mensajes pendientes
		}else{
			//si existen mensajes pendientes en ajax
			if (pendingMessages > 0){
				$('#sp_new_messages_label').html('Tiene <span id="sp_new_msgs_mumber" class="bold">1</span> Nuevo(s) Mensajes(s)');
				$(document).find('#sp_new_msgs_number').text(pendingMessages);
				$("#new_messages_badge").show().text(pendingMessages);
			}
		}
	}

	/*-------------------------------------------------------------------------------------
		FUNCIONES DE PROCESAMIENTO
	--------------------------------------------------------------------------------------*/
	
	/*
	 * funcion privada para procesar la informacion inicial de chat (carga el popup)
	 */
	function _processInitialData(r){
		//se oculta leyenda "no existen mensajes"
		if (r.length > 0){ 
			$("#no__inbox__msgs").hide(); 
		}
		//limpiamos el listado
		$("#inbox__popup__msgs__list").empty();
		
		var pendingMessages = 0;
		//iteracion sobre los resultados
		$.each(r, function(){
			var element = _activateTemplate(utils.Constants.Templates.INBOX_TEMPLATE);
			
			element.querySelector("[data-user]").innerHTML = this.userName;
			element.querySelector("[data-time]").innerHTML = utils.DateUtils.getUXDate(utils.DateUtils.getDateFromDBString(this.creationDate));		
			element.querySelector("[data-message]").innerHTML = ((this.msg.length > 25) ? this.msg.substring(0,23) + "..." : this.msg);

			var itemClass = "sp__message__readed";
			if(this.dir == 'IN' && parseInt(this.status) == 0){
				pendingMessages += 1;
				itemClass = "sp__message__pending";
			}
			var listItem = element.querySelector("[data-inbox-message]");
			listItem.className = itemClass;
			
			var $li = $(listItem);
			$li.attr('data-userid', this.userId);
			$li.attr('data-username', this.userName);
			$li.attr('data-cId', this.cId);
			$li.attr('data-dir', this.dir);
			$li.attr('data-status', this.status);
			
			element.querySelector("[data-avatar]").src = utils.Constants.USER_BASE_PATH + this.avatar;
			
			$("#inbox__popup__msgs__list").append(element);
		});	
		
		_updatePopupLabel(pendingMessages);
	}
	
	/*
	 * funcion privada para actualizar el estatus del msg cuando el usuario lo ve
	 */
	function _updateSeen(c, callback){
		
		/*actualiza el estatus si es necesario*/
		if (c.dir == 'IN' && c.status == 0){
			$.ajax({
				url: urls.updateSeen + c.id,
				dataType: 'json'
			}).done(function(r) {
				if (parseInt(r.affectedRows) > 0){
					callback(c, r);
				}else{
					alert("Error de conexion con API de mensajeria");
				}
			});
		}else{
			callback(c,{});
		}
	}
	
	function _updateSeenFromLiveChat(cId, callback){
		$.ajax({
			//url: "http://localhost:3000/v1/chat/updateSeen/" + cId,
			url : urls.updateSeen + cId,
			dataType: 'json'
		}).done(function(r) {
			if (parseInt(r.affectedRows) > 0){
				callback();
			}else{
				alert("Error de conexion con API de mensajeria");
			}
		});
	}
	
	/*
	 * funcion para abrir el chat y cargar la conversacion
	 */
	function _processConversation(c, res){
		
		if (c.dir == 'IN' && c.status == 0){
			_updateInboxMessageAsSeen(c.id);
			_updateConversationMessageAsSeen(c.id);
			_updateInDOM(c);
		}
		
		$("#chat_container").empty();
		
		_updateSideBarHeader('chat', c.userName, c.id, c.userId, c.avatar);
        
        $('.post.in .message .name').empty().html(c.userName);
        
        //bloqueo de pantalla si la conversacion viene de popup
        if (c.source == 'popup'){
        	Metronic.blockUI({ target: '.page-container', textOnly: true,  message: '' });
        	Metronic.blockUI({ target: '.page-header', textOnly: true, message: '' });
		}

        var chatContainer = $(document).find(".page-quick-sidebar-chat-user-messages");
        
        //var url =  "http://localhost:3000/v1/chat/getConversation/" + c.id + "/" + c.userId;
		var url = urls.getConversation + c.id + "/" + c.userId;
        
		_getAjaxRequest(url, function(data){
			var total = data.length;			
			var batch = 20;
			
			if (total < batch){batch = total;}
			
			for(var i = 0; i< batch; i++){
				e = data[i];
				
				var element = _activateTemplate("#chat_message");				
				element.querySelector("[msg]").className = (e.direction == 'IN' ? 'post out' : 'post in');
				element.querySelector("[data-avatar]").src = utils.Constants.USER_BASE_PATH + e.avatar;
				element.querySelector("[data-username]").innerHTML = e.userName;
				element.querySelector("[data-msg-body]").innerHTML = e.msg;
				element.querySelector("[data-time]").innerHTML= utils.DateUtils.getUXTimeFromDBDate(e.creationDate);				
				chatContainer.prepend(element);			
			}
			
			var totalMsgs = chatContainer.find('.post').length;
			
			//scroll hacia el ultimo mensaje
	        chatContainer.slimScroll({
	            scrollTo: _getElementHeigth("#chat_container")
	        });
	        
	        if ((total > 20) && (total % 20) > 0){
	        	var more = _activateTemplate('#has_more_msgs');
	        	$(more).find('#load_more_msgs').attr('msgs', totalMsgs);
	        	chatContainer.prepend(more);
	        }
			
		});	
        
		/*se agrega la fuente de invocacion al chat*/
		_addChatSource(c.source);
	}
	
	/*
	 * funcion interna para cargar todas las conversaciones en el sidebar
	 */
	function _processAllConversations(r){
		
		console.log("procesando mensajes: " + r.length);
		
		if (!($('body').hasClass('page-quick-sidebar-open'))){
			
			$('body').addClass('page-quick-sidebar-open'); 
			//bloqueo de pantalla
		    Metronic.blockUI({ target: '.page-container', textOnly: true,  message: '' });
		    Metronic.blockUI({ target: '.page-header', textOnly: true, message: '' });
		};
		
		//se oculta leyenda "no existen mensajes"
		if (r.length > 0){ 
			$("#all_conversations_container").empty();
		}
		
		var pendingMessages = 0;
		//iteracion sobre los resultados
		$.each(r, function(){
			var element = _activateTemplate(utils.Constants.Templates.CONVERSATION_TEMPLATE);
			
			element.querySelector("[data-user]").innerHTML = this.userName;
			element.querySelector("[data-time]").innerHTML = utils.DateUtils.getUXDate(utils.DateUtils.getDateFromDBString(this.creationDate));		
			element.querySelector("[data-msg]").innerHTML = ((this.msg.length > 25) ? this.msg.substring(0,23) + "..." : this.msg);

			var listItem = element.querySelector("[data-conversation]");
			
			var $li = $(listItem);
			$li.attr('data-userId', this.userId);
			$li.attr('data-userName', this.userName);
			$li.attr('data-cId', this.cId);
			$li.attr('data-dir', this.dir);
			$li.attr('data-status', this.status);
			
			element.querySelector("[data-avatar]").src = utils.Constants.USER_BASE_PATH + this.avatar;
			
			var status = element.querySelector('[data-cStatus]');
			
			var statusContent = "";
			if (this.dir == 'IN'){
				if (this.status == 0){
					statusContent = '<span class="badge badge-danger"> </span>';
					pendingMessages += 1;
				}
			}else{
				statusContent = (this.status == 0 ? '<i class="fa fa-share"></i>' : '<i class="fa fa-check"></i>');
			}
			
			status.innerHTML = statusContent;
			
			$("#all_conversations_container").append(element);
		});	
		
		console.log("actualizando contador de mensajes pendientes: " + pendingMessages);
		
		_updateNotificationCounter("#pndConvCounter", pendingMessages);
	}
	
	/*
	 * funcion interna para procesar los resultados de la busqueda de usuarios 
	 */
	function _processUsersSearch(r){
		
			$('#finded_users_list').empty();
			if(r.length > 0){
				$('#finded_users').html("Usuarios Encontrados:");
			}else{
				$('#finded_users').html("No hay coincidencias...");
			}
		
		$.each(r, function(){
			var element = _activateTemplate(utils.Constants.Templates.FINDED_USER_TEMPLATE);
			
			var item = element.querySelector("[data-findedUser]");
			
			var $item = $(item);
			$item.attr('data-userId', this.userId);
			$item.attr('data-userName', this.userName);
			$item.attr('data-cId', this.cId);
			
			element.querySelector("[data-avatar]").src = utils.Constants.USER_BASE_PATH + this.avatar;
			element.querySelector("[data-name]").innerHTML = this.userName;
			element.querySelector("[data-employment]").innerHTML = this.employment;
			
			if(parseInt(this.online) == 0){
				element.querySelector("[data-lastConnection]").innerHTML = utils.DateUtils.getUXDate(utils.DateUtils.getDateFromDBString(this.lastConnection));
				$item.find('[data-online]').hide();
			}
			
			$("#finded_users_list").append(element);
		});	
	}
	
	/*
	 * funcion interna para actualizar los usuarios frecuentes de la pestaña de usuarios
	 */
	function _processFrecuentUsers(r){

		if(r.length > 0){
			$('#NoFrecuentUsrsMsgs').hide();
			$('#frecuent__users__list').empty();
		}
		
		$.each(r, function(){
			var element = _activateTemplate(utils.Constants.Templates.FRECUENT_USERS_TEMPLATE);
			
			var item = element.querySelector("[data-frecuentUser]");
			
			var $item = $(item);
			$item.attr('data-userId', this.userId);
			$item.attr('data-userName', this.userName);
			$item.attr('data-cId', this.cId);
			
			element.querySelector("[data-avatar]").src = utils.Constants.USER_BASE_PATH + this.avatar;
			element.querySelector("[data-name]").innerHTML = this.userName;
			element.querySelector("[data-employment]").innerHTML = this.employment;
			
			if(parseInt(this.online) == 0){
				element.querySelector("[data-lastConnection]").innerHTML = utils.DateUtils.getUXDate(utils.DateUtils.getDateFromDBString(this.lastConnection));
				$item.find('[data-online]').hide();
			}
			
			$("#frecuent__users__list").append(element);
		});	
	}
	

	/*
	 * funcion interna para procesar un nuevo mensaje
	 */
	function _processNewMessage(data){		
		
		if (self.windowState == 'close'){
			self.loadInitialData();
		}else if (self.windowState == 'sidebar'){
			_processNewMessageInSidebar(data);
		}else{
			var currentConvId = parseInt($('.sp__nav__comp').attr('cId'));
			if (currentConvId == data.cId){
				
				_addMessageToChat('IN', data);
				
				//se actualiza a visto
				_updateSeenFromLiveChat(data.cId, function(){
					self.loadInitialData();	
					self.loadAllConversations();
				});
				
			}else{
				_processNewMessageInSidebar(data);
			}
		}
	};
	
	/************************************************************************************************************************
	 	FUNCIONES PUBLICAS DEL SERVICIO CHAT
	 ************************************************************************************************************************/
	
	/*funcion para cargar el popup*/
	this.loadInitialData = function(){
		/*carga informacion de popup*/
		//_getAjaxRequest("http://localhost:3000/v1/chat/getConversations/" + this.userId + "/0/6", _processInitialData);
		_getAjaxRequest(urls.getConversations + this.userId + "/0/6", _processInitialData);
		
		/*carga informacion de usuarios frecuentes*/
		this.loadFrecuentUsers();
	};
	
	/*funcion para actualizar el estado de los usuarios frecuentes*/
	this.loadFrecuentUsers = function(){
		//_getAjaxRequest("http://localhost:3000/v1/chat/getFrecuentUsers/" + this.userId , _processFrecuentUsers);
		_getAjaxRequest(urls.getFrecuentUsers + this.userId, _processFrecuentUsers);
	};
	
	
	/*funcion para mostrar conversacion*/
	this.loadConversation = function(c, source){
		if (!($('body').hasClass('page-quick-sidebar-open'))){
			$('body').toggleClass('page-quick-sidebar-open');
		}
	
		var conv = _getConversationObject(c);
		conv.source = source;
		
		if(conv.id == -1){
			//se crea la conversacion
			//var url = "http://localhost:3000/v1/chat/createConversation/" + this.userId + "/" + conv.userId;
			var url = urls.createConversation + this.userId + "/" + conv.userId;
			
			_getAjaxRequest(url, function(r){
				conv.id = r.cId;
				$(c).attr('data-cId', r.cId);
				self.socket.emit('new_cId', {"cId": r.cId, "me" : me, "userId": usr});
				_updateSeen(conv, _processConversation);
			});
		}else{
			_updateSeen(conv, _processConversation);
		}
			    
	};
	
	/*funcion para mostrar todas las conversaciones*/
	this.loadAllConversations = function (){
		var userId = parseInt( $("#loggedUserId").val());
		console.log("cargando conversaciones de usuario: " + userId);
		//_getAjaxRequest("http://localhost:3000/v1/chat/getConversations/" + userId + "/0/11", _processAllConversations);
		_getAjaxRequest(urls.getConversations + userId + "/0/11", _processAllConversations);
	};
	
	/*funcion para cerrar conversacion*/
	this.closeConversation = function(){
		$('.page-quick-sidebar-wrapper .page-quick-sidebar-chat').removeClass("page-quick-sidebar-content-item-shown");
		_updateSideBarHeader('conv', null, null, null, null);
	};
	
	/*funcion para cerrar el panel lateral*/
	this.closeLateralPanel = function(){
		$('body').removeClass('page-quick-sidebar-open'); 
	    //desbloqueo de pantalla
	    Metronic.unblockUI('.page-container');
	    Metronic.unblockUI('.page-header');
	};
	
	/*funcion para agregar la fuente al chat*/
	this.addChatSource = function(source){
		_addChatSource(source);
	};

	/*
	 * funcion para enviar un msj (logica que se ejecuta en el usuario que envia el msj)
	 */
	this.sendMessage = function(e){
		e.preventDefault();
		var input = $('.page-quick-sidebar-chat-user-form .form-control');
        var msg = input.val();
		var cId = $('.sp__nav__comp').attr('cId');
		var userId = $('.sp__nav__comp').attr('userId');
		var data = {"cId":cId, "me":self.userId, "userId":userId, "msg":msg};
		
		this.socket.emit('new_message', data);
		
		_addMessageToChat('OUT', data);
		
		input.val('');
	};
	
	
	this.handleSearch = function(userName){
		if(userName.length > 0){
			this.socket.emit('search_user', {"me": this.userId, "userName": userName});
	    	$('#finded_users').show();
	    	$('#finded_users_list').show();
	    }else{
	    	$('#finded_users').hide();
	    	$('#finded_users_list').empty().hide();
	    }
	};
	
	this.loadMoreMessages = function(from){
		var chatHeader = $('.sp__nav__comp');
		var cId = chatHeader.attr('cId');
		var userId = chatHeader.attr('userId');
				
		var chatContainer = $(document).find(".page-quick-sidebar-chat-user-messages");
        
        //var url =  "http://localhost:3000/v1/chat/getMoreMsgs/" + cId + "/" + userId + "/" + from;
        var url = urls.getMoreMessages + cId + "/" + userId + "/" + from;
		
		_getAjaxRequest(url, function(data){
			
			var total = data.length;
			
			var batch = 20;
			if (total < batch){
				batch = total;
			}
			chatContainer.find('#load_more_msgs').remove();
			
			for(var i = 0; i< batch; i++){
				e = data[i];
				
				var element = _activateTemplate("#chat_message");				
				element.querySelector("[msg]").className = (e.direction == 'IN' ? 'post out' : 'post in');
				element.querySelector("[data-avatar]").src = utils.Constants.USER_BASE_PATH + e.avatar;
				element.querySelector("[data-username]").innerHTML = e.userName;
				element.querySelector("[data-msg-body]").innerHTML = e.msg;
				element.querySelector("[data-time]").innerHTML= utils.DateUtils.getUXTimeFromDBDate(e.creationDate);				
				chatContainer.prepend(element);			
			}
			
			var totalMsgs = chatContainer.find('.post').length;
	        if ((total > 20) && (total % 20) > 0){
	        	var more = _activateTemplate('#has_more_msgs');
	        	$(more).find('#load_more_msgs').attr('msgs', totalMsgs);
	        	chatContainer.prepend(more);
	        }
			
		});	
		
	}
	
	/************************************************************************************************************************
 		FUNCIONES DE SOCKET
	 ************************************************************************************************************************/
	
	this.initSocket = function(){
		
		var data = {"userId" : this.userId};
		
		this.socket = io.connect(urls.chat, {query :'data=' + JSON.stringify(data) });
		
		this.socket.on('load_active_users', function(r){
			if(r.length > 0){
				$('#not__online__users__msg').hide();
				$('#online__users__list').empty();
			}
			
			$.each(r, function(){
				
				var isFrecuentUser = $('[data-frecuentUser][data-userId="'+this.userId+'"]').length;
				
				if (isFrecuentUser){
					_updateFrecuentUserStatus(this.userId, true);
				}else{
				
					var element = _activateTemplate(utils.Constants.Templates.ONLINE_USER_TEMPLATE);
					
					var item = element.querySelector("[data-onlineUser]");
					
					var $item = $(item);
					$item.attr('data-userId', this.userId);
					$item.attr('data-userName', this.userName);
					$item.attr('data-cId', this.cId);
					
					element.querySelector("[data-avatar]").src = utils.Constants.USER_BASE_PATH + this.avatar;
					element.querySelector("[data-name]").innerHTML = this.userName;
					element.querySelector("[data-employment]").innerHTML = this.employment;
					
					$("#online__users__list").append(element);
					
				}
			});	
		});
		
		this.socket.on('chat_new_user', function(data){
			
			var nUser = data[0].userId;
			
		    //var url = "http://localhost:3000/v1/chat/getConversationId/" + self.userId + "/" + nUser;
		    var url = urls.getConversationId + self.userId + "/" + nUser;
			_getAjaxRequest(url, addNewUser);
			
			function addNewUser(r){
				
				var u = data[0];
				var isFrecuentUser = $('[data-frecuentUser][data-userId="'+u.userId+'"]').length;
				
				if (isFrecuentUser == 1){
				
					_updateFrecuentUserStatus(u.userId, true);
				
				}else{
		
					var element = _activateTemplate(utils.Constants.Templates.ONLINE_USER_TEMPLATE);
					var item = element.querySelector("[data-onlineUser]");
					
					var $item = $(item);
					$item.attr('data-userId', u.userId);
					$item.attr('data-userName', u.userName);
					$item.attr('data-cId', r[0].cId);
					
					element.querySelector("[data-avatar]").src = utils.Constants.USER_BASE_PATH + u.avatar;
					element.querySelector("[data-name]").innerHTML = u.userName;
					element.querySelector("[data-employment]").innerHTML = u.employment;
					
					$("#online__users__list").append(element);
				}
				
				if ($('[data-onlineUser]').length > 0){
					$('#not__online__users__msg').hide();
				}
			}
			
		});
		
		this.socket.on('chat_user_leave', function(data){
			
			var isFrecuentUser = $('[data-frecuentUser][data-userId="'+data[0].userId+'"]').length;
			
			if (isFrecuentUser == 1){
				_updateFrecuentUserStatus(data[0].userId, false);
			}else{
				$('[data-onlineUser][data-userId="'+ data[0].userId +'"]').remove();
			}
			
			if ($('[data-onlineUser]').length > 0){
				$('#not__online__users__msg').hide();
			}
		});

		this.socket.on('complement_cId', function(data){
			$('[data-onlineUser][data-userId="'+ data.userId +'"]').attr('data-cId', data.cId);
		});
		
		this.socket.on('new_message_received', function(data){
			_processNewMessage(data);
		});
		
		this.socket.on('update', function(data){
			self.loadInitialData();
			self.loadAllConversations();
		});
		
		this.socket.on('search_user_result', function(data){
			_processUsersSearch(data);
		});
	};
}

/*inicalizacion de objeto base*/
var Chat = new SecopreChat();

/*carga de datos al iniciar el documento*/
$(document).ready(function(){

	var userId = parseInt( $("#loggedUserId").val());
	var userHasChatModule = Boolean ($("#chatModuleActive").val());
	var socketURL = $("#socketURL").val();
	
	if (userHasChatModule){
		
		utils.Constants.SOCKET_URL = socketURL;
		
		//ping al server para validar si existe
		replaceURLBasePath(socketURL, urls);
		
		var miUrl = urls.ping;	
		console.log(miUrl);
		
		$.ajax({
		      type: "GET",
		      url: miUrl,
		      success: function (response) {
		    	
		    	Chat.userId = userId;
		  		Chat.loadInitialData();
		  		Chat.initSocket();
		  		
		  		$('#finded_users').hide();
		      	$('#finded_users_list').hide();
		      },
		      error: function (xhr, ajaxOptions, thrownError) {
		    	  $("#header_inbox_bar").hide();
		      }
		});
		
	}else{
		$("#header_inbox_bar").hide();
	}
});


/*------------------------------------------------------------------------------------------
	Eventos sobre popup de conversaciones
-------------------------------------------------------------------------------------------*/

/*evento al hacer click en los elementos del menu popup*/
$(document).on('click','.dropdown-menu-list.scroller li', function (e){
	if(!$(this).hasClass("notification")){
		Chat.loadConversation(this, 'popup');
		Chat.windowState = 'chat';
	}
});

/*evento para mostrar todas las conversaciones*/
$(document).on('click', '.sp__aux__view__all', function (e) {
    Chat.loadAllConversations();
    Chat.windowState = 'sidebar';
});

/*------------------------------------------------------------------------------------------
	Eventos sobre panel lateral de conversaciones
-------------------------------------------------------------------------------------------*/

/*evento para controlar el click sobre el tab de conversaciones*/
$(document).on('click', '#conversationTab', function(){
	Chat.loadAllConversations();
	Chat.windowState = 'sidebar';
});

/*evento para controlar el click sobre el tab de usuarios*/
$(document).on('click', '#userTab', function(){
	Chat.loadFrecuentUsers();
	Chat.windowState = 'sidebar';
});

/*evento para mostrar la conversacion desde el panel lateral de conversaciones*/
$(document).on('click', '.page-quick-sidebar-chat-users .media-list > .media', function () {
	if(!$(this).hasClass("notification")){
		Chat.loadConversation(this, 'sidebar');
		Chat.windowState = 'chat';
	}
});


/*------------------------------------------------------------------------------------------
Eventos sobre chat abierto
-------------------------------------------------------------------------------------------*/

/*evento para cerrar chat y cerrar pantalla*/
$(document).on('click','.page-quick-sidebar-toggler',function (e) {
	Chat.closeConversation();
	Chat.closeLateralPanel();
	Chat.windowState = 'close';
});

/*evento para cerrar el chat*/
$('.page-quick-sidebar-chat-user .page-quick-sidebar-back-to-list').click(function () {
	Chat.closeConversation();
	Chat.windowState = 'sidebar';
	var source = $(this).attr("data-source");
	if (source == "popup"){
		Chat.closeLateralPanel();
		Chat.windowState = 'close';
	}
});

/*-----------------------------------------------------------------------------------------
Evento al enviar un msj
------------------------------------------------------------------------------------------*/
$(document).on('click','.page-quick-sidebar-chat-user-form .btn', function(e){
	Chat.sendMessage(e);
});

$('.page-quick-sidebar-chat-user-form .form-control').keypress(function (e) {
	if (e.which == 13) {
		Chat.sendMessage(e);
        return false;
    }
});

$('#searchUserInput').keyup(function() {
    var userName = this.value;
    Chat.handleSearch(userName);
});

$(document).on('click', '#load_more_msgs', function(e){
	var totalMsgs = $(this).attr('msgs');
	Chat.loadMoreMessages(totalMsgs);
});