var player = {
    // Application Constructor
    audio_escuro = null,
    audio_escuro_rapido = null,

    initialize: function() {
        player.audio_escuro = new Media('/android_asset/www/musicas/escuro.mp3');
        player.audio_escuro_rapido = new Media('/android_asset/www/musicas/escuro_rapido.mp3');
        setTimeout(player.playEscuro(), 5000);
    },

    playEscuro: function() {
        audio_escuro.play();
        // audio_escuro_rapido.stop();
    }

}