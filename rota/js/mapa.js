var map;
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var seqLatLng = [];

function initialize() {
	directionsDisplay = new google.maps.DirectionsRenderer();
	var latlng = new google.maps.LatLng(-18.8800397, -47.05878999999999);

	var options = {
		zoom: 5,
		center: latlng,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};

	map = new google.maps.Map(document.getElementById("mapa"), options);
	directionsDisplay.setMap(map);
	directionsDisplay.setPanel(document.getElementById("trajeto-texto"));

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function (position) {

			pontoPadrao = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			map.setCenter(pontoPadrao);

			var geocoder = new google.maps.Geocoder();

			geocoder.geocode({
				"location": new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
			},
			function(results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					$("#txtEnderecoPartida").val(results[0].formatted_address);
				}
			});
		});
	}
}

initialize();

$("form").submit(function(event) {
	event.preventDefault();
	var enderecoPartida = 'Rua Ribeirão preto N 66 - Cidade Soberana';
	var enderecoChegada = 'Rua Ribeirão preto N 66 - Cidade Soberana';
	var request = {
		   	origin: enderecoPartida,
		   	destination: enderecoChegada,
		   	waypoints: [
						{location: 'Rua Macarani - Jardim Presidente Dutra'},
						{location: 'Rua mutuipe - Jardim Presidente Dutra'}
					],
		travelMode: google.maps.TravelMode.DRIVING,
		unitSystem: google.maps.UnitSystem.IMPERIAL
	};

	directionsService.route(request, function(result, status) {
		if (status == google.maps.DirectionsStatus.OK) {



			for (var i = 0; i < result.routes[0].legs.length; i++) {
				var object_a = JSON.stringify(result.routes[0].legs[i].end_location);
				var object_b = JSON.parse(object_a);
				seqLatLng.push({"seq": i,"lat": object_b.lat, "lng": object_b.lng});
			}
			directionsDisplay.setDirections(result);

		}
	});

	$.getJSON('js/pontos-rota.json', function(dados) {
	    for(var i=0; i<dados.length; i++) {
	        $(document.body).append('<div> Sequencia' + dados[i].seq + ' </div>');
	        $(document.body).append('<div> Latitude' + dados[i].lat + ' </div>');
	        $(document.body).append('<div> Longitude' + dados[i].lng + ' </div> <br />');
	    }
	});
});