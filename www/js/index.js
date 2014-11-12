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

var app = {
    // Application Constructor
    latitude: "0",
    longitude: "0",
    initialize: function() {

        $("#btn_login").on("click", function(e) {
            e.preventDefault();
            var u = $("#login_email").val();
            var p = $("#login_senha").val();
            alert("cliquei");
            $.post("http://walkey.com.br/api/usuarios/login", {data: "{\"email\":\""+u+"\",\"senha\":\""+p+"\"}"}, 
                function(data) {
                    alert(data.result);
                    if (data.result = "sucesso") {
                        window.localStorage["idUsuario"] = data.idUsuario;
                        window.localStorage["nome"] = data.nome;
                        window.localStorage["sobrenome"] = data.sobrenome;
                        window.localStorage["email"] = data.email;
                        window.localStorage["logged"] = true;
                        $("#frm_login").submit();
                    } else {
                        navigator.notification.alert(data.error_string, function() {});
                    }
                }, "json"
            );            
        });

        $("#frmCadastro").submit(function(e){
            var nome = $("#nome", this).val();
            var login = $("#login", this).val();
            var email = $("#email", this).val();
            var senha = $("#senha", this).val();
            $.post("http://walkey.com.br/api/usuarios/create", {data: '{"nome":"'+nome+'","sobrenome":"'+login+'","email":"'+email+'","senha":"'+senha+'"}'}, 
                function(data) {
                    if (data.result == "erro") {
                        e.preventDefault();
                        navigator.notification.alert(data.error_string, function() {});
                        return false;
                    } else {
                        window.localStorage["idUsuario"] = data.idUsuario;
                        window.localStorage["nome"] = data.nome;
                        window.localStorage["sobrenome"] = data.sobrenome;
                        window.localStorage["email"] = data.email;
                        window.localStorage["logged"] = true;
                        navigator.notification.alert("Cadastro OK", function() {});
                        return true;
                    }
                }, "json"
            );
        });

        // this.bindEvents();
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        initializeMedia();
        navigator.geolocation.getCurrentPosition(app.onSuccess, app.onError);
    },

    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    
    onSuccess: function(position) {
        app.longitude = position.coords.longitude;
        app.latitude = position.coords.latitude;
    },

    onError: function(error){
        alert("error!");
    }
};

