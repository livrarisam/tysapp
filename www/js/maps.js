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
            map.partida = $("#ponto_partida").val();
            map.destino = $("#ponto_destino").val();
            $(".button_comecar").fadeOut();            
            $(".partida").fadeOut();
            $(".button_final_trajeto").fadeIn();
        });
        

        this.bindEvents();
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        map.loadMap();
    },

    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    loadMap: function() {
        var posicao_atual = new google.maps.LatLng(map.latitude, map.longitude);
        var mapOptions = {
            zoom: 16,
            center: posicao_atual,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        map.mapa = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
        google.maps.event.addListenerOnce(map.mapa, 'idle', function(){
            navigator.geolocation.getCurrentPosition(map.onSuccess, map.onError);
        });
        
    },
    
    onSuccess: function(position) {
        map.longitude = position.coords.longitude;
        map.latitude = position.coords.latitude;
        alert(map.latitude);
        alert(map.longitude);
        var posicao_atual = new google.maps.LatLng(map.latitude, map.longitude);
        map.mapa.panTo(posicao_atual);
        
        marker1 = new google.maps.Marker({
            map: map,
            draggable: true,
            position: posicao_atual
        });
    },

    onError: function(error){
        alert("error getting location!");
    }
};

