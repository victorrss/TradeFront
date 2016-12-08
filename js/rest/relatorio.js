//var url = 'https://private-5b99d-tradeplace.apiary-mock.com/promotors';
var url = 'http://localhost:8080/TradeForce/relatorio';
var urlPromotor = 'http://localhost:8080/TradeForce/promotor';
var idPromotor;
var rowsPDF = [];

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

function RESTlistar(id) {
	var rowsPDF = [];
	ajaxindicatorstart('Aguarde');
	$.getJSON(url+'/'+id, function (data) {
		for (var i = 0; i < data.length; i++) {
			rowsPDF.push(
				{"id": "'"+data[i].idTarefa+"'","data": "'"+data[i].data+"'", "mercados": "'"+data[i].quantidadeMercados+"'", "valor": "'"+data[i].valorTotal+"'"}
			);
			var linhaRelatorio =
			'<div class="linha-dados table" id="listTarefa'+data[i].idTarefa+'">'
			+'<div class="td space"></div>'
			+'<div class="td">	'+data[i].data+'				</div>'
			+'<div class="td space"></div>'
			+'<div class="td">					'+data[i].quantidadeMercados+'						</div>'
			+'<div class="td space"></div>'
			+'<div class="td">					'+data[i].valorTotal+'					</div>'
			+'<div class="td space"></div>'
			+'<div class="td">					'+data[i].idTarefa+'					</div>'
			+'<div class="td space"></div>'
			+'</div>'
			console.log(linhaRelatorio);
			$(".lista-dados").append(linhaRelatorio);
		}
		ajaxindicatorstop();
	})
	.fail(function() { //fail,always,error
		$.MessageBox({
			customClass: "custom_messagebox",
			message: "Ocorreu um erro, tente novamente!"
		});
	});
}

function listar() {
	idPromotor = $("#promotor").val();
	if(idPromotor >= 1){
		RESTlistar(idPromotor);
		 $(".export").prop("disabled", false);
	}
	else{
		$.MessageBox({
			message: "Selecione um promotor!"
		});
	}
}
var elementHandler = {
	'#ignoreElement': function (element, renderer) {
		return true;
	},
	'#anotherIdToBeIgnored': function (element, renderer) {
		return true;
	}
};

function exportPDF(){
	var columns = [
		{title: "Tarefa ID", dataKey: "id"},
		{title: "Data Criação", dataKey: "data"},
		{title: "Qtd. Mercados", dataKey: "mercados"},
		{title: "Valor Total", dataKey: "valor"}

	];

	var doc = new jsPDF('p', 'pt');
	doc.autoTable(columns, rowsPDF, {
		margin: {top: 60},
		addPageContent: function(data) {
			doc.text("Relatório Tarefas", 40, 30);
		}
	});
	doc.save('TradePlaceRelatorio.pdf');
}
