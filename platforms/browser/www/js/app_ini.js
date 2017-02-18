/*variables de session*/
var storage;
var app={};
var appS={};
var controller;
var urlLocal="http://localhost/cache/adic/";
var urlRemoto="http://adondeirenlaciudad.com/";
var urlAjax=urlRemoto;
/**********************/
$(document).bind("mobileinit", function(){
	
	$.mobile.defaultPageTransition = "slidedown";
	$.mobile.loadingMessage = "Cargando app.";

	
	
});

$(document).ready(function() {

	loaderMain();
	function loaderMain(){
		inicializar();
		is_logged_in();
		
	}
	function is_logged_in(){

		app=getAppJson();
		email=app.user.email;
		name=app.user.name;
		token=app.user.token;

		if (token!==""||email!==""){
			var data = {'action': 'sesion','token':token,'user_email':email};
			$.ajax({
				type : 'POST',
				crossDomain: true,
				cache: false,
				xhrFields: {
					withCredentials: true
				},			
				url  : urlAjax+'classes/ajaxApp.php',
				dataType: "json",
				data : data,
			})
			.done(function( data, textStatus, jqXHR ) {
				if(data.continuar==="ok"){				
					$.mobile.changePage("#main");

				}
				else{
					var user={
						token:"",
						email:"",
						name:"",
					};
					app={				
						user:user
					};
					setAppJson(app);
					$.mobile.changePage("#login");				
				}

			})
			.fail(function( jqXHR, textStatus, errorThrown ) {
				$.mobile.changePage("#login");
			});
		}
		else{
			/* no logueado*/
			$.mobile.changePage("#login");
			
		}
	}
	$("#loginU").on('click', function(event) {
		event.preventDefault();
		submitFormsubmitFormLogin();
	});
	/* funcion para login */
	function submitFormsubmitFormLogin(){  
		ajaxLoader("inicia"); 
		var data = {'action': 'loginU','logUser':$("#logUser").val(),'logPass':$("#logPass").val()};
		$.ajax({

			type : 'POST',
			crossDomain: true,
			cache: false,
			xhrFields: {
				withCredentials: true
			},
			url  : urlAjax+'classes/ajaxApp.php',
			dataType: "json",
			data : data,		
		})
		.done(function( data, textStatus, jqXHR ) {
			if(data.continuar==="ok"){
				var user=app.user;
				user.token=data.datos.token;
				user.email=data.datos.row[0].username;
				user.name=data.datos.row[0].username;
				user.rol=data.datos.row[0].role;
				user.id=data.datos.row[0].iduser;				
				app.user=user;
				setAppJson(app);
				$.mobile.changePage("#main");
				is_logged_in();
				$('.modal').modal('hide');
				ajaxLoader("termina");
			}
			else{
				ajaxLoader("termina");
				alertMensaje('usuario o contraseña no son correctos');
			}
		})
		.fail(function( jqXHR, textStatus, errorThrown ) {
			ajaxLoader("termina");
			alertMensaje('problemas al iniciar session'+errorThrown);
		});

	}
	function alertMensaje(mensaje){
		alert(mensaje);
	}

	/* localstorage */
	function getAppJson(){
		if (storage.app===undefined) {
			var user={
				token:"",
				email:"",
				name:"",
			};
			app={
				user:user
			};
			setAppJson(app);
		}
		else{
			app=JSON.parse(storage.app);		
			if (app.user===undefined) {
				app.user={
					token:"",
					email:"",
					name:"",
				};
				setAppJson(app);			
			}
			
		}
		
		
		return app;
	}
	function setAppJson(app){
		storage.app=JSON.stringify(app);
	}
	/* session storage */
	function getAppSession(){
		if (storageS.appS===undefined) {
			var user={
				fecha:"",
				categoria:"",
				vista:"promociones",
			};
			appS={
				user:user
			};
			setAppSession(appS);
		}
		else{
			appS=JSON.parse(storageS.appS);		
			if (appS.user===undefined) {
				appS.user={
					fecha:"",
					categoria:"",
					vista:"promociones",
				};
				setAppSession(appS);			
			}
			
		}
		return appS;
	}
	function setAppSession(appS){
		storageS.appS=JSON.stringify(appS);
	}
	/* funcion para logout */
	$("#logOutbtn").on('click', function(){
		ajaxLoader("inicia"); 
		var data= {'action': 'logout','token':app.user.token};
		$.ajax({
			data:  data,
			crossDomain: true,
			cache: false,
			xhrFields: {
				withCredentials: true
			},
			url: urlAjax+'classes/ajaxApp.php',
			type: 'post'
		}).done(function(data){
			if (data.continuar==="ok") {
				var user={
					token:"",
					email:"",
					name:"",
				};
				app={				
					user:user
				};
				setAppJson(app);
				is_logged_in();
				ajaxLoader("termina");
			}

		});
	});
	/*crear cuenta por email*/
	$("#crteAccountE").on('click', function(){
	ajaxLoader("inicia"); 	
		var data= {'action': 'registerU',"mail": $("#ruMail").val(),"pass": $("#ruPass").val()};
		$.ajax({
			data:  data,
			crossDomain: true,
			cache: false,
			xhrFields: {
				withCredentials: true
			},
			url: urlAjax+'classes/ajaxApp.php',
			type: 'post'
		}).done(function(data){
			if(data.continuar==="ok"){
				var user=app.user;
				user.token=data.datos.token;
				user.email=data.datos.row[0].username;
				user.name=data.datos.row[0].username;
				user.rol=data.datos.row[0].role;
				user.id=data.datos.row[0].iduser;				
				app.user=user;
				setAppJson(app);
				$.mobile.changePage("#main");
				is_logged_in();
				$('.modal').modal('hide');
				ajaxLoader("termina");
			}
			else{
				ajaxLoader("termina");
				alertMensaje('problemas al iniciar session');
			}

		});
	});
	$(document).on('click', '.toggle-view-promociones', function(event) {
		event.preventDefault();
		appS=getAppSession();
		if (appS.user.vista==="promociones") {
			appS.user.vista="negocios";
			
		}else{
			appS.user.vista="promociones";
			
		}
		setAppSession(appS);
		mainFunction();

		/* Act on the event */
	});		
	function getMenuCategorias(){	
		/*codigo ajax para despues traernos el menu de categorias */
	}
	function getDiaSemana(){
		appS=getAppSession();
		var ahora = new Date();
		var dia= ahora.getDay();
		var semana={};
		var buttonStart='<button type="button" class="list-group-item cLightGrey s20 square noBorder noMargin bgTransparent searchDay searchDayClick"';
		var buttonEnd='</button>';
		var dias = new Array('Domingo','Lunes','Martes','Miercoles','Jueves','Viernes','Sabado');
		semana.primerDia=	dias[dia];
		var botones=buttonStart+' value="'+ahora.getFullYear()+'-'+(ahora.getMonth() + 1)+'-'+ahora.getDate()+'" >Hoy'+buttonEnd;
		for (var i = 1; i < 6; i++) {			
			despues = ahora.setTime(ahora.getTime() + (1*24*60*60*1000));
			despues = new Date(despues);
			var diaDespues=despues.getDay();
			botones+=buttonStart+' value="'+despues.getFullYear()+'-'+(despues.getMonth() + 1)+'-'+despues.getDate()+'" >'+dias[diaDespues]+buttonEnd;
		}
		semana.botones=botones;

		if (appS.user.fecha!=="") {
			$(".primerDiaSemana").html(appS.user.fechaNombre);
		}
		else{
			$(".primerDiaSemana").html(semana.primerDia);
		}
		$("#diasSemana").html(semana.botones);

	}
	function getPost(){
		ajaxLoader("inicia"); 
		appS=getAppSession();
		var data= {'action': 'getPost','fecha':appS.user.fecha,'categoria':appS.user.categoria};	
		$.ajax({			
			data:data,
			crossDomain: true,
			cache: false,
			xhrFields: {
				withCredentials: true
			},
			url: urlAjax+'classes/ajaxApp.php',
			type: 'post'
		}).done(function(data){
			if(data.continuar==="ok"){
				var datahtml="";
				for(var i in data.datos) {
					datahtml+=getHtmlPost(data.datos[i]);
				}
				$("#postContainer").html(datahtml);
				
			}
			else{
				$("#postContainer").html('<div class="h50">Sin publicaciones :(');
			}
			ajaxLoader("termina");

		}).fail(function( jqXHR, textStatus, errorThrown ) {
			$("#postContainer").html('<div class="h50">Sin publicaciones :(');
			ajaxLoader("termina");
		});
	}
	
	/*$('#sectionPost').xpull({
		'callback':function(){
			getPost();
		}
	});*/
	function getNegocios(){
		ajaxLoader("inicia"); 
		appS=getAppSession();
		var data= {'action': 'getNegocios','categoria':appS.user.categoria};	
		$.ajax({			
			data:data,
			crossDomain: true,
			cache: false,
			xhrFields: {
				withCredentials: true
			},
			url: urlAjax+'classes/ajaxApp.php',
			type: 'post'
		}).done(function(data){
			if(data.continuar==="ok"){
				var datahtml="";
				for(var i in data.datos) {
					datahtml+=getHTMLNegocios(data.datos[i]);
				}
				$("#postContainer").html(datahtml);
				
			}
			else{
				$("#postContainer").html('<div class="h50">Sin negocios :(');
			}
			ajaxLoader("termina");

		}).fail(function( jqXHR, textStatus, errorThrown ) {
			$("#postContainer").html('<div class="h50">Sin negocios :(');
			ajaxLoader("termina");
		});
		

	}
	
	$('#sectionPost').xpull({
		'callback':function(){
			mainFunction();
		}
	});
	function getHTMLNegocios(json){
		return '<div class="card-negocio">'+
		'<div class="flex-negocio">'+
		'<div class="col-xs-4 div-flex-negocio">'+
		'<a class="profile product-content-image flex-negocio .div-flex-negocio" data-userid="'+json.userid+'">'+
		'<div class="image-swap img-responsive" style="background-image: url('+urlAjax+'images/profPicture/'+json.userpic+');">'+
		'</div>'+
		'</a>'+
		'</div>'+
		'<div class="col-xs-8">'+
		'<div class="categoria">'+
		'<a data-id="'+json.categoriaid+'" class="categoriaClick negocio-link " data-name="'+json.categoria+'">'+json.categoria+'</a>'+
		'</div>'+

		'<p class="titulo-negocio">'+
		'<a data-id="'+json.userid+'" class="negocio-link">'+json.nombre+'</a>'+
		'</p>'+
		'</div>'+
		'</div>'+
		'</div>';
	}
	function getHtmlPost(json){
		return '<div class="z-panel z-forceBlock bgWhite wow fadeInUp boxShadow" data-wow-duration=".5s" data-wow-delay=".2s">'+
		'<div class="z-panelHeader noPadding noBorder">'+
		'<div class="z-row noMargin">'+
		'<div class="z-col-lg-3 z-col-md-3 z-col-sm-2 z-col-xs-3 noPadding">'+
		'<form class="z-block h70">'+
		'<button name="useridx"  value="'+json.userid+'" class="z-content z-contentMiddle botonFiltroUsuario">'+
		'<div class="profileImg panelImg" style="background-image:url(\''+urlAjax+'images/profPicture/'+json.user_pic+'\');">'+
		'</div>'+
		'</button>'+
		'</form>'+
		'</div>'+
		'<div class="z-col-lg-9 z-col-md-9 z-col-sm-10 z-col-xs-7 noPadding">'+
		'<div class="z-block h70">'+
		'<div class="z-content z-contentMiddle">'+
		'<form action="profile2.php" method="post" >'+
		'<button name="useridx" class="noMargin text-uppercase text-uppercase s15 cDark text-bold profileU noBorder bgTransparent noPadding" value="'+
		json.userid+'">'+json.user_name+
		'</button>'+
		'</form>'+
		'</div>'+
		'</div>'+
		'</div>'+
		'</div>'+
		'</div>'+
		'<div class="z-panelBody z-block overflowHidden noPadding">'+
		'<div id="" class="bgDarkBlueClear ofertaImg panelImg" style="background-image:url(\''+urlAjax+json.image+
		'\');">'+
		'</div>'+
		'<div class="z-row noMargin">'+
		'<div class="z-col-lg-12 z-col-md-12 z-col-sm-12 z-col-xs-12 bgTransparent">'+
		'<div class="z-block h80 mh80 overflowAuto">'+
		'<div class="z-content z-contentMiddle">'+
		'<p class="cDark s15">'+
		'<span class="text-bold text-uppercase">'+json.title+'</span>'+
		'<span class="hidden">'+json.categoria+
		'</div>'+
		'</div>'+
		'</div>'+
		'</div>'+
		'</div>'+
		'</div>';
	}
	function ajaxLoader(action){
		if (action==="inicia") {
			$.mobile.loading( "show", {
				text: "Cargando...",
				textVisible: true,
				theme: "b",
				html: "<span class='ui-bar ui-overlay-a ui-corner-all'><img src='images/logos/48x48.png' />Cargando...</span>"
			});
		}
		else{
			if (action==="termina") {
				$.mobile.loading( "hide" );
			}
		}
	}
	function mainFunction(){
		is_logged_in();
		app=getAppJson();
		appS=getAppSession();
		if (app.user.name!=="") {$(".usuario_mostrar").html(app.user.name);}
		getDiaSemana();
		getMenuCategorias();
		$vista= $(".toggle-view-promociones");
		if (appS.user.vista==="promociones") {
			getPost();
			$vista.attr('tooltip', 'Negocios');
		}
		else{
			$vista.attr('tooltip', 'Promociones');
			getNegocios();
		}
	}
	function ubicacionesFunction(){
		app=getAppJson();
		
	}

	


	function inicializar(){
		/* cambiamos nombre a local storage para un uso mas sensillo y para corregir problemas de navegadores que no lo soportan mas adelante*/
		try {
			if (localStorage.getItem) {
				storage = localStorage;
				storageS = sessionStorage;
			}
		} catch(e) {
			storage = {};
			storageS = {};
		}
		app=getAppJson();
		appS=getAppSession();

		/* validaciones */
		$("#lognUser").validate({
			rules: {
				logUser: {
					required: true,
					email: true
				},
				logPass: {
					required: true,
					minlength: 5
				}
			},
			messages: {
				logUser: "Porfavor ingresa un E-mail valido",
				logPass: "Ingresa una contraseña con mas de 5 caracteres",
			}
		});
		
		$("#postContainer").on('click', '.botonFiltroUsuario', function(event) {
			event.preventDefault();
			$.mobile.changePage("#profile");
		});
		$("#categoriasMenu").on('click', '.menuCategoriaClick', function(event) {
			event.preventDefault();
			var id=$(this).attr('data-id');
			var icon=$(this).attr('data-icon');
			var name=$(this).attr('data-name');
			cambioCategoria(id,icon);
			
			$(".ui-panel").panel("close");

		});
		$(document).on('click', '.categoriaClick', function(event) {
			event.preventDefault();
			var id=$(this).attr('data-id');
			var name=$(this).attr('data-name');
			var icon="";
			switch(+id){
				
				case -1 :icon="";break;
				case 0 :icon="";break;
				case 1 :icon="fa-beer";break;
				case 2 :icon="fa-cutlery";break;
				case 3 :icon="fa-glass";break;
				case 4 :icon="fa-truck";break;
				case 5 :icon="fa-calendar";break;
			}
			cambioCategoria(id,icon);
		});

		$("#form_search").submit(function( event ) {
			$("#searchBtn").click();
			event.preventDefault();
		});
		$(document).on('click','.lgn-with-fb',function(event) {
			var token='swd';
			//var html='<a href="#" rel="'+urlAjax+'facebook.html?token='+token+'" target="_BLANK" class="z-btn btn-rounded h50 bgBlue cWhite s20 text-center noTransform boxShadow link">Facebook</a>';
			var html='<a href="#" rel="'+urlAjax+'facebook.html?token='+token+'" target="_BLANK" class="z-btn btn-rounded h50 bgBlue cWhite s20 text-center noTransform boxShadow link">Facebook</a>';
			//$("#iframemodal .modal-body").html(html);
		});
		$(document).on('click','.link', function(event) {
			event.preventDefault();
			url = $(this).attr("rel");
			//navigator.app.loadUrl(url, {openExternal: true});
			window.open(url,'_blank', 'location=yes');
		});

		function loadURL(url){
			navigator.app.loadUrl(url, { openExternal:true });
			return false;
		}
		$("#searchBtn").on('click', function(event) {
			ajaxLoader("inicia");
			event.preventDefault();
			var data= {'action': 'buscar','input':$("#search").val()};
			$.ajax({
				data:  data,
				crossDomain: true,
				cache: false,
				xhrFields: {
					withCredentials: true
				},
				url: urlAjax+'classes/ajaxApp.php',
				type: 'post'
			}).done(function(data){
				if(data.continuar==="ok"){
					var datahtml="";
					for(var i in data.datos) {
						datahtml+=getHtmlPost(data.datos[i]);
					}
					$("#postContainer").html(datahtml);

				}
				else{
					$("#postContainer").html('<div class="h50">Sin publicaciones :(');
				}
				$("html, body").animate({ scrollTop: 0 }, "slow");
				ajaxLoader("termina");

			});
			
		});
		$("#diasSemana").on('click', '.searchDayClick', function(event) {
			event.preventDefault();
			$("html, body").animate({ scrollTop: 0 }, "slow");
			appS=getAppSession();
			appS.user.fecha=$(this).val();
			appS.user.fechaNombre=$(this).html();
			setAppSession(appS);
			mainFunction();
			$(".ui-panel").panel("close");

		});
		$(document).on("pagebeforeshow","#main",function(event){
			mainFunction();
		});
		





		mainFunction();


		/* fin inicializar */
	}
	function cambioCategoria(id,icon,name){
		$("html, body").animate({ scrollTop: 0 }, "slow");
			appS=getAppSession();			
			if (id==="0") {
				appS.user.categoria="0";
				appS.user.categoriaNombre="Inicio";
				appS.user.classIcon=icon;
				setAppSession(appS);
				mainFunction();
				$("#classIcon").html('<img class="h35" src="images/logos/48x48.png" alt="logo">');
			}
			else{
				if (id==="-1") {
					appS.user.categoria="0";
					appS.user.categoriaNombre="Inicio";
					appS.user.classIcon=icon;
					setAppSession(appS);
					$("#classIcon").html('<img class="h35" src="images/logos/48x48.png" alt="logo">');
					$.mobile.changePage("#ubicaciones");
					ubicacionesFunction();
				}
				else{
					appS.user.categoria=id;
					appS.user.categoriaNombre=name;
					appS.user.classIcon=icon;
					setAppSession(appS);
					mainFunction();
					$("#classIcon").html('<span class="sidebar-icon fa '+appS.user.classIcon+' cLightGrey"></span>');
				}
			}
	}
	function openInAppBrowserBlank(url)
	{
		try {
			ref = window.open(encodeURI(url),'_blank','location=no');
			ref.addEventListener('loadstop', LoadStop);
			ref.addEventListener('exit', Close);
		}
		catch (err)    
		{
			alert(err);
		}
	}
	function LoadStop(event) {
		if(event.url == "http://www.mypage.com/closeInAppBrowser.html"){
			/*alert("fun load stop runs");*/
			ref.close();
		}    
	}
	function Close(event) {
		ref.removeEventListener('loadstop', LoadStop);
		ref.removeEventListener('exit', Close);
	} 
	/* fin del ready */	
});