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

    initialize: function() {
        $(".playlink").on("click", function() {
            var navId = $(this).attr('class').split(' ')[0];
            alert(navId);
            player.playSong(navId);
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
        alert("loadNavigations1");

        $.post("http://walkey.com.br/api/navegacao/get_navegation", { data: JSON.stringify(params) }, 
            function(data) {
                alert("loadNavigations2");
                alert(data.result[0].idNavegacao);
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

    playSong: function(navId) {
        player.escuro = new Media('http://walkey.com.br/app/musicas/Escuro.mp3', player.nothing, player.nothing, player.onStatusEscuro);
        player.sol    = new Media('http://walkey.com.br/app/musicas/Sol.mp3', player.nothing, player.nothing, player.onStatusSol);
        player.mudanca_rua    = new Media('http://walkey.com.br/app/musicas/Mudan. Rua.mp3', player.nothing, player.nothing, player.onStatusMudanca);
        player.mudanca_rua_2    = new Media('http://walkey.com.br/app/musicas/Mudan. Rua 2.mp3', player.nothing, player.nothing, player.onStatusMudanca2);
        player.rapido    = new Media('http://walkey.com.br/app/musicas/Rapido.mp3', player.nothing, player.nothing, player.onStatusRapido);
        player.introd    = new Media('http://walkey.com.br/app/musicas/Introd..mp3', player.nothing, player.nothing, player.onStatusIntro);

        alert(navId);

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