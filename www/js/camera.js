  var pictureSource;   // picture source

  // Wait for PhoneGap to connect with the device
  //
  document.addEventListener("deviceready",onDeviceReady,false);

  // PhoneGap is ready to be used!
  //
  function onDeviceReady() {
      pictureSource=navigator.camera.PictureSourceType;
  }

  // Called when a photo is successfully retrieved
  //
  function onPhotoFileSuccess(imageData) {
    // Get image handle
    alert(JSON.stringify(imageData));

    pictureSource = imageData;
    // $(".thumbnail_foto").html("<img src=\""+pictureSource+"\">");
    var url=encodeURI("http://walkey.com.br/api/usuarios/photo_upload/");
    alert(url);
    var params = new Object();
    params.value = "none";  //you can send additional info with the file
    alert("params");

    var options = new FileUploadOptions();
    options.fileKey = "photo"; //depends on the api
    options.fileName = pictureSource.substr(pictureSource.lastIndexOf('/')+1);
    options.mimeType = "image/jpeg";
    options.params = params;
    options.chunkedMode = true; //this is important to send both data and files
    alert("options");

    var ft = new FileTransfer();
    alert("FileTransfer");
    ft.upload(pictureSource, url, succesFileTransfer, errorFileTransfer, options);
    // Get image handle
  }

  function succesFileTransfer(data) {
    alert("ok!");
    alert(data.response);
  }

  function errorFileTransfer() {
    alert("Error");
  }

  // A button will call this function
  function capturePhotoWithFile() {
      navigator.camera.getPicture(onPhotoFileSuccess, onFail, { quality: 50, destinationType: Camera.DestinationType.FILE_URI });
  }

  // Called if something bad happens.
  // 
  function onFail(message) {
    alert('Failed because: ' + message);
  }

  $("#btn_cadastro").on("click", function(e) {
    e.preventDefault();
    $("#btn_cadastro").attr('disabled','disabled');
    var nome = $("#nome").val();
    var login = $("#login").val();
    var email = $("#email").val();
    var senha = $("#senha").val();
    var params = {"nome":nome, "sobrenome":login, "email":email, "senha":senha}; 
    $.post("http://walkey.com.br/api/usuarios/create", {data: JSON.stringify(params) },
      function(data) {
          if (data.result == "sucesso") {
              window.localStorage["idUsuario"] = data.idUsuario;
              window.localStorage["nome"] = data.nome;
              window.localStorage["sobrenome"] = data.sobrenome;
              window.localStorage["email"] = data.email;
              window.localStorage["logged"] = true;
              navigator.notification.alert("Cadastro efetuado com sucesso", function() { $("#frm_cadastro").submit() });
          } else {
              $("#btn_cadastro").removeAttr('disabled');
              navigator.notification.alert(data.error_string, function() {});
          }
      }, "json"
    );
  });