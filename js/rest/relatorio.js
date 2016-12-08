//var url = 'https://private-5b99d-tradeplace.apiary-mock.com/promotors';
var url = 'http://localhost:8080/TradeForce/relatorio';
var urlPromotor = 'http://localhost:8080/TradeForce/promotor';
var idPromotor;

$(document).ready(function ($) {
	loadSelectPromotor();
});
function loadSelectPromotor(){
	ajaxindicatorstart('Aguarde');
	$.getJSON(urlPromotor, function (data) {
		$.each(data, function (i, data) {
    $('#promotor').append(
        $('<option value=""></option>')
          .attr('value', data.id)
          .text(data.nome +' - ID: '+ data.id +' - Login: '+ data.login)
				);
});
		ajaxindicatorstop()
	})
	.fail(function() { //fail,always,error
		$.MessageBox({
			customClass: "custom_messagebox",
			message: "Ocorreu um erro, tente novamente!"
		});
			window.location="index.html";
	});
}

function CallbackListarPorID(data) {
	ajaxindicatorstop()
	promotor = data;
	console.log(promotor);
	$('#nome').val(promotor.nome);
	$('#login').val(promotor.login);
	$('#senha').val(promotor.senha);
	$('#idade').val(promotor.idade);
	$('#empresa option[value='+promotor.empresa.id+']').attr('selected','selected');
	$('#userEndereco').val(promotor.endereco);
	$('#txtEndereco').val(promotor.endereco);
	$('#txtLatitude').val(promotor.localizacao.latitude);
	$('#txtLongitude').val(promotor.localizacao.longitude);
	setEditPointMap(promotor.localizacao.latitude,promotor.localizacao.longitude);
	clickMostrarMapa();
	//$("#btnEndereco").click();
	return promotor;
}

function RESTlistar(id){
	var result;
	ajaxindicatorstart('Aguarde');
	$.getJSON(url+'/'+id,  CallbackListarPorID)
	.fail(function() {
		ajaxindicatorstop() //fail,always,error
		$.MessageBox({
			customClass: "custom_messagebox",
			message: "Ocorreu um erro, tente novamente!"
		});
	});
}

function handleData(data, textStatus, jqXHR,acao) {
	//console.log(JSON.stringify(textStatus));
	//console.log(JSON.stringify(data));
	//console.log(JSON.stringify(jqXHR));

	if (jqXHR.status == 201) {
		$.MessageBox({
			customClass: "custom_messagebox",
			message: "Cadastrado com sucesso!"
		}).done(function(data, button){
				window.location.reload(true);
		});
	}else if (jqXHR.status == 204) {
		if (acao == 'editar') {
			$.MessageBox({
				customClass: "custom_messagebox",
				message: "Atualizado com sucesso!"
			}).done(function(data, button){
				window.location="promotores.html";
			});
		}else	if (acao == 'excluir') {
			$.MessageBox({
				customClass: "custom_messagebox",
				message: "Excluido com sucesso!"
			}).done(function(data, button){
				location.reload(true);
			});
		}
	}else {
		$.MessageBox({
			message: "Ocorreu um erro, tente novamente!"
		});
	}
}

function listar() {
	idPromotor = $("#promotor").val();
	if(idPromotor >= 1){
		RESTlistar(idPromotor)
	}
	else{
		$.MessageBox({
			message: "Selecione um promotor!"
		});
	}
}
