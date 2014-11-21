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

    initialize: function() {
        $("#link1").on("click", function() {
            var navId = $(this).attr('class').split(' ')[0];
            alert(navId);
            player.navId = navId;
        });

        $("#link2").on("click", function() {
            var navId = $(this).attr('class').split(' ')[0];
            alert(navId);
            player.navId = navId;
        });

        $("#link3").on("click", function() {
            var navId = $(this).attr('class').split(' ')[0];
            alert(navId);
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
        var params = {"idUsuario":1};

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
        player.escuro = new Media('http://walkey.com.br/app/musicas/Escuro.mp3', player.nothing, player.nothing, player.onStatusEscuro);
        player.sol    = new Media('http://walkey.com.br/app/musicas/Sol.mp3', player.nothing, player.nothing, player.onStatusSol);
        player.mudanca_rua    = new Media('http://walkey.com.br/app/musicas/Mudan. Rua.mp3', player.nothing, player.nothing, player.onStatusMudanca);
        player.mudanca_rua_2    = new Media('http://walkey.com.br/app/musicas/Mudan. Rua 2.mp3', player.nothing, player.nothing, player.onStatusMudanca2);
        player.rapido    = new Media('http://walkey.com.br/app/musicas/Rapido.mp3', player.nothing, player.nothing, player.onStatusRapido);
        player.introd    = new Media('http://walkey.com.br/app/musicas/Introd..mp3', player.nothing, player.nothing, player.onStatusIntro);

        var params = {"idNavegacao":player.navId};
        $.post("http://walkey.com.br/api/navegacao/get_details", { data: JSON.stringify(params) }, 
            function(data) {
                player.escuro.play();
                player.escuro.setVolume('0.0');
                player.sol.play();
                player.sol.setVolume('0.0');
                player.mudanca_rua.play();
                player.mudanca_rua.setVolume('0.0');
                player.mudanca_rua_2.play();
                player.mudanca_rua_2.setVolume('0.0');
                player.rapido.play();
                player.rapido.setVolume('0.0');
                player.introd.play();
                player.introd.setVolume('0.0');

                player.details = data.details;
                player.songLoop();

            }, "json"
        );
    },

    songLoop: function() {
        var detail = player.details[player.eventId];
        if (!$.isEmptyObject(player.details[player.eventId])) {
            player.playEvent(detail);
            player.eventId = player.eventId + 1;
            setTimeout(function() { player.songLoop(); }, 8000)
        } else { 
            player.escuro.stop();
            player.sol.stop();
            player.mudanca_rua.stop();
            player.mudanca_rua_2.stop();
            player.rapido.stop();
            player.introd.stop();
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

        if (detail.velocidade > 17 && detail.velocidade < 25) {
            player.rapido.setVolume('0.5');
        } else if (detail.velocidade > 25) {
            player.rapido.setVolume('1.0');
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
        if( status==Media.MEDIA_STOPPED ) {
            player.escuro.play();
        }
    },

    onStatusSol: function(status) {
        if( status==Media.MEDIA_STOPPED ) {
            player.sol.play();
        }
    },

    onStatusMudanca: function(status) {
        if( status==Media.MEDIA_STOPPED ) {
            player.mudanca_rua.play();
        }
    },

    onStatusMudanca2: function(status) {
        if( status==Media.MEDIA_STOPPED ) {
            player.mudanca_rua_2.play();
        }
    },

    onStatusRapido: function(status) {
        if( status==Media.MEDIA_STOPPED ) {
            player.rapido.play();
        }
    },

    onStatusIntro: function(status) {
        // zzzz
    }

}