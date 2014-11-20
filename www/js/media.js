var player = {
    // Application Constructor
    escuro: null,
    sol: null,
    mudanca_rua: null,
    mudanca_rua_2: null,
    rapido: null,
    introd: null,

    initialize: function() {
        var path = 'android_asset/www/musicas/';
        player.escuro = new Media('http://walkey.com.br/app/musicas/Escuro.mp3', player.nothing, player.nothing, player.onStatusEscuro);
        player.sol    = new Media('http://walkey.com.br/app/musicas/Sol.mp3', player.nothing, player.nothing, player.onStatusSol);
        player.mudanca_rua    = new Media('http://walkey.com.br/app/musicas/Mudan. Rua.mp3', player.nothing, player.nothing, player.onStatusMudanca);
        player.mudanca_rua_2    = new Media('http://walkey.com.br/app/musicas/Mudan. Rua 2.mp3', player.nothing, player.nothing, player.onStatusMudanca2);
        player.rapido    = new Media('http://walkey.com.br/app/musicas/Rapido.mp3', player.nothing, player.nothing, player.onStatusRapido);
        player.introd    = new Media('http://walkey.com.br/app/musicas/Introd..mp3', player.nothing, player.nothing, player.onStatusIntro);

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
        setTimeout(function() { player.playSong(); }, 4000);
    },

    playSong: function() {
        player.introd.setVolume('0.5');
        alert("prox");
        player.introd.setVolume('0.0');
        player.escuro.setVolume('0.5');
        alert("prox");
        player.escuro.setVolume('0.0');
        player.mudanca_rua_2.setVolume('0.5');
        alert("prox");
        player.mudanca_rua_2.setVolume('0.0');
        player.escuro.setVolume('0.5');
        alert("prox");
        player.rapido.setVolume('0.5');
        alert("prox");
        player.rapido.setVolume('1.0');

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