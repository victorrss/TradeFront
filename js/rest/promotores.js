
var url = "http://192.168.0.2:8080/TradeForce/promotor";

$(document).ready(function() {
	$.getJSON(url, function(data) {
		console.log(data);
		for (var i = 0 ; i <= data.length; i++) {
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

			+'<a href="edit'+data[i].id+'"><i class="fa fa-pencil" aria-hidden="true"></i></a>'
			+'<a href="delete'+data[i].id+'"><i class="fa fa-trash" aria-hidden="true"></i></a>'
			+'</div>'
			+'</div>';
			$("#containerMercados").append(linhaMercado);
		}
	});

});
