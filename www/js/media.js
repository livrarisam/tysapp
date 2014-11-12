var audio_escuro = null;
var audio_escuro_rapido = null;

function initializeMedia() {

    audio_escuro = new Media('/android_asset/www/musicas/escuro.mp3');
    audio_escuro_rapido = new Media('/android_asset/www/musicas/escuro_rapido.mp3');

    $("#escuro1").click(function(e){
        e.preventDefault();
        audio_escuro.play();
        audio_escuro_rapido.stop();
    });    
        
    $("#escuro2").click(function(e){
        e.preventDefault();
        audio_escuro.stop();
        audio_escuro_rapido.play();
    });
}