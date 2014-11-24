  var pictureSource;   // picture source

  // Wait for PhoneGap to connect with the device
  //
  document.addEventListener("deviceready",onDeviceReady,false);

  // PhoneGap is ready to be used!
  //
  function onDeviceReady() {
      pictureSource=navigator.camera.PictureSourceType;
      destinationType=navigator.camera.DestinationType;
  }

  // Called when a photo is successfully retrieved
  //
  function onPhotoDataSuccess(imageData) {
    // Get image handle
    //
    var smallImage = document.getElementById('smallImage');

    // Unhide image elements
    //
    smallImage.style.display = 'block';

    // Show the captured photo
    // The inline CSS rules are used to resize the image
    //
    smallImage.src = "data:image/jpeg;base64," + imageData;
  }

  // Called when a photo is successfully retrieved
  //
  function onPhotoFileSuccess(imageData) {
    // Get image handle
    pictureSource = JSON.stringify(imageData);
    // $(".thumbnail_foto").html("<img src=\""+pictureSource+"\">");
    var url=encodeURI("http://walkey.com.br/api/usuarios/photo_upload/");

    var username='your_user';
    var password='your_pwd';

    var params = new Object();
    params.your_param_name = "something";  //you can send additional info with the file

    var options = new FileUploadOptions();
    options.fileKey = "photo"; //depends on the api
    options.fileName = imageUriToUpload.substr(pictureSource.lastIndexOf('/')+1);
    options.mimeType = "image/jpeg";
    options.params = params;
    options.chunkedMode = true; //this is important to send both data and files

    var headers={'Authorization':"Basic " + Base64.encode(username + ":" + password)};
    options.headers = headers;

    var ft = new FileTransfer();
    ft.upload(imageUriToUpload, url, succesFileTransfer, errorFileTransfer, options);
    // Get image handle
  }

  function succesFileTransfer(data) {
    alert("ok!");
    alert(data);
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