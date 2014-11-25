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
  function onPhotoFileSuccess(imageData) {
    // Get image handle
    pictureSource = imageData;
    $(".thumbnail_foto").html("<img src=\""+pictureSource.replace("file://", "")+"\">");
    alert("<img src=\""+pictureSource.replace("file://", "")+"\">");

  }

  function finishCadastro() {
    var url=encodeURI("http://walkey.com.br/api/usuarios/create/");
    alert(url);
    var nome = $("#nome").val();
    var login = $("#login").val();
    var email = $("#email").val();
    var senha = $("#senha").val();
    var jsonparam = {"nome":nome, "sobrenome":login, "email":email, "senha":senha}; 
    var params = {data: JSON.stringify(jsonparam) }
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
  }

  function succesFileTransfer(data) {
    alert(data.response);
    return true;
    if (data.response.result == "sucesso") {
      window.localStorage["idUsuario"] = data.response.idUsuario;
      window.localStorage["nome"] = data.response.nome;
      window.localStorage["sobrenome"] = data.response.sobrenome;
      window.localStorage["email"] = data.response.email;
      window.localStorage["logged"] = true;
      navigator.notification.alert("Cadastro efetuado com sucesso", function() { $("#frm_cadastro").submit() });    
    } else {
      $("#btn_cadastro").removeAttr('disabled');
      navigator.notification.alert(data.response.error_string, function() {});
    }      
  }

  function errorFileTransfer() {
    alert("Error");
  }

  // A button will call this function
  function capturePhotoWithFile() {
      navigator.camera.getPicture(onPhotoFileSuccess, onFail, { quality: 50, destinationType: Camera.DestinationType.FILE_URI });
  }

  // Called if something bad happens.
  function onFail(message) {
    alert('Failed because: ' + message);
  }

  $("#btn_cadastro").on("click", function(e) {
    e.preventDefault();
    $("#btn_cadastro").attr('disabled','disabled');
    finishCadastro();
  });