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
/*faz o filtro para pegar a latitude e longitude do cara clicado */
function devolveLatLng(id){
	var latlong = {};
	latlong.latitude = promotores[id].localizacao.latitude;
	latlong.longitude = promotores[id].localizacao.longitude;
	return latlong;
}
function ListarPromotores(){
	$(document).ready(function() {
		var url_json_promotores = "https://private-5b99d-tradeplace.apiary-mock.com/promotor";
		$.getJSON(url_json_promotores, function(json_promout) {
			$('.nome-promo-lista').off('click');
			for (var i = 0 ; i < json_promout.length; i++) {
				var linhaPromotor = ''
				+ '<div class="nome-promo-lista">'+' <div class="id-promotor">'+json_promout[i].id+'</div>'  + json_promout[i].nome +' <i>  '+ json_promout[i].empresa+' </i></div>';
				$(".lista-todos-promotores").append(linhaPromotor);
				promotores.push(json_promout[i]);
			}
			$('.nome-promo-lista').on('click', pegaClickSelecao);
		});
	});
}
/*deixa a variavel global para ser usada na centralização do mapa*/
var latlngTratada;
function pegaClickSelecao(event) {
	$(".promotor-selecionado").slideToggle(300);
	/*fazer a formatação para ficar melhor apresentavel o cara e a empresa*/
	$(".promotor-selecionado .dados-promotor-selecionado").html($(this).html());
	$(".lista-todos-promotores").slideToggle(300);
	/*pega o id do promotor*/
	var id_promotor_selecionado = $(".dados-promotor-selecionado .id-promotor").text();
	/*chama a funcão de filtro*/
	latlngTratada = devolveLatLng(id_promotor_selecionado);
	console.log(latlngTratada.latitude);
	console.log(latlngTratada.longitude);
	centroMapRenderize(latlngTratada.latitude, latlngTratada.longitude);
}



function centroMapRenderize(lat, long){
	console.log("adas");
	mapOptions = {
		center: new google.maps.LatLng(lat, long),
		zoom: 16,
		mapTypeId: 'roadmap'
	};
	  map.setOptions(mapOptions);
}