var player = {
    // Application Constructor
    audio_escuro: null,
    audio_sol: null,

    initialize: function() {
        var path = 'android_asset/www/musicas/';
        player.audio_escuro = new Media('http://walkey.com.br/app/musicas/Escuro.mp3', player.nothing, player.nothing, player.onStatusEscuro);
        player.audio_sol    = new Media('http://walkey.com.br/app/musicas/Sol.mp3', player.nothing, player.nothing, player.onStatusSol);
        player.audio_escuro.play();
        player.audio_escuro.setVolume('0.0');
        player.audio_sol.play();
        player.audio_sol.setVolume('0.0');
        setTimeout(function() { player.playEscuro(); }, 4000);
    },

    playEscuro: function() {
        player.audio_sol.setVolume('0.0');
        player.audio_escuro.setVolume('1.0');
        setTimeout(function() { player.playSol(); }, 4000);
    },

    lowEscuro: function() {
        player.audio_escuro.setVolume('0.2');
        setTimeout(function() { player.playSol(); }, 4000);
    },

    playSol: function() {
        player.audio_escuro.setVolume('0.0');        
        player.audio_sol.setVolume('1.0');
        setTimeout(function() { player.playEscuro(); }, 4000);
    },

    lowSol: function() {
        player.audio_sol.setVolume('0.2');
        setTimeout(function() { player.playEscuro(); }, 4000);
    },

    nothing: function() {
        //zzz
    },

    onStatusEscuro: function(status) {
        if( status==Media.MEDIA_STOPPED ) {
            player.audio_escuro.play();
        }
    },

    onStatusSol: function(status) {
        if( status==Media.MEDIA_STOPPED ) {
            player.audio_sol.play();
        }
    }

}