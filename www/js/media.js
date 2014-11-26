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
        var path = '/android_asset/www/musicas/';
        alert(path+'escuro.mp3');
        
        player.escuro = new Howl({
            urls: [path+'escuro.mp3'],
            loop: true,
            volume: 0.5,
            autoplay: true
        });

        player.sol = new Howl({
            urls: [path+'sol.mp3'],
            loop: true,
            volume: 0.0
        });  

        player.mudanca_rua = new Howl({
            urls: [path+'mudanca_rua.mp3'],
            loop: true,
            volume: 0.0
        });  

        player.mudanca_rua_2 = new Howl({
            urls: [path+'mudanca_rua_2.mp3'],
            loop: true,
            volume: 0.0
        });         
        
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
        $("#map_canvas").css("height", "400px");
    },

    playSong: function() {
        var params = {"idNavegacao":player.navId};
        $.post("http://walkey.com.br/api/navegacao/get_details", { data: JSON.stringify(params) }, 
            function(data) {
                for (var key in data.details) {
                    player.countdetails = key;
                }

                player.details = data.details;
                player.coordinates = [];
                player.eventId = 0;
                player.songLoop();

            }, "json"
        );
    },

    songLoop: function() {
        if (player.eventId <= player.countdetails) {
            var detail = player.details[player.eventId];
            player.playEvent(detail);
            player.eventId = player.eventId + 1;
            setTimeout(function() { player.songLoop(); }, 3500);

        } else { 
            player.escuro.stop();
            player.sol.stop();
            player.mudanca_rua.stop();
            player.mudanca_rua_2.stop();
        } 
    },

    playEvent: function(detail) {
        if (player.nextEvent == "") {
            player.lastEndereco = detail.endereco;
            if (detail.temperatura < 20) {
                if (player.sol.volume() > 0) { player.sol.fadeOut(0, 900); }
                if (player.mudanca_rua.volume() > 0) { player.mudanca_rua.fadeOut(0, 900); }
                if (player.mudanca_rua_2.volume() > 0) { player.mudanca_rua_2.fadeOut(0, 900); }

                if (player.escuro.volume() == 0) { player.escuro.fadeIn(0.4, 900); }
                player.nextEvent = "mudanca_rua_2";
            } else {
                if (player.mudanca_rua.volume() > 0) { player.mudanca_rua.fadeOut(0, 900); }
                if (player.mudanca_rua_2.volume() > 0) { player.mudanca_rua_2.fadeOut(0, 900); }
                if (player.escuro.volume() > 0) { player.escuro.fadeOut(0, 900); }

                if (player.sol.volume() == 0) { player.sol.fadeIn(0.4, 900); }
                player.nextEvent = "mudanca_rua";
            }
        } else {
            if (detail.endereco != player.lastEndereco) {
                player.lastEndereco = detail.endereco;
                if (player.nextEvent == "mudanca_rua") {
                    if (player.sol.volume() > 0) { player.sol.fadeOut(0, 900); }
                    if (player.escuro.volume() > 0) { player.escuro.fadeOut(0, 900); }
                    if (player.mudanca_rua_2.volume() > 0) { player.mudanca_rua_2.fadeOut(0, 900); }

                    if (player.mudanca_rua.volume() == 0) { player.mudanca_rua.fadeIn(0.4, 900); }
                    player.nextEvent = "clima";
                } else if (player.nextEvent == "player.mudanca_rua_2") {
                    player.sol.fadeOut(0, 900);
                    player.mudanca_rua.fadeOut(0, 900);
                    player.escuro.fadeOut(0, 900);                    

                    player.mudanca_rua_2.fadeIn(0.4, 900);
                    player.nextEvent = "clima";
                } else if (player.nextEvent == "clima") {
                    if (detail.temperatura < 20) {
                        player.sol.fadeOut(0, 900);
                        player.mudanca_rua.fadeOut(0, 900);
                        player.mudanca_rua_2.fadeOut(0, 900);                    

                        player.escuro.fadeIn(0.4, 900);
                        player.nextEvent = "mudanca_rua";
                    } else {
                        player.mudanca_rua.fadeOut(0, 900);
                        player.escuro.fadeOut(0, 900);
                        player.mudanca_rua_2.fadeOut(0, 900);

                        player.sol.fadeIn(0.4, 900);
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
    }
}