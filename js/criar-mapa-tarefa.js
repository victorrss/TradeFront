// *
// * Adicionar multiplos marcadores
// * 2013 - www.marnoto.com
// *

// Váriáveis necessárias
var map;
var infoWindow;

// A variável markersData guarda a informação necessária a cada marcador
// Para utilizar este código basta alterar a informação contida nesta variável
var markersData = [
{
	lat: -23.536496,
	lng: -46.646129,
	nome: "SENAI Informatica",
	morada1:"Alameda Barão de Limeira, 539",
	morada2: "Santa Cecilia",
      	codPostal: "São Paulo - SP, 01202-001" // não colocar virgula no último item de cada maracdor
      },
      {
      	lat: -23.542628,
      	lng: -46.619487,
      	nome: "SENAI Textil",
      	morada1:"Rua Correia de Andrade, 232",
      	morada2: "Brás",
	      codPostal: "São Paulo - SP, 03008-020" // não colocar virgula no último item de cada maracdor
	  }
	  ];
	  var mapOptions = {
	  	center: new google.maps.LatLng(-23.542471, -46.618779),
	  	zoom: 16,
	  	mapTypeId: 'roadmap'
	  };
	  function initialize() {
	  	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

   		// cria a nova Info Window com referência à variável infowindow
   		// o conteúdo da Info Window será atribuído mais tarde
   		infoWindow = new google.maps.InfoWindow();

   		// evento que fecha a infoWindow com click no mapa
   		google.maps.event.addListener(map, 'click', function() {
   			infoWindow.close();
   		});

   		// Chamada para a função que vai percorrer a informação
   		// contida na variável markersData e criar os marcadores a mostrar no mapa

   		displayMarkers();
   	}

   	google.maps.event.addDomListener(window, 'load', initialize);



// Esta função vai percorrer a informação contida na variável markersData
// e cria os marcadores através da função createMarker
function displayMarkers(){

   // esta variável vai definir a área de mapa a abranger e o nível do zoom
   // de acordo com as posições dos marcadores
   var bounds = new google.maps.LatLngBounds();

   // Loop que vai estruturar a informação contida em markersData
   // para que a função createMarker possa criar os marcadores
   for (var i = 0; i < markersData.length; i++){

   	var latlng = new google.maps.LatLng(markersData[i].lat, markersData[i].lng);
   	var nome = markersData[i].nome;
   	var morada1 = markersData[i].morada1;
   	var morada2 = markersData[i].morada2;
   	var codPostal = markersData[i].codPostal;

   	createMarker(latlng, nome, morada1, morada2, codPostal);

      // Os valores de latitude e longitude do marcador são adicionados à
      // variável bounds
      bounds.extend(latlng);
  }

   // Depois de criados todos os marcadores
   // a API através da sua função fitBounds vai redefinir o nível do zoom
   // e consequentemente a área do mapa abrangida.
  // map.fitBounds(bounds);

  map.setOptions(mapOptions);

}

// Função que cria os marcadores e define o conteúdo de cada Info Window.
function createMarker(latlng, nome, morada1, morada2, codPostal){
	var marker = new google.maps.Marker({
		map: map,
		position: latlng,
		title: nome
	});

   // Evento que dá instrução à API para estar alerta ao click no marcador.
   // Define o conteúdo e abre a Info Window.
   google.maps.event.addListener(marker, 'click', function() {

      // Variável que define a estrutura do HTML a inserir na Info Window.
      var iwContent = '<div id="iw_container">' +
      '<div class="iw_title">' + nome + '</div>' +
      '<div class="iw_content">' + morada1 + '<br />' +
      morada2 + '<br />' +
      codPostal + '</div> <span>Adicionar Mercado à Tarefa</span></div>';

      // O conteúdo da variável iwContent é inserido na Info Window.
      infoWindow.setContent(iwContent);

      // A Info Window é aberta.
      infoWindow.open(map, marker);
  });
}

