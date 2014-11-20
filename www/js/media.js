var player = {
    // Application Constructor
    audio_escuro: null,
    audio_sol: null,

    initialize: function() {
        player.audio_escuro = new Media('/android_asset/www/musicas/escuro.mp3');
        player.audio_sol    = new Media('/android_asset/www/musicas/sol.mp3');
        player.audio_escuro.setVolume('0.0');
        player.audio_sol.setVolume('0.0');
        player.audio_escuro.play();
        player.audio_sol.play();
        setTimeout(function() { player.playEscuro(); }, 5000);
    },

    playEscuro: function() {
        player.audio_sol.setVolume('0.0');
        player.audio_escuro.setVolume('1.0');
        setTimeout(function() { player.playSol(); }, 3000);
    },

    playSol: function() {
        player.audio_sol.setVolume('1.0');
        player.audio_escuro.setVolume('0.0');        
        setTimeout(function() { player.playEscuro(); }, 3000);
    }

}