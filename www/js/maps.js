/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var map = {
    // Application Constructor
    latitude: "-23.557060",
    longitude: "-46.633065",
    velocidade: "", // carro | pe
    partida: "",
    destino: "",
    mapa: null,
    directionsService: null,
    directionsDisplay: null,
    texto: "",
    watchID: null,
    marker: null,
    navigation: false,
    coordinates: [],

    initialize: function() {
        $(".btn_carro").on("click", function() {
            map.velocidade = "carro";
            $(".buttons_velocidade").fadeOut();
            $(".partida").fadeIn();
            $(".button_comecar").fadeIn();
        });

        $(".btn_pe").on("click", function() {
            map.velocidade = "pe";
            $(".buttons_velocidade").fadeOut();
            $(".partida").fadeIn();
            $(".button_comecar").fadeIn();
        });

        $(".btn_comecar").on("click", function() {
            // map.partida = $("#ponto_partida").val();
            // map.destino = $("#ponto_destino").val();
            $(".button_comecar").fadeOut();            
            $(".partida").fadeOut();
            map.findRoute();
        });
        
        $(".button_final_trajeto").on("click", function() {
            alert("Fim trajeto!");
            map.navigation = false;
        });

        this.bindEvents();
    },

    onDeviceReady: function() {
        console.log("onDeviceReady");
        map.loadMap();
    },

    bindEvents: function() {
        // this.onDeviceReady();
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    loadMap: function() {
        console.log("maps");
        console.log(google);
        map.directionsService = new google.maps.DirectionsService();
        map.directionsDisplay = new google.maps.DirectionsRenderer();

        var posicao_atual = new google.maps.LatLng(map.latitude, map.longitude);
        var mapOptions = {
            zoom: 16,
            center: posicao_atual,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            disableDefaultUI: true
        };

        map.mapa = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
        google.maps.event.addListenerOnce(map.mapa, 'idle', function(){
            map.directionsDisplay.setMap(map.mapa);
            navigator.geolocation.getCurrentPosition(map.onSuccess, map.onError);
        });
        
    },
    
    onSuccess: function(position) {
        map.longitude = position.coords.longitude;
        map.latitude = position.coords.latitude;
    },

    findRoute: function() {
        // var partida_address = document.getElementById("ponto_partida").value;
        var partida_address = map.latitude+", "+map.longitude;
        var destino_address = document.getElementById("ponto_destino").value;
        var modo = null;
        if (map.velocidade == "carro") {
            modo = google.maps.TravelMode.DRIVING;
        } else {
            modo = google.maps.TravelMode.WALKING;
        }
        var request = {
            origin: partida_address,
            destination: destino_address,
            travelMode: modo
        };
        map.directionsService.route(request, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                map.directionsDisplay.setDirections(response);
                map.getWeather();
            } else {
                alert("Error: Endereço não encontrado.");
            }
        });
    },

    getWeather: function() {
        $.post("http://walkey.com.br/api/weather", { lat: map.latitude, lon: map.longitude }, 
            function(data) {
                map.texto = "Sua localização: "+map.latitude+", "+map.longitude+".\r Clima atual: "+data.weather[0].main+",\r Temperatura: "+data.main.temp+"ºC. Ponto de partida: "+$("#ponto_partida").val()+". Destino: "+ $("#ponto_destino").val()+".";
                $(".button_final_trajeto").fadeIn();

                var posicao_atual = new google.maps.LatLng(map.latitude, map.longitude);
                map.marker = new google.maps.Marker({
                    position: posicao_atual,
                    map: map.mapa,
                    icon: "img/pin_maps.png",
                });

                map.navigation = true;
                var options = {enableHighAccuracy:true, maximumAge:0, timeout:5000 };
                navigator.geolocation.getCurrentPosition( map.onWatchSuccess, map.onError, options );
            }, "json"
        );
    },
    onWatchSuccess: function (position) {
        var lat = position.coords.latitude;
        var lon = position.coords.longitude;
        var speed = position.coords.speed;
        var end = "";
         $.post("http://maps.googleapis.com/maps/api/geocode/json?latlng="+lat+","+lon+"&sensor=true", {}, 
            function(data) {
                lat = data.results[0].geometry.location.lat;
                lon = data.results[0].geometry.location.lng;
                end = data.results[0].address_components[1].long_name;

                var posicao_atual = new google.maps.LatLng(lat, lon);
                map.coordinates.push(posicao_atual);
                map.mapa.panTo(posicao_atual);
                map.mapa.setZoom(17);
                map.marker.setPosition(posicao_atual);

                var result  = "Latitude: "+lat+"<br>";
                    result += "Longitude: "+lon+"<br>";
                    result += "velocidade: "+speed+"<br>";
                    result += "Endereço: "+end+"<br>";
                $(".status_panel").html(result);

                var flightPath = new google.maps.Polyline({
                    path: map.coordinates,
                    geodesic: true,
                    strokeColor: '#FF0000',
                    strokeOpacity: 1.0,
                    strokeWeight: 2
                  });

                  flightPath.setMap(map.mapa);

            }, "json"
        );
        if (map.navigation) {
            var options = {enableHighAccuracy:true, maximumAge:0, timeout:5000 };
            setTimeout(function() { navigator.geolocation.getCurrentPosition( map.onWatchSuccess, map.onError, options ) },
                20000);
        }
    },

    onError: function(error){
        // alert("We got some error!");
    }
};

