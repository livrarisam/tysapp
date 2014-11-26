var countdetails = 1;
var details = null;
var eventId = 0;
var nextEvent = "";
var lastEndereco = "";
var coordinates = [];

function loadMap() {
    var posicao_atual = new google.maps.LatLng("-23.557060", "-46.633065");

    var mapOptions = {
        zoom: 16,
        center: posicao_atual,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true
    };

    mapa = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);

    $("#map_canvas").height("400px");

    setTimeout( function() { loadNavigations(); }, 1000);
}

function loadNavigations() {

    var params = {"idUsuario":window.localStorage["idUsuario"]};

    $.post("/api/navegacao/get_navegation", { data: JSON.stringify(params) }, 
        function(data) {
            if (data.result.length >= 1) {
                $("#link1").addClass(data.result[0].idNavegacao);
                $("#titulo1").text(data.result[0].titulo);
                $("#content1").fadeIn();
            }
            if (data.result.length >= 2) {
                $("#link2").addClass(data.result[1].idNavegacao);
                $("#titulo2").text(data.result[1].titulo);
                $("#content2").fadeIn();
            }
            if (data.result.length >= 3) {
                $("#link3").addClass(data.result[2].idNavegacao);
                $("#titulo3").text(data.result[2].titulo);
                $("#content3").fadeIn();
            }
        }, "json"
    );
}

function playSong(navId) {

    var params = {"idNavegacao": navId};
    $.post("/api/navegacao/get_details", { data: JSON.stringify(params) }, 
        function(data) {
            for (var key in data.details) {
                countdetails = key;
            }

            details = data.details;
            coordinates = [];
            eventId = 0;
            songLoop();

        }, "json"
    );            
}

function songLoop() {
    if (eventId <= countdetails) {
        var detail = details[eventId];
        playEvent(detail);
        eventId = eventId + 1;
        setTimeout(function() { songLoop(); }, 3500);

    } else { 
        escuro.stop();
        sol.stop();
        mudanca_rua.stop();
        mudanca_rua_2.stop();
    }            
}

function playEvent(detail) {
    if (nextEvent == "") {
        lastEndereco = detail.endereco;
        if (detail.temperatura < 20) {
            if (sol.volume() > 0) { sol.fadeOut(0, 900); }
            if (mudanca_rua.volume() > 0) { mudanca_rua.fadeOut(0, 900); }
            if (mudanca_rua_2.volume() > 0) { mudanca_rua_2.fadeOut(0, 900); }

            if (escuro.volume() == 0) { escuro.fadeIn(0.4, 900); }
            nextEvent = "mudanca_rua_2";
        } else {
            if (mudanca_rua.volume() > 0) { mudanca_rua.fadeOut(0, 900); }
            if (mudanca_rua_2.volume() > 0) { mudanca_rua_2.fadeOut(0, 900); }
            if (escuro.volume() > 0) { escuro.fadeOut(0, 900); }

            if (sol.volume() == 0) { sol.fadeIn(0.4, 900); }
            nextEvent = "mudanca_rua";
        }
    } else {
        if (detail.endereco != lastEndereco) {
            lastEndereco = detail.endereco;
            if (nextEvent == "mudanca_rua") {
                if (sol.volume() > 0) { sol.fadeOut(0, 900); }
                if (escuro.volume() > 0) { escuro.fadeOut(0, 900); }
                if (mudanca_rua_2.volume() > 0) { mudanca_rua_2.fadeOut(0, 900); }

                if (mudanca_rua.volume() == 0) { mudanca_rua.fadeIn(0.4, 900); }
                nextEvent = "clima";
            } else if (nextEvent == "mudanca_rua_2") {
                sol.fadeOut(0, 900);
                mudanca_rua.fadeOut(0, 900);
                escuro.fadeOut(0, 900);                    

                mudanca_rua_2.fadeIn(0.4, 900);
                nextEvent = "clima";
            } else if (nextEvent == "clima") {
                if (detail.temperatura < 20) {
                    sol.fadeOut(0, 900);
                    mudanca_rua.fadeOut(0, 900);
                    mudanca_rua_2.fadeOut(0, 900);                    

                    escuro.fadeIn(0.4, 900);
                    nextEvent = "mudanca_rua";
                } else {
                    mudanca_rua.fadeOut(0, 900);
                    escuro.fadeOut(0, 900);
                    mudanca_rua_2.fadeOut(0, 900);

                    sol.fadeIn(0.4, 900);
                    nextEvent = "mudanca_rua_2";
                }
            }
        }
    }

    var posicao_atual = new google.maps.LatLng(detail.latitude, detail.longitude);
    mapa.panTo(posicao_atual);
    mapa.setZoom(17);

    coordinates.push(posicao_atual);
    var flightPath = new google.maps.Polyline({
        path: coordinates,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 3
    });
    flightPath.setMap(mapa);            
}        

google.maps.event.addDomListener(window, 'load', loadMap);

// $(".image_perfil").attr("src", "uploads/"+window.localStorage["idUsuario"]+".jpg");
$(".unome").text(window.localStorage["nome"]);
$(".usnome").text(window.localStorage["sobrenome"]);

$(".button_play").on("click", function() {
    var navId = $(this).attr('class').split(' ')[2];
    setTimeout( function() { playSong(navId); }, 3000);
});