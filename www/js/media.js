var player = {
    // Application Constructor
    latitude: "-23.557060",
    longitude: "-46.633065",
    mapa: null,
    escuro: null,
    sol: null,
    mudanca_rua: null,
    mudanca_rua_2: null,
    rapido: null,
    introd: null,
    navId: 0,
    lastEndereco: "",
    nextEvent: "",
    marker: null,
    coordinates: [],
    eventId: 0,
    countdetails: 1,

    initialize: function() {
        $("#link1").on("click", function() {
            var navId = $(this).attr('class').split(' ')[0];
            player.navId = navId;
        });

        $("#link2").on("click", function() {
            var navId = $(this).attr('class').split(' ')[0];
            player.navId = navId;
        });

        $("#link3").on("click", function() {
            var navId = $(this).attr('class').split(' ')[0];
            player.navId = navId;
        });

        $(".play").on("click", function() {
            player.playSong();
        });

        player.bindEvents();
    },

    onDeviceReady: function() {
        player.loadNavigations();
        player.loadMap();
    },

    bindEvents: function() {
        // this.onDeviceReady();
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },    

    loadNavigations: function() {
        var params = {"idUsuario":window.localStorage["idUsuario"]};

        $.post("http://walkey.com.br/api/navegacao/get_navegation", { data: JSON.stringify(params) }, 
            function(data) {
                $("#link1").addClass(data.result[0].idNavegacao);
                $("#link1").addClass("playlink");
                $("#link1").text(data.result[0].titulo);
                $("#link2").addClass(data.result[1].idNavegacao);
                $("#link2").text(data.result[1].titulo);
                $("#link2").addClass("playlink");
                $("#link3").addClass(data.result[2].idNavegacao);
                $("#link3").text(data.result[2].titulo);
                $("#link3").addClass("playlink");
            }, "json"
        );
    },

    loadMap: function() {
        var posicao_atual = new google.maps.LatLng(player.latitude, player.longitude);
        var mapOptions = {
            zoom: 16,
            center: posicao_atual,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            disableDefaultUI: true
        };

        player.mapa = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);

        $("#map_canvas").css("top", "230px");
    },

    playSong: function() {
        var path = '/android_asset/www/musicas/';
        player.escuro = new Media(path+'escuro.mp3', player.nothing, player.nothing, player.onStatusEscuro);
        player.sol    = new Media(path+'sol.mp3', player.nothing, player.nothing, player.onStatusSol);
        player.mudanca_rua    = new Media(path+'mudanca_rua.mp3', player.nothing, player.nothing, player.onStatusMudanca);
        player.mudanca_rua_2    = new Media(path+'mudanca_rua_2.mp3', player.nothing, player.nothing, player.onStatusMudanca2);

        var params = {"idNavegacao":player.navId};
        $.post("http://walkey.com.br/api/navegacao/get_details", { data: JSON.stringify(params) }, 
            function(data) {
                for (var key in data.details) {
                    player.countdetails = key;
                }

                player.details = data.details;
                player.songLoop();

            }, "json"
        );
    },

    songLoop: function() {
        if (player.eventId == 0) {
            player.escuro.play();
            player.escuro.setVolume('0.0');
            player.sol.play();
            player.sol.setVolume('0.0');
            player.mudanca_rua.play();
            player.mudanca_rua.setVolume('0.0');
            player.mudanca_rua_2.play();
            player.mudanca_rua_2.setVolume('0.0');
        }

        if (player.eventId <= player.countdetails) {
            var detail = player.details[player.eventId];
            player.playEvent(detail);
            player.eventId = player.eventId + 1;

            setTimeout(function() { player.songLoop(); }, 11000);
        } else {
            player.sol.stop();
            player.escuro.stop();
            player.mudanca_rua.stop();
            player.mudanca_rua_2.stop();
        }
    },

    playEvent: function(detail) {
        if (player.nextEvent == "") {
            player.lastEndereco = player.endereco;
            if (detail.temperatura < 20) {
                player.sol.setVolume('0.0');
                player.mudanca_rua.setVolume('0.0');
                player.mudanca_rua_2.setVolume('0.0');

                player.escuro.setVolume('0.5');
                player.nextEvent = "mudanca_rua_2";
            } else {
                player.mudanca_rua.setVolume('0.0');
                player.mudanca_rua_2.setVolume('0.0');                
                player.escuro.setVolume('0.0');

                player.sol.setVolume('0.5');
                player.nextEvent = "mudanca_rua";
            }
        } else {
            if (detail.endereco != player.endereco) {
                if (player.nextEvent == "mudanca_rua") {
                    player.sol.setVolume('0.0');
                    player.escuro.setVolume('0.0');
                    player.mudanca_rua_2.setVolume('0.0');                    

                    player.mudanca_rua.setVolume('0.5');
                    player.nextEvent = "clima";
                } else if (player.nextEvent == "mudanca_rua_2") {
                    player.sol.setVolume('0.0');
                    player.mudanca_rua.setVolume('0.0');
                    player.escuro.setVolume('0.0');                    

                    player.mudanca_rua_2.setVolume('0.5');
                    player.nextEvent = "clima";
                } else if (player.nextEvent == "clima") {
                    if (detail.temperatura < 20) {
                        player.sol.setVolume('0.0');
                        player.mudanca_rua.setVolume('0.0');
                        player.mudanca_rua_2.setVolume('0.0');                    

                        player.escuro.setVolume('0.5');
                        player.nextEvent = "mudanca_rua";
                    } else {
                        player.mudanca_rua.setVolume('0.0');
                        player.escuro.setVolume('0.0');
                        player.mudanca_rua_2.setVolume('0.0');

                        player.sol.setVolume('0.5');
                        player.nextEvent = "mudanca_rua_2";
                    }
                }
            }
        }

        var posicao_atual = new google.maps.LatLng(detail.latitude, detail.longitude);
        player.mapa.panTo(posicao_atual);
        player.mapa.setZoom(15);

        player.coordinates.push(posicao_atual);
        var flightPath = new google.maps.Polyline({
            path: player.coordinates,
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 3
        });
        flightPath.setMap(player.mapa);
    },

    nothing: function() {
        //zzz
    },

    onStatusEscuro: function(status) {
        if( status==Media.MEDIA_STOPPED && player.eventId < player.countdetails ) {
            player.escuro.play();
        }
    },

    onStatusSol: function(status) {
        if( status==Media.MEDIA_STOPPED && player.eventId < player.countdetails ) {
            player.sol.play();
        }
    },

    onStatusMudanca: function(status) {
        if( status==Media.MEDIA_STOPPED && player.eventId < player.countdetails ) {
            player.mudanca_rua.play();
        }
    },

    onStatusMudanca2: function(status) {
        if( status==Media.MEDIA_STOPPED && player.eventId < player.countdetails ) {
            player.mudanca_rua_2.play();
        }
    }

}