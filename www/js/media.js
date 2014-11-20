var player = {
    // Application Constructor
    audio_escuro: null,
    audio_sol: null,

    initialize: function() {
        player.audio_escuro = new Media('/android_asset/www/musicas/escuro.mp3', player.nothing, player.nothing, player.onStatus);
        player.audio_sol    = new Media('/android_asset/www/musicas/sol.mp3', player.nothing, player.nothing, player.onStatus);
        player.audio_escuro.play();
        player.audio_escuro.setVolume('0.0');
        player.audio_sol.play();
        player.audio_sol.setVolume('0.0');
        setTimeout(function() { player.playEscuro(); }, 3000);
    },

    playEscuro: function() {
        player.audio_sol.setVolume('0.0');
        player.audio_escuro.setVolume('1.0');
        setTimeout(function() { player.lowEscuro(); }, 5000);
    },

    lowEscuro: function() {
        player.audio_escuro.setVolume('0.2');
        setTimeout(function() { player.playSol(); }, 5000);
    },

    playSol: function() {
        player.audio_escuro.setVolume('0.0');        
        player.audio_sol.setVolume('1.0');
        setTimeout(function() { player.lowSol(); }, 5000);
    },

    lowSol: function() {
        player.audio_sol.setVolume('0.2');
        setTimeout(function() { player.playEscuro(); }, 5000);
    },

    nothing: function() {
        //zzz
    },

    onStatus: function() {
        //zzz
    }

}