function initPermPage() {
	initPage('Perm');
}
function initRolePage() {
	initPage('Role');
}
function initUserPage() {
	initPage('User');
	initUserValidations();
	$('#roles').multiSelect();
	$('#permissions').multiSelect();
//	$('input').iCheck({
//		checkboxClass : 'icheckbox_square',
//		radioClass : 'iradio_square',
//		increaseArea : '20%' // optional
//	});
	
	 $('select').select2();
}

function initUserList() {
	sendRequestJQ('auth/adm/usr/list', 'dashboard', 'initUserPage()');
}

function initPersonList() {
	sendRequestJQ('auth/cat/person/list', 'dashboard', 'initPersonPage()');
}

function initPersonPage() {
	initPage('Person');
	initPersonValidations();
	$('#my_multi_select1').multiSelect();
	$('select').select2();
}

function borrarRegistro(url, workarea, nextfunction){

	  
	bootbox.confirm("Se borrar\u00E1 el registro. \u00BFDesea Continuar?",function(result) {
       if(result){ sendRequestJQ(url,workarea,nextfunction);}
    }); 
}

function initPage(page) {
	 bootbox.setDefaults({
          /**
           * @optional String
           * @default: en
           * which locale settings to use to translate the three
           * standard button labels: OK, CONFIRM, CANCEL
           */
          locale: "es"
    });
	$('#' + page + 'Table').DataTable({
			 "language": {
		            "lengthMenu": "_MENU_ Registros por pagina",
		            "zeroRecords": "No existen registros",
		            "info": "Mostrando pagina _PAGE_ de _PAGES_",
		            "infoEmpty": "No hay registros disponibles",
		            "infoFiltered": "(filtered from _MAX_ total records)"
		        }	
	 });
	$('#add_' + page).hide();
	$('button.btn.green').click(function() {
		$('#add_' + page).show();
		$('#list_' + page).hide();
	});
	$('button.btn.default').click(function() {
		$('#add_' + page).hide();
		$('#list_' + page).show();
	});
	$('button.btn.blue').click(
			function() {
				console.log("submit boton blue");
				submitAjaxJQ(page + 'Form', 'dashboard', 'initPage('
						+ page + ');');
			});

}
function initUserValidations() {

	var form = $('#submit_form');
	var error = $('.alert-danger', form);
	var success = $('.alert-success', form);
	// alert('validando');
	form.validate({
		doNotHideMessage : true,
		errorElement : 'span', // default input error message container
		errorClass : 'help-block help-block-error', // default input error
		// message class
		focusInvalid : false, // do not focus the last invalid input
		// ignore : "", // validate all fields including form hidden input
		rules : {
			username : {
				minlength : 6,
				required : true
			},
			nickname : {
				minlength : 6,
				required : true
			},
			email : {
				required : true,
				email : true
			},
			password : {
				required : true,
				minlength : 6
			},
			rpassword : {
				required : true,
				minlength : 6,
				equalTo : "#password"
			},
			"person.id" : {
				required : true
			},
			roles : "required",
			permissions : "required",
			gender : "required"
		},

		invalidHandler : function(event, validator) { // display error alert
			// on form submit
			success.hide();
			error.show();
			Metronic.scrollTo(error, -50);
		},

		errorPlacement : function(error, element) { // render error placement
			// for each input type
			var icon = $(element).parent('.input-icon').children('i');
			icon.removeClass('fa-check').addClass("fa-warning");
			icon.attr("data-original-title", error.text()).tooltip({
				'container' : 'body'
			});
			
			 if (element.parent(".input-group").size() > 0) {
                 error.insertAfter(element.parent(".input-group"));
             } else if (element.attr("data-error-container")) { 
                 error.appendTo(element.attr("data-error-container"));
             } else if (element.parents('.radio-list').size() > 0) { 
                 error.appendTo(element.parents('.radio-list').attr("data-error-container"));
             } else if (element.parents('.radio-inline').size() > 0) { 
                 error.appendTo(element.parents('.radio-inline').attr("data-error-container"));
             } else if (element.parents('.checkbox-list').size() > 0) {
                 error.appendTo(element.parents('.checkbox-list').attr("data-error-container"));
             } else if (element.parents('.checkbox-inline').size() > 0) { 
                 error.appendTo(element.parents('.checkbox-inline').attr("data-error-container"));
             } else {
                 error.insertAfter(element); // for other inputs, just perform default behavior
             }
		},

		highlight : function(element) { // hightlight error inputs
			$(element).closest('.form-group').removeClass('has-success')
					.addClass('has-error'); // set error class to the control
			// group
		},

		unhighlight : function(element) { // revert the change done by
			// hightlight
			$(element).closest('.form-group').removeClass('has-error'); // set
			// error
			// class
			// to
			// the
			// control
			// group
		},

		success : function(label, element) {
			var icon = $(element).parent('.input-icon').children('i');
			$(element).closest('.form-group').removeClass('has-error')
					.addClass('has-success'); // set success class to the
			// control group
			icon.removeClass("fa-warning").addClass("fa-check");
		},

		submitHandler : function(form) {
			success.show();
			error.hide();
			form[0].submit(); // submit the form
		}
	});

	var displayConfirm = function() {
		$('#tab4 .form-control-static', form).each(
				function() {
					var input = $('[name="' + $(this).attr("data-display")
							+ '"]', form);
					if (input.is(":radio")) {
						input = $('[name="' + $(this).attr("data-display")
								+ '"]:checked', form);
					}
					if (input.is(":text") || input.is("textarea")) {
						$(this).html(input.val());
					} else if (input.is("select")) {
						var elements = [];
						input.each(function() {
							var selectedOption = $(this)
									.find('option:selected');
							elements.push(selectedOption.text());
						});
						$(this).html(elements.join("<br>"));
					} else if (input.is(":radio") && input.is(":checked")) {
						$(this).html(input.attr("data-title"));
					} else {
						$(this).html($("input[name='email']").val());
					}
				});
	}

	var handleTitle = function(tab, navigation, index) {
		var total = navigation.find('li').length;
		var current = index + 1;
		// set wizard title
		$('.step-title', $('#form_wizard_1')).text(
				'Paso ' + (index + 1) + ' de ' + total);
		// set done steps
		jQuery('li', $('#form_wizard_1')).removeClass("done");
		var li_list = navigation.find('li');
		for (var i = 0; i < index; i++) {
			jQuery(li_list[i]).addClass("done");
		}

		if (current == 1) {
			$('#form_wizard_1').find('.button-previous').hide();
		} else {
			$('#form_wizard_1').find('.button-previous').show();
		}

		if (current >= total) {
			$('#form_wizard_1').find('.button-next').hide();
			$('#form_wizard_1').find('.button-submit').show();
			displayConfirm();
		} else {
			$('#form_wizard_1').find('.button-next').show();
			$('#form_wizard_1').find('.button-submit').hide();
		}
		Metronic.scrollTo($('.page-title'));
	}

	// default form wizard
	$('#form_wizard_1').bootstrapWizard({
		'nextSelector' : '.button-next',
		'previousSelector' : '.button-previous',
		onTabClick : function(tab, navigation, index, clickedIndex) {
			return false;
			/*
			 * success.hide(); error.hide(); if (form.valid() == false) { return
			 * false; } handleTitle(tab, navigation, clickedIndex);
			 */
		},
		onNext : function(tab, navigation, index) {

			success.hide();
			error.hide();

			if (form.valid() == false) {
				return false;
			}

			handleTitle(tab, navigation, index);
		},
		onPrevious : function(tab, navigation, index) {

			success.hide();
			error.hide();

			handleTitle(tab, navigation, index);
		},
		onTabShow : function(tab, navigation, index) {
			var total = navigation.find('li').length;
			var current = index + 1;
			var $percent = (current / total) * 100;
			$('#form_wizard_1').find('.progress-bar').css({
				width : $percent + '%'
			});
		}
	});

	$('#form_wizard_1').find('.button-previous').hide();
	$('#form_wizard_1 .button-submit').click(function() {
		// formId, targetId,after
		// submitAjaxJQ('submit_form','dashboard','');
	}).hide();

	$('#submitRequestForm').click(function() {
		if (form.valid()) {
			submitAjaxJQ('submit_form', 'dashboard', 'initUserList()');
		}
	});
}

/*
 * funciones de tramites **OJO** mala idea declarar las funciones en scope
 * global
 */
function initTramitePage() {

	// se obtiene la forma
	var requestForm = $("#requestForm");
	var error = $('.alert-danger', requestForm);
	var success = $('.alert-success', requestForm);

	// se define la validacion
	requestForm.validate({
		doNotHideMessage : true,
		errorElement : 'span', // default input error message container
		errorClass : 'help-block help-block-error', // default input error
		// message class
		focusInvalid : false, // do not focus the last invalid input

		rules : {
			formalityId : {
				required : true,
				min : 1
			},
			districtId : {
				required: true,
				min : 1
			},
			justification : {
				required : true
			}
		},

		invalidHandler : function(event, validator) { // display error alert
			// on form submit
			success.hide();
			error.show();
			Metronic.scrollTo(error, -50);
		},

		errorPlacement : function(error, element) {
			var icon = $(element).parent('.input-icon').children('i');
			icon.removeClass('fa-check').addClass("fa-warning");
			icon.attr("data-original-title", error.text()).tooltip({
				'container' : 'body'
			});
		},

		highlight : function(element) {
			$(element).closest('.form-group').removeClass('has-success')
					.addClass('has-error');
		},

		unhighlight : function(element) {
			$(element).closest('.form-group').removeClass('has-error');
		},

		success : function(label, element) {
			var icon = $(element).parent('.input-icon').children('i');
			$(element).closest('.form-group').removeClass('has-error')
					.addClass('has-success'); // set success class to the
			// control group
			icon.removeClass("fa-warning").addClass("fa-check");
		},

		submitHandler : function(form) {
			form[0].submit(); // submit the form
		}
	});

	$('#submitRequestForm').click(function() {
		if (requestForm.valid()) {
			submitAjaxJQ('requestForm', 'dashboard', '');
		}
	});
}

function initPersonValidations() {

	var form = $('#submit_form');
	var error = $('.alert-danger', form);
	var success = $('.alert-success', form);
	// alert('validando');
	form.validate({
		doNotHideMessage : true,
		errorElement : 'span', // default input error message container
		errorClass : 'help-block help-block-error', // default input error
		// message class
		focusInvalid : false, // do not focus the last invalid input
		// ignore : "", // validate all fields including form hidden input
		rules : {
			name : {
				required : true
			},
			secondName : {},
			fatherLastName : {
				required : true
			},
			motherLastName : {
				required : true
			},
			telephone : {
				required : true
			},
			mobileTelepone : {
				required : true
			},
			twitter : {},
			facebook : {},
			webSite : {}

		},

		invalidHandler : function(event, validator) { // display error alert
			// on form submit
			success.hide();
			error.show();
			Metronic.scrollTo(error, -50);
		},

		errorPlacement : function(error, element) { // render error placement
			// for each input type
			var icon = $(element).parent('.input-icon').children('i');
			icon.removeClass('fa-check').addClass("fa-warning");
			icon.attr("data-original-title", error.text()).tooltip({
				'container' : 'body'
			});
		},

		highlight : function(element) { // hightlight error inputs
			$(element).closest('.form-group').removeClass('has-success')
					.addClass('has-error'); // set error class to the control
			// group
		},

		unhighlight : function(element) { // revert the change done by
			// hightlight
			$(element).closest('.form-group').removeClass('has-error'); // set
			// error
			// class
			// to
			// the
			// control
			// group
		},

		success : function(label, element) {
			var icon = $(element).parent('.input-icon').children('i');
			$(element).closest('.form-group').removeClass('has-error')
					.addClass('has-success'); // set success class to the
			// control group
			icon.removeClass("fa-warning").addClass("fa-check");
		},

		submitHandler : function(form) {
			success.show();
			error.hide();
			form[0].submit(); // submit the form
		}
	});

	var displayConfirm = function() {
		$('#tab4 .form-control-static', form).each(
				function() {
					var input = $('[name="' + $(this).attr("data-display")
							+ '"]', form);
					if (input.is(":radio")) {
						input = $('[name="' + $(this).attr("data-display")
								+ '"]:checked', form);
					}
					if (input.is(":text") || input.is("textarea")) {
						$(this).html(input.val());
					} else if (input.is("select")) {
						var elements = [];
						input.each(function() {
							var selectedOption = $(this)
									.find('option:selected');
							elements.push(selectedOption.text());
						});
						$(this).html(elements.join("<br>"));
					} else if (input.is(":radio") && input.is(":checked")) {
						$(this).html(input.attr("data-title"));
					} else {
						$(this).html($("input[name='email']").val());
					}
				});
	}

	var handleTitle = function(tab, navigation, index) {
		var total = navigation.find('li').length;
		var current = index + 1;
		// set wizard title
		$('.step-title', $('#form_wizard_1')).text(
				'Paso ' + (index + 1) + ' de ' + total);
		// set done steps
		jQuery('li', $('#form_wizard_1')).removeClass("done");
		var li_list = navigation.find('li');
		for (var i = 0; i < index; i++) {
			jQuery(li_list[i]).addClass("done");
		}

		if (current == 1) {
			$('#form_wizard_1').find('.button-previous').hide();
		} else {
			$('#form_wizard_1').find('.button-previous').show();
		}

		if (current >= total) {
			$('#form_wizard_1').find('.button-next').hide();
			$('#form_wizard_1').find('.button-submit').show();
			displayConfirm();
		} else {
			$('#form_wizard_1').find('.button-next').show();
			$('#form_wizard_1').find('.button-submit').hide();
		}
		Metronic.scrollTo($('.page-title'));
	}

	// default form wizard
	$('#form_wizard_1').bootstrapWizard({
		'nextSelector' : '.button-next',
		'previousSelector' : '.button-previous',
		onTabClick : function(tab, navigation, index, clickedIndex) {
			return false;
			/*
			 * success.hide(); error.hide(); if (form.valid() == false) { return
			 * false; } handleTitle(tab, navigation, clickedIndex);
			 */
		},
		onNext : function(tab, navigation, index) {

			success.hide();
			error.hide();

			if (form.valid() == false) {
				return false;
			}

			handleTitle(tab, navigation, index);
		},
		onPrevious : function(tab, navigation, index) {

			success.hide();
			error.hide();

			handleTitle(tab, navigation, index);
		},
		onTabShow : function(tab, navigation, index) {
			var total = navigation.find('li').length;
			var current = index + 1;
			var $percent = (current / total) * 100;
			$('#form_wizard_1').find('.progress-bar').css({
				width : $percent + '%'
			});
		}
	});

	$('#form_wizard_1').find('.button-previous').hide();
	$('#form_wizard_1 .button-submit').click(function() {
		// formId, targetId,after
		// submitAjaxJQ('submit_form','dashboard','');
	}).hide();

	$('#submitRequestForm').click(function() {
		if (form.valid()) {
			submitAjaxJQ('submit_form', 'dashboard', 'initPersonList()');
		}
	});
}

function initTramiteListPage() {
	console.log("iniciando listado");
	$('#formalityList').DataTable({
        "language": {
            "lengthMenu": "_MENU_ Registros por pagina",
            "zeroRecords": "No existen registros",
            "info": "Mostrando pagina _PAGE_ de _PAGES_",
            "infoEmpty": "No hay registros disponibles",
            "infoFiltered": "(filtered from _MAX_ total records)"
        }
    });
	console.log("finalizando tabla");
}

function showDataHistory(requestId){
	
	apiCall("auth/wf/requestDetail/" + requestId, function(data){
		bootbox.dialog({
	        message: data,
	        title: "Historial del folio"	    
	    }).find(".modal-dialog").css({"width":"70%"});
	});
	console.log("fin");
}

function initUpload() {

	var requestForm = $('#requestForm');

	$('#uploadFile').click(function(e) {
		var file = requestForm.find('#attachment').val();
		if(file.length <= 0){
			return;
		}
		submitFileAjaxJQTest('requestForm', 'dashboard', '');
//		submitFileAjaxJQ('requestForm', 'dashboard', '');
	});
}


var movementController = {
		upGrid : "#addComponent",
		downGrid : "#substractComponent",
		slider : "SliderControl",
		
		/* funcion que oculta los grids */
		reset : function(){
			$(this.upGrid).hide();
			$(this.downGrid).hide();
		},
		
		/* funcion que elimina todos los registros del grid */
		clean : function(grid){
			$(grid).find("tbody tr").remove();
			$(grid).find("tbody").html('<tr id="noMovs"><td colspan="6">No hay Movimientos Capturados</td><tr>');
		},
		
		/* titulos en función del tipo de movimiento seleccionado */
		titles : { al:"Ampliación Líquida", rl:"Reducción Líquida", ac:"Ampliación Compensada", rc:"Reducción Compensada"},
		
		/* funcion que muestra y actualiza el titulo del grid */
		showGrid : function(grid, name){
			var grd = $(grid);
			grd.find(".caption").text(name);
			grd.show();
		},
		
		/* funcion para mostrar el grid con el titulo correspondiente en funcion del tipo de movimiento */
		update : function(value){
			this.reset();
			
			if(value > 0){
				$(document).find("#movementTypeId").closest('[data-name="movementTypeContainer"]').removeClass("has-error");
				switch(value){
					case 1:
						this.showGrid(this.upGrid, this.titles.al);
						break;
					case 2:
						this.showGrid(this.downGrid, this.titles.rl);
						break;
					case 3:
						this.showGrid(this.upGrid, this.titles.ac);
						this.showGrid(this.downGrid, this.titles.rc);
						break;
				}
			}
		},
		
		getId : function(grid, idx, attr, escaped){
			escaped = escaped || 1;
			var list = (grid == this.upGrid ? "upMovements" : "downMovements");
			return (escaped == 1 ? "#" : "") + list + idx + (escaped == 1 ? "\\." : ".") + attr;
		},
		getPath : function(grid, idx, attr){
			var list = (grid == this.upGrid ? "upMovements" : "downMovements");
			return "" + list + "[" + idx + "]." + attr;
		},
		updateTotal : function(self, grid){
			var grd = $(grid);
			var totalId = (grid === self.upGrid ? "#upMovementsTotal" : "#downMovementsTotal");
			
			var gridTotal = 0;
			
			//iteracion sobre las filas
			grd.find("tbody tr:not(#noMovs)").each(function(idx, e){
				var row = $(e);
				var isRemovedRow = row.find("[data-name='removedElement']").val();
				
				//solo considera las filas no eliminadas
				if(parseInt(isRemovedRow) == 0){
					var totalAmount = row.find("[data-name='totalAmount']");
					if (totalAmount.val().length > 0){
						gridTotal += parseFloat(totalAmount.val());
					}
				}
			});
			console.log("actualizando monto total del grid: " +  gridTotal);
			grd.find(totalId).html((gridTotal));
			
		},
		getSliderId : function(grid){
			var direction = (grid == this.upGrid ? "up" : "down");
			return "#" + direction + this.slider;
		},
		linkComponent : function(grid){
			var grd = $(grid);
			var self = this;
			
			//si no existe el row de "sin elementos, se iteran los objetos"
			if(grd.find("tbody #noMovs").length == 0){
				
				grd.find("tbody tr").each(function(idx, e){
					var element = $(e);
					var rowId = element.attr("id");	

					self.startSlider(self, idx, parseInt(new Date().getMonth()), grid);		
					self.addRemoveEvent(self, grid, idx);
					
					//asignar eventos de cambio
					self.addOnChangeEvent(self, grid, idx, "programaticKeyId",true);
					self.addOnChangeEvent(self, grid, idx, "entryId",false);
					
					self.updateAmounts(self, grid, idx, "monthAmount");	

				});
				
				self.updateTotal(self, grid);
				
			}else{
				grd.find("tbody tr:not(#noMovs)").remove();
			}
			
			//evento para agregar movimientos
			var addBtn = grd.find(".actions #addMov").on("click", function(){
				
				var nextIndex = self.getNextIndex(grd);				
				
				if(nextIndex == 0){
					grd.find("tbody #noMovs").remove();
				}
				
				var nodo = self.activateTemplate("#movementRowTemplate");
				var e = $(nodo);
				
				//accion
				e.find("[data-name='action'] a").attr("id", "rmvIdx" + nextIndex);
				
				//llave programatica
				e.find("[data-name='programaticKey'] select")
					.attr("name", self.getPath(grid, nextIndex, "programaticKeyId"))
					.attr("id", self.getId(grid, nextIndex, "programaticKeyId", 2))
					.removeAttr("multiple");
				e.find("[data-name='programaticKey']").find("input[type='hidden']").remove();
			
				//entry
				e.find("[data-name='entry'] select")
				.attr("name", self.getPath(grid, nextIndex, "entryId"))
				.attr("id", self.getId(grid, nextIndex, "entryId", 2))
				.removeAttr("multiple");
				e.find("[data-name='entry']").find("input[type='hidden']").remove();

				//sliderControl
				e.find("[data-name='sliderControl'] #sliderControl").attr("id", self.getSliderId(grid).substring(1) + nextIndex);
				
				//lowerOffset
				e.find("[data-name='lower-offset'] ").attr("id", self.getId(grid, nextIndex, "lower-offset", 2));
				e.find("[data-name='upper-offset'] ").attr("id", self.getId(grid, nextIndex, "upper-offset", 2));
				
				//monthAmount
				e.find("[data-name='monthAmount'] input")
				.attr("name", self.getPath(grid, nextIndex, "monthAmount"))
				.attr("id", self.getId(grid, nextIndex, "monthAmount", 2))
				.attr("value", "0");
				
				//initialMonthId
				e.find("[data-name='initialMonthId']")
				.attr("name", self.getPath(grid, nextIndex, "initialMonthId"))
				.attr("id", self.getId(grid, nextIndex, "initialMonthId", 2))
				.attr("value","");
				
				//finalMonthId
				e.find("[data-name='finalMonthId']")
				.attr("name", self.getPath(grid, nextIndex, "finalMonthId"))
				.attr("id", self.getId(grid, nextIndex, "finalMonthId", 2))
				.attr("value","");
				
				//removedElement
				e.find("[data-name='removedElement']")
				.attr("name", self.getPath(grid, nextIndex, "removedElement"))
				.attr("id", self.getId(grid, nextIndex, "removedElement", 2))
				.attr("value","0");
				
				e.find("[data-name='movementTypeId']")
				.attr("name", self.getPath(grid, nextIndex, "movementTypeId"))
				.attr("id", self.getId(grid, nextIndex, "movementTypeId", 2))
				.attr("value",(grid == self.upGrid ? "1" : "-1"));
				
				e.find("[data-name='requestDetailId']")
				.attr("name", self.getPath(grid, nextIndex, "requestDetailId"))
				.attr("id", self.getId(grid, nextIndex, "requestDetailId", 2))
				.attr("value","-1");
				
				e.find("[data-name='totalAmount']")
				.attr("name", self.getPath(grid, nextIndex, "totalAmount"))
				.attr("id", self.getId(grid, nextIndex, "totalAmount", 2))
				.attr("value","0");
				
				grd.find("tbody").append(e);
				
				self.startSlider(self, nextIndex, parseInt(new Date().getMonth()), grid);
				self.addOnChangeEvent(self, grid, nextIndex,"programaticKeyId",true);
				self.addOnChangeEvent(self, grid, nextIndex,"entryId",false);
				self.addRemoveEvent(self, grid, nextIndex);
				self.updateAmounts(self, grid, nextIndex, "monthAmount");
				
				grd.find("tbody #noMovs").remove();
			});
		},
		updateAmounts : function(self, grid, nextIndex, element){
			var ma = $(document).find(self.getId(grid, nextIndex, element));
			ma.keyup(function(){
			    this.value = this.value.replace(/[^0-9\.]/g,'');
			});
			ma.blur(function(){
				var finalMonth = $(self.getId(grid, nextIndex, "finalMonthId"));
				var initialMonth = $(self.getId(grid, nextIndex, "initialMonthId"));
				
				var total = 0;
				if ( this.value.length > 0){
					console.log("campo no vacio: " + this.value);
					var m1 = parseInt(finalMonth.val());
					var m2 = parseInt(initialMonth.val());					
					total = ((m1-m2) + 1) * this.value;					
					console.log("monto total: " + total);
					
					if (parseInt(this.value) > 0){
						self.removeClassError(self.getId(grid, nextIndex, "monthAmount"));
					}
					
				}else{
					console.log("campo vacio, seteando cero");
				}
				
				//guardamos el monto total en total amount
				console.log("seteando total a totalAmount: " + total);
				$(self.getId(grid, nextIndex, "totalAmount")).val(total);
				
				//se invoca update para actualizar los totales del grid
				console.log("actualizando total de componente");
				self.updateTotal(self, grid);
				
			});
		},
		addOnChangeEvent:function(self, grid, indice, element, ajaxCall){
			var id = self.getId(grid, indice, element);
			$(document).find(id).on("change", function (e) {
			    
				if(ajaxCall){
					self.apiCall('auth/API/get/entry/'+this.value, function(data){
				    	var entrySelect = $(document).find(self.getId(grid, indice, "entryId"));
				    	entrySelect.empty();
				    	entrySelect.append('<option value="-1">Seleccione..</option>');
				    	$.each(data, function(index, item){
				    		entrySelect.append('<option value="' + item.id +'">' + item.name + '</option>');
				    	});
				    });
				}
			    
				if(parseInt(this.value) > 0){
			    	self.removeClassError(id);
			    }
			});
		},
		removeClassError:function(id){
			$(id).closest(".has-error").removeClass("has-error");
		},
		addRemoveEvent : function(self, grid, indice){
			var a = $(grid).find("[data-name='deleteAction'] a");
			
			a.on("click", function(){
				var row = $(this).parent().parent();
				row.find(self.getId(grid, indice, "removedElement")).val("1");
		
				row.hide();
				self.updateTotal(self, grid);
				
				var filteredRows = $(grid).find("tbody tr:not(#noMovs)").filter(function(){
					var flag = $(this).find("[data-name='removedElement']");
					return (parseInt(flag.val()) <= 0);
				});
				
				if (filteredRows.length == 0){
					$(grid).find("tbody").html('<tr id="noMovs"><td colspan="6">No hay Movimientos Capturados</td><tr>');
				}
				
			});
		},
		startSlider : function(self, indice, initialMonth, grid){
						
			var id = self.getSliderId(grid) + indice;			
			$(document).find(id).noUiSlider({
		        connect: true, behaviour: 'tap', step:1, start: [initialMonth, 11],
		        range: {
		            'min': [initialMonth],
		            'max': [11]
		        }	
		    });

			var months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];			
			function myValue(value){
				$(this).text(months[parseInt(value)]);
			}		
			function intValue(value){
				$(this).val(parseInt(value));
			}
			
			var initialMonthId = self.getId(grid, indice, "initialMonthId");
			var finalMonthId = self.getId(grid, indice, "finalMonthId");
						
			$(document).find(id).Link('lower').to($(document).find(initialMonthId), intValue);
			$(document).find(id).Link('upper').to($(document).find(finalMonthId), intValue);

			$(document).find(id).Link('lower').to($(document).find(self.getId(grid, indice, "lower-offset")), myValue);
			$(document).find(id).Link('upper').to($(document).find(self.getId(grid, indice, "upper-offset")), myValue);
		},
		startComponent : function(){			
			this.linkComponent(this.upGrid);
			this.linkComponent(this.downGrid);
			
			//si no hay movementType Seleccionado, ocultamos los grids
			if(parseInt($("#movementTypeId").val()) < 0){
				this.reset();
			}
		},
		getNextIndex: function(grid){
			var rowNoExiste = grid.find("tbody #noMovs").length;
			var totalRows = grid.find("tbody tr").length;
			//alert("funcion get next index: rowNoExiste: " + rowNoExiste + ", totalRows:" + totalRows );
			if(totalRows == 1 && rowNoExiste == 1){
				return 0;
			}if(totalRows > 0 && rowNoExiste == 0){
				return totalRows;
			}
		},
		activateTemplate: function(id) {
		    var t = document.querySelector(id);
		    return document.importNode(t.content, true);
		},
		apiCall: function(actionURL, callback) {
			var method = "GET";
			var header = $("meta[name='_csrf_header']").attr("content");
			var token = $("meta[name='_csrf']").attr("content");
			blockPage();
			$.ajax({
				url : context + '/' + actionURL,
				beforeSend : function(xhr) {
					xhr.setRequestHeader(header, token);
				},
				success : function(data) {
					callback(data);
					unblockPage();
				}
			});
		},
		validate : function(){
			var self = this;
			var validator = {
				//valida el tipo de movimiento
				movementType : function(movementType){
					if (parseInt(movementType.val()) <= 0){
						this.notif("error", "Seleccione un tipo de movimiento");
						movementType.closest('[data-name="movementTypeContainer"]').addClass("has-error");
						return false;
					}
					return true;
				},
				validateGrid : function(movementTypeId){
					switch(movementTypeId){
					case 1:
						var res = this.validateComponent(self.upGrid);
						if(res){	
							this.notif("success","Validación completa");
						}
						return res;
					case 2:
						//alert("validando 2 " +  self.downGrid);
						var res = this.validateComponent(self.downGrid);
						if(res){	
							this.notif("success","Validación completa");
						}
						return res;
					case 3:
						var resUp = this.validateComponent(self.upGrid);
						var resDown = this.validateComponent(self.downGrid);
						if (resUp && resDown){
							//validar que totales den cero
							self.updateTotal(self, self.upGrid);
							self.updateTotal(self, self.downGrid);
							
							var movAlza = parseFloat($(document).find("#upMovementsTotal").text());
							var movBaja = parseFloat($(document).find("#downMovementsTotal").text());
							
							console.log("total de movs a la alza: " + movAlza);
							console.log("total de movs a la baja: " + movBaja);
							
							if ((movAlza - movBaja) != 0){
								this.notif("error","la suma de los movimientos de aumento y disminución deben resultar 0.");
								return false;
							}else{
								this.notif("success","Validación completa en ambos grids");
							}	
						}
						return (resUp && resDown);
					}
				},
				validateComponent: function(gridId){
					var grid = $(gridId);
					var totalRows = grid.find("tbody tr:not(#noMovs)").length;
					console.log("total global de filas sin contar nomovs: " +  totalRows);
					
					var filteredRows = grid.find("tbody tr:not(#noMovs)").filter(function(){
						var flag = $(this).find("[data-name='removedElement']");
						return (parseInt(flag.val()) <= 0);
					});
					console.log("total de filas sin contar no rows ni eliminadas: " + filteredRows.length);
					
					if (filteredRows.length <= 0){
						this.notif("error","debe capturar al menos un movimiento");
						console.log("sin movimientos capturados en componente");
						return false;
					}
					//iteracion para procesar cada una de las filas
					
					var ok = true;
					//grid.find("tbody tr:not(#noMovs)").each(function(idx, e){
					filteredRows.each(function(idx, e){
						var row = $(e);
						var programaticKey = row.find("[data-name='programaticKey'] select");
						var entry = row.find("[data-name='entry'] select");
						var amount = row.find("[data-name='monthAmount'] input");
						
						if (parseInt(programaticKey.val()) <= 0){
							console.log("programatic key not selected");
							programaticKey.closest("[data-name='programaticKey']").addClass("has-error");
							ok = false;
						}
						if (parseInt(entry.val()) <= 0){
							console.log("entry key not selected");
							entry.closest("[data-name='entry']").addClass("has-error");
							ok = false;
						}
						if (amount.val().length == 0 || parseInt(amount.val()) <= 0){
							console.log("amount invalid");
							amount.closest("[data-name='monthAmount']").addClass("has-error");
							ok = false;
						}
					});
					if(!ok){
						this.notif("error","Capture la información faltante");
					}
					return ok;
				},
				notif : function(type, msg){
					window.showNotification(type, msg);
				}
			};
			
			console.log("Inicio de validacion de captura");
			
			var movementType = $("#movementTypeId");
			
			
			var result = validator.movementType(movementType);
			if(result){
				result = validator.validateGrid(parseInt(movementType.val()));
				return result;
			}
			return result;
		}
	};


function initFullCapture() {
	
	$(document).find('.numbersOnly').keyup(function () { 
		console.log("pique");
		this.value = this.value.replace(/[^0-9\.]/g,'');
	});

	//var movementController = {};
	
	//Controlador tipo de movimiento
	$("#movementTypeId").on("change", function (e) {
		movementController.clean(movementController.upGrid);
		movementController.clean(movementController.downGrid);
	    movementController.update(parseInt(this.value));
	    $(movementController.upGrid).find('tbody tr:not(#noMovs)').remove();
	    $(movementController.downGrid).find('tbody tr:not(#noMovs)').remove();
	});
	
	movementController.startComponent();
	
	//se carga el movimiento seleccionado
	movementController.update(parseInt($("#movementTypeId").val()));

	var requestForm = $('#requestForm');

	$('#partialSave').click(function(e) {
		alert("haciendo guardado parcial");
		var isCorrect = movementController.validate();
		if (isCorrect){
			requestForm.find('#nextStageValueCode').val("SOLPEND");
			submitAjaxJQ('requestForm', 'dashboard', '');
		}
	});

	$('#saveAndContinue').click(function(e) {
		alert("Finalizando captura y avanzando tramite");
		var isCorrect = movementController.validate();
		if (isCorrect){
			requestForm.find('#nextStageValueCode').val("SOLCOMP");
			submitAjaxJQ('requestForm', 'dashboard', '');
		}
	});
}

function initAuthorization() {
	alert("Iniciando autorizacion");
	
	$(document).find("input").attr("readonly","true");
	$(document).find("select").attr("readonly","true");

	movementController.startComponent();
	
	$(document).find("[data-name='sliderControl']").hide();
	$(document).find("[data-name='deleteAction']").html("");
	$(document).find("[data-name='monthLabels']").attr("colspan","2");
	
	var requestForm = $('#requestForm');

	$('#cancelFormality').click(function(e) {
		alert("Cancelando Tramite");
		if($("#comments").val().length > 0){
			requestForm.find('#nextStageValueCode').val("CANCELAR");
			submitAjaxJQ('requestForm', 'dashboard', '');
		}else{
			window.showNotification("error", "capture comentarios de cancelacion");
		}
	});

	$('#authorizateFormality').click(function(e) {
		alert("autorizando Tramite");
		requestForm.find('#nextStageValueCode').val("SIGFIRMA");
		submitAjaxJQ('requestForm', 'dashboard', '');
	});

	$('#finishFormality').click(function(e) {
		alert("autorizando Tramite y finalizar");
		requestForm.find('#nextStageValueCode').val("CONTINUAR");
		submitAjaxJQ('requestForm', 'dashboard', '');
	});
}