var player = {
    // Application Constructor
    audio_escuro: null,
    audio_sol: null,

    initialize: function() {
        player.audio_escuro = new Media('/android_asset/www/musicas/escuro.mp3');
        player.audio_sol    = new Media('/android_asset/www/musicas/sol.mp3');
        player.audio_escuro.setVolume(30);
        player.audio_sol.setVolume(30);
        setTimeout(function() { player.playEscuro(); }, 5000);
    },

    playEscuro: function() {
        player.audio_sol.stop();
        player.audio_escuro.play();
        setTimeout(function() { player.playSol(); }, 3000);
    },

    playSol: function() {
        player.audio_escuro.stop();
        player.audio_sol.play();
        setTimeout(function() { player.playEscuro(); }, 3000);
    }

}