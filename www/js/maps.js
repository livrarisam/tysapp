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
            navigator.geolocation.clearWatch(map.watchID);
            alert(map.texto);
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
            zoom: 15,
            center: posicao_atual,
            mapTypeId: google.maps.MapTypeId.ROADMAP
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
        var posicao_atual = new google.maps.LatLng(map.latitude, map.longitude);
        map.mapa.panTo(posicao_atual);
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
        var partida_address = document.getElementById("ponto_partida").value;
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
                    title:"Hello World!"
                });

                var options = {enableHighAccuracy: true,timeout: 5000,maximumAge: 0,desiredAccuracy: 0, frequency: 1 };
                map.watchID = navigator.geolocation.watchPosition( map.onWatchSuccess, map.onError, options );
            }, "json"
        );
    },
    onWatchSuccess: function (position) {
        var posicao_atual = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        map.mapa.panTo(posicao_atual);
        map.marker.setPosition(posicao_atual);
        //  $.post("http://walkey.com.br/api/usuarios/teste", position, 
        //     function(data) {
        //         alert(data.result);
        //     }, "json"
        // );
    },

    onError: function(error){
        // alert("We got some error!");
    }
};

