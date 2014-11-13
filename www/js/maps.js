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
    latitude: "0",
    longitude: "0",
    velocidade: "", // carro | pe
    partida: "",
    destino: "",
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
            alert(map.partida);
            map.destino = $("#ponto_destino").val();
            alert(map.destino);
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
        navigator.geolocation.getCurrentPosition(map.onSuccess, map.onError);
    },

    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    
    onSuccess: function(position) {
        map.longitude = position.coords.longitude;
        map.latitude = position.coords.latitude;
        var posicao_atual = new google.maps.LatLng(map.latitude, map.longitude);
        var mapOptions = {
            zoom: 16,
            center: posicao_atual,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);

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

