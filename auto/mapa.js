var geocoder;
var map;
var marker;

function initialize() {
	var latlng = new google.maps.LatLng(-18.8800397, -47.05878999999999);
	var options = {
		zoom: 5,
		center: latlng,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};

	map = new google.maps.Map(document.getElementById("mapa"), options);

	geocoder = new google.maps.Geocoder();

	marker = new google.maps.Marker({
		map: map,
		draggable: true,
	});

	marker.setPosition(latlng);
}

$(document).ready(function () {

	initialize();

	function carregarNoMapa(endereco) {
		geocoder.geocode({ 'address': endereco + ', Brasil', 'region': 'BR' }, function (results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				if (results[0]) {
					var latitude = results[0].geometry.location.lat();
					var longitude = results[0].geometry.location.lng();

					$('#txtEndereco').val(results[0].formatted_address);
					$('#txtLatitude').val(latitude);
					$('#txtLongitude').val(longitude);

					var location = new google.maps.LatLng(latitude, longitude);
					marker.setPosition(location);
					map.setCenter(location);
					map.setZoom(16);
				}
			}
		})
	}

	$("#btnEndereco").click(function() {
		if($('#userEndereco').val().length < 5){
			$.MessageBox({
			customClass : "custom_messagebox",
			message     : "Digite o endereço corretamente!"
			});
			return;
		}
		var tipo_logradouro = $('#tipo_logradouro').val()
		var endereco = $('#userEndereco').val();
		if(endereco == null && endereco == undefined){
			endereco = " ";
		}
		$('#txtEndereco').val(endereco);

		if($(this).val() != "")
			carregarNoMapa($("#txtEndereco").val());
	})

	$("#txtEndereco").blur(function() {
		if($(this).val() != "")
			carregarNoMapa($(this).val());
	})

	google.maps.event.addListener(marker, 'drag', function () {
		geocoder.geocode({ 'latLng': marker.getPosition() }, function (results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				if (results[0]) {
					$('#txtEndereco').val(results[0].formatted_address);
					$('#txtLatitude').val(marker.getPosition().lat());
					$('#txtLongitude').val(marker.getPosition().lng());
				}
			}
		});
	});

	$("#txtEndereco").autocomplete({
		source: function (request, response) {
			geocoder.geocode({ 'address': request.term + ', Brasil', 'region': 'BR' }, function (results, status) {
				response($.map(results, function (item) {
					return {
						label: item.formatted_address,
						value: item.formatted_address,
						latitude: item.geometry.location.lat(),
						longitude: item.geometry.location.lng()
					}
				}));
			})
		},
		select: function (event, ui) {
			$("#txtLatitude").val(ui.item.latitude);
			$("#txtLongitude").val(ui.item.longitude);
			var location = new google.maps.LatLng(ui.item.latitude, ui.item.longitude);
			marker.setPosition(location);
			map.setCenter(location);
			map.setZoom(16);
		}
	});


});
function setEditPointMap(lat, long){ //Promotor e Mercado
	mapOptions = {
		center: new google.maps.LatLng(lat, long),
		zoom: 16,
		mapTypeId: 'roadmap'
	};
	  map.setOptions(mapOptions);
	var latlng = new google.maps.LatLng(lat, long);

	marker = new google.maps.Marker({
		map: map,
		draggable: true,
	});

	marker.setPosition(latlng);

	google.maps.event.addListener(marker, 'dragend', function(marker){
        var latLng = marker.latLng;
        currentLatitude = latLng.lat();
        currentLongitude = latLng.lng();
        $("#txtLatitude").val(currentLatitude);
				$("#txtLongitude").val(currentLongitude);
     });

	google.maps.event.addListener(marker, 'drag', function () {
 		geocoder.geocode({ 'latLng': marker.getPosition() }, function (results, status) {
 			if (status == google.maps.GeocoderStatus.OK) {
 				if (results[0]) {
					$('#userEndereco').val(results[0].formatted_address);
 					$('#txtEndereco').val(results[0].formatted_address);
 				}
 			}
 		});
 	});
}
