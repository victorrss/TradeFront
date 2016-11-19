var url = 'https://private-5b99d-tradeplace.apiary-mock.com/mercados';
//var url = 'http://localhost:8080/TradeForce/mercado';
var mostrarMapa = false;
$(document).ready(function($) {
	mostrarMapa = false;
});


function RESTlistarMercados(){
	$.getJSON(url, function(data) {
		for (var i = 0 ; i < data.length; i++) {
			var linhaMercado = '<div class="linha-dados table" id="listMercado">'
			+'<div class="td lista-40">'
			+data[i].nome
			+'</div>'
			+'<div class="td space"></div>'
			+'<div class="td">'
			+data[i].endereco
			+'</div>'
			+'<div class="td space"></div>'
			+'<div class="td icons-edit">'
			+'<a href="editar-mercado.html?id='+data[i].id+'?tipo=mercado"><i class="fa fa-pencil" aria-hidden="true"></i></a>'
			+'<a href="delete'+data[i].id+'"><i class="fa fa-trash" aria-hidden="true"></i></a>'
			+'</div>'
			+'</div>';
			$("#containerMercados").append(linhaMercado);
		}
	});
}

function RESTinserirMercado(nome,razaoSocial,endereco,lat,lng){
	return	$.ajax({
						//async: false,
						global: true,
						type      : 'POST',
						url       : url,
						data      : "{'endereco': '"+endereco+"','nome':'"+nome+"','razaoSocial': '"+razaoSocial+"', 'localizacao': {'latitude': '"+lat+"','longitude': '"+lng+"'}}",
						contentType: "application/json; charset=UTF-8",
						error: function(jqXHR, textStatus, errorThrown) {
						  /*if(textStatus==="timeout") {
								//do something on timeout
							}
							*/
							$.MessageBox({
								customClass : "custom_messagebox",
								message     : "Não foi possível enviar sua requisição, o servidor retornou um erro. <br> Tente novamente!"
							});
						}
					});
}

function handleData(data,textStatus,jqXHR) {
	console.log(JSON.stringify(textStatus));
    //console.log(JSON.stringify(data));
   	//console.log(JSON.stringify(jqXHR));

   	if(jqXHR.status == 201){
   		$('#nome').val("");
   		$('#razaoSocial').val("");
   		$('#userEndereco').val("");
   		$('#txtEndereco').val("");
   		$('#txtLatitude').val("");
   		$('#txtLongitude').val("");
   		mostrarMapa = false;
   		$.MessageBox({
   			customClass : "custom_messagebox",
   			message     : "Cadastrado com sucesso!"
   		});
   	}
   	else{
   		$.MessageBox({
   			customClass : "custom_messagebox",
   			message     : "Ocorreu um erro, tente novamente!"
   		});
   	}



   }


   function inserir(){
	// BEGIN - validação
	if($('#nome').val().length < 5 || $('#razaoSocial').val().length < 5 || $('#userEndereco').val().length < 5){
		$.MessageBox({
			customClass : "custom_messagebox",
			message     : "Entrada inválida, preencha todos os campos!"
		});
		return;
	}

	if(mostrarMapa == false){
		$.MessageBox({
			customClass : "custom_messagebox",
			message     : "Você não validou o endereço com o Google, para isso, clique em <br /> <span>'Mostrar no mapa'</span>"
		});
		return;
	}
	// END - validação

	var nome		= $('#nome').val();
	var razaoSocial = $('#razaoSocial').val();
	var endereco 	= $('#txtEndereco').val();
	var lat 		= $('#txtLatitude').val();
	var lng 		= $('#txtLongitude').val();
	console.log(nome + " - " + razaoSocial + " - " + endereco + " - " + lat + " - " + lng);
	RESTinserirMercado(nome,razaoSocial,endereco,lat,lng).done(handleData);
}

function clickMostrarMapa(){
	mostrarMapa = true;
}