/*variavel global para armazenar os promotores vindos do json*/
var promotores = [];
/*faz o filtro para pegar a latitude e longitude do promotor clicado */
function devolveLatLngName(id){
	var latlong = {};
	var id_array;
	for (var i = 0; i < promotores.length; i++) {
		if(promotores[i].id == id){
			latlong.latitude = promotores[i].localizacao.latitude;
			latlong.longitude = promotores[i].localizacao.longitude;
			latlong.nome = promotores[i].nome;
			break;
		}
	}
	// latlong.latitude = promotores[id].localizacao.latitude;
	// latlong.longitude = promotores[id].localizacao.longitude;
	return latlong;

}




var url_server = "http://localhost:8080/TradeForce/";
// var url_server = "http://192.168.0.1:8080/TradeForce/mercado";


function popoulateHandlers(){
	$(document).on("click",".mercados-selecionados .linha-mercados", function(ev){
		ev.preventDefault();
		console.log("jdhsajkdas");
		var id = $(this).data("id");
		excluiSelecaoMercados(id);
	});
	$(document).on("click",".container-todos-mercados .linha-mercados", function(ev){
		ev.preventDefault();
		console.log("nao selecionados");
		var id = $(this).data("id");
		selecionarMercados(id);
	});
}

function ListarPromotores(){
	$(document).ready(function() {
		popoulateHandlers();
		var url_json_promotores = url_server + 'promotor';

		$.getJSON(url_json_promotores, function(json_promout) {
			$('.nome-promo-lista').off('click');
			for (var i = 0 ; i < json_promout.length; i++) {
				console.log(json_promout[i]);
				var linhaPromotor = ''
				+ '<div class="nome-promo-lista">'
				+' <div class="id-promotor">'+json_promout[i].id+'</div>'
				+ json_promout[i].nome +' <i> - '
				+ json_promout[i].empresa.nome+' </i></div>';
				$(".lista-todos-promotores").append(linhaPromotor);
				promotores.push(json_promout[i]);
			}
			$('.nome-promo-lista').on('click', pegaClickSelecao);
		});
	});
}




/*deixa a variavel global para ser usada na centralização do mapa*/
var latlngTratada_promotor;
/* Deixa a posicao init global para ser usado na filtragem dos mercadls */
var posicaoinit = [];




function pegaClickSelecao(event) {
	$(".promotor-selecionado").slideToggle(300);
	/*fazer a formatação para ficar melhor apresentavel o promotor e a empresa*/
	$(".promotor-selecionado .dados-promotor-selecionado").html($(this).html());
	$(".lista-todos-promotores").slideToggle(300);
	/*pega o id do promotor*/
	var id_promotor_selecionado = $(".dados-promotor-selecionado .id-promotor").text();
	/*chama a funcão de filtro*/
	latlngTratada_promotor = devolveLatLngName(id_promotor_selecionado);
	console.log(latlngTratada_promotor);
	centroMapRenderize(latlngTratada_promotor.latitude, latlngTratada_promotor.longitude, latlngTratada_promotor.nome);

	/*coloca a posicao inicial do promotor para a comparação de rotas no raio*/
	posicaoinit = {
		posicao : {
			latitude : latlngTratada_promotor.latitude,
			longitude: latlngTratada_promotor.longitude
		}
	}

	/*Ativar escolha de raio e lista de mercados e retira o aviso */
	$(".container-mercado").slideToggle(300);
	$(".avisoRaio").slideToggle(300);

}



var mercados = [];

/*- Seleciona os que aparecem no raio
------------------------------------*/
function selecionarMercados(id){
	mercados = mercados.map(mercado=>{
		if(mercado.id == id)
			mercado.selecionado = !mercado.selecionado;
		return mercado;
	});
	desenharMercados();
}

/* - Disceleciona os mercados
-----------------------------*/
function excluiSelecaoMercados(id){
	mercados = mercados.map(mercado=>{
		if(mercado.id == id)
			mercado.selecionado = !mercado.selecionado;
		return mercado;
	});
	desenharMercados();
}

function desenharMercados(){
	var $mercadosSelecionadosContainer = $(".mercados-selecionados .lista-dados");
	var $mercadosNaoSelecionadosContainer = $(".container-todos-mercados .lista-dados");
	// ZERANDO O HTML
	$mercadosSelecionadosContainer.html("");
	$mercadosNaoSelecionadosContainer.html("");
	console.log(mercados);
	for (var i = mercados.length - 1; i >= 0; i--) {
		var mercado = mercados[i];
		var mercadoHTML = gerarMercadoHTML(mercado);
		if(mercado.selecionado){
			$mercadosSelecionadosContainer.append(mercadoHTML);
		}else{
			$mercadosNaoSelecionadosContainer.append(mercadoHTML);
		}
	}
}

function gerarMercadoHTML(mercado){
	return $(
		'<div class="linha-mercados" data-id="'+mercado.id+'" id="mercado-id-'+ mercado.id+'">'
			+'<span>'+mercado.id + '</span> - '
			+ mercado.nome
		+ '</div>');
}



function ListarMercados(raio) {
	ajaxindicatorstart('Aguarde');
	$.getJSON(url_server + 'mercado', function (data) {
		mercados = data;
		mercados = mercados.map(mercado=>{
			mercado.selecionado = false;
			return mercado;
		});
		desenharMercados();
		// for (var i = 0; i < data.length; i++) {
		// 	/*seta a posição do mercado para comparar o raio*/
		// 	var posicaoMercado = {
		// 		posicao : {
		// 			latitude : data[i].localizacao.latitude,
		// 			longitude: data[i].localizacao.longitude
		// 		}
		// 	}
		// 	/*chama a funcao que mede a distancia entre mercado e promotor*/
		// 	var distanciaPromotorMercado = positionsreturn(posicaoinit.posicao, posicaoMercado.posicao);
		// 	/*Faz a verificação dos mercados por o raio*/
		// 	if(distanciaPromotorMercado <= raio){
		// 		/* Monta o layout dos mercados do raio */
		// 		var linhaMercado =
		// 		'<div class="linha-mercados" id="mercado-id-'+ data[i].id+'">'
		// 			+'<span>'+data[i].id + '</span> - '
		// 			+ data[i].nome
		// 		+ '</div>';
		// 		$(".lista-dados").append(linhaMercado);
		// 	}
		// }
		// selecionarMercados();
		ajaxindicatorstop()
	})
	.fail(function() { //fail,always,error
		$.MessageBox({
			customClass: "custom_messagebox",
			message: "Ocorreu um erro, tente novamente!"
		});
	});
}

/*Centraliza o Mapa do Promotor*/
function centroMapRenderize(lat, long, nome){
	mapOptions = {
		center: new google.maps.LatLng(lat, long),
		zoom: 16,
		mapTypeId: 'roadmap'
	};
  		// map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

  		var marker = new google.maps.Marker({
  			map: map,
  			position: new google.maps.LatLng(lat, long),
  			title: nome
  		});
  		map.setOptions(mapOptions);
  	}


  	/*Funcao que mede a distancia entre 2 pontos*/
// Objeto para calcular a distancia entre dois pontos
// Adaptado dessa formula http://stackoverflow.com/questions/27928/how-do-i-calculate-distance-between-two-latitude-longitude-points
function positionsreturn( pontoInicial, pontoFinal){
	var R = 6371; // Radio da Terra
	var dLat = this.graus2Radianos( pontoFinal.latitude - pontoInicial.latitude );
	var dLon = this.graus2Radianos( pontoFinal.longitude - pontoInicial.longitude );
	var a = Math.sin( dLat/2 ) * Math.sin( dLat/2 ) + Math.cos( this.graus2Radianos( pontoInicial.latitude ) ) * Math.cos( this.graus2Radianos( pontoFinal.latitude ) ) * Math.sin( dLon/2 ) * Math.sin( dLon/2 );
	var c = 2 * Math.atan2( Math.sqrt( a ), Math.sqrt( 1-a ) );
	var d = R * c;
	return d;
}
function graus2Radianos( graus ){
	return graus * ( Math.PI/180 )
}
