var player = {
    // Application Constructor
    audio_escuro: null,
    audio_escuro_rapido: null,

    initialize: function() {
        player.audio_escuro = new Media('/android_asset/www/musicas/escuro.mp3');
        setTimeout(function() { player.playEscuro(); }, 5000);
    },

    playEscuro: function() {
        player.audio_escuro.play();
    }

}