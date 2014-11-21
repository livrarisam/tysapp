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
    velocidade: "", // A | C
    partida: "",
    destino: "",
    mapa: null,
    directionsService: null,
    directionsDisplay: null,
    texto: "",
    watchID: null,
    marker: null,
    coordinates: [],
    navtime: 0,
    navId: 0,

    initialize: function() {
        $(".btn_carro").on("click", function() {
            map.velocidade = "C";
            $(".buttons_velocidade").fadeOut();
            $(".partida").fadeIn();
            $(".button_comecar").fadeIn();
        });

        $(".btn_pe").on("click", function() {
            map.velocidade = "A";
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
            navigator.geolocation.clearWatch(map.watchID);
            $(".button_final_trajeto").fadeOut();
            $(".title_iniciar_rota").fadeOut();
            window.location.replace("play_musica.html");
            // player.initialize();
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

    getCoords: function(address) {
        geocoder.geocode( { 'address': address}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                return results[0].geometry.location.LatLng;
            } else{
                return status;
            }
        });
    },

    findRoute: function() {
        // var partida_address = document.getElementById("ponto_partida").value;
        var partida_address = map.latitude+", "+map.longitude;
        var destino_address = document.getElementById("ponto_destino").value;
        var modo = null;
        if (map.velocidade == "C") {
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
                var params = {"idUsuario":1, "tipo":map.velocidade, "latitude": map.latitude, "longitude":map.longitude};

                $.post("http://walkey.com.br/api/navegacao/create", { data: JSON.stringify(params) }, 
                    function(data) {
                        if (data.error_code == 0) { 
                            map.navId = data.idNavegacao;
                            map.startNavigation();
                        } else {
                            alert("Erro, tente novamente.");
                        }
                    }, "json"
                );
            } else {
                alert("Error: Endereço não encontrado.");
            }
        });
    },

    startNavigation: function() {
        $(".button_final_trajeto").fadeIn();

        var posicao_atual = new google.maps.LatLng(map.latitude, map.longitude);
        map.marker = new google.maps.Marker({
            position: posicao_atual,
            map: map.mapa,
            // icon: "img/pin_maps.png",
        });

        var options = {enableHighAccuracy:true, maximumAge:0, timeout:30000 };
        navigator.geolocation.getCurrentPosition( map.onWatchSuccess, map.onError, options );
        map.watchID = navigator.geolocation.watchPosition( map.onWatchSuccess, map.onError, options );
    },

    onWatchSuccess: function (position) {
        var lat = position.coords.latitude;
        var lon = position.coords.longitude;
        var speed = position.coords.speed;
        var navtime = new Date().getTime();
        var end = "";

        var posicao_atual = new google.maps.LatLng(lat, lon);
        map.mapa.panTo(posicao_atual);
        map.mapa.setZoom(17);
        map.marker.setPosition(posicao_atual);

        map.coordinates.push(posicao_atual);
        var flightPath = new google.maps.Polyline({
            path: map.coordinates,
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 3
        });
        flightPath.setMap(map.mapa);

        if ((navtime - map.navtime) > 20000) {
            if (map.navtime > 0) {

                var params = {"idNavegacao":map.navId, "velocidade":speed, "latitude": lat, "longitude":lon, "timestamp": navtime};
                $.post("http://walkey.com.br/api/navegacao/monitoring", { data: JSON.stringify(params) }, 
                    function(data) {
                        lat = data.latprox;
                        lon = data.lonprox;
                    }, "json"
                );
            }
            map.navtime = navtime;
        }
    },

    onError: function(error){
        $(".status_panel").html("<strong>Erro!</strong>");
    }
};

