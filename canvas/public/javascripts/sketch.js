const cameraSize={w:360,h:240};
const resolution={w:1080,h:720};
let video;
let canvas;	 //canvas要素取得用 %>
let media;	//取り込んだ動画の入れ物%>
let context;
let start;
let end;
let clear;
let canvasUpdFlg=0;


const socket=io();

window.addEventListener("load",function(){



  //socket通信　入れ物とログへの記録
///*
  //const socket=io();
  socket.connect();
  socket.on("connect",function(data){
    //console.log("connect session:"+socket.transport.sessionid);
  });
//*/
//socket.emit("message","hey yo");






  //カメラか動画の判定

  let cameraFlg = 0;
  let dougaFlg  = 0;
  let camera 	= document.getElementById("camera");
  var dougaDiv 		= document.getElementsByClassName('dougaDiv');
  var cameraDiv 	= document.getElementsByClassName('cameraDiv');


  camera.addEventListener('click',()=>{
    cameraFlg=1;
    dougaFlg=0;

    camera.style.backgroundColor="#808080";
    douga.style.backgroundColor="#F0F0F0";

    for (var i = 0; i < dougaDiv.length; i++) {
      dougaDiv[i].style.display="none"
    }
    for (var i = 0; i < cameraDiv.length; i++) {
      cameraDiv[i].style.display="block"
    }
    video.src= "about:blank";
    video.style.zIndex=1
    canvas.style.zIndex=2

  });

  let douga=document.getElementById("douga");
  douga.addEventListener('click',()=>{
    cameraFlg=0;
    dougaFlg=1;

    douga.style.backgroundColor="#808080";
    camera.style.backgroundColor="#F0F0F0";

    for (var i = 0; i < dougaDiv.length; i++) {
      dougaDiv[i].style.display="block"
    }
    for (var i = 0; i < cameraDiv.length; i++) {
      cameraDiv[i].style.display="none"
    }


  });

  //video関連%>
  video = document.getElementById("video")
  var element_url = document.getElementById("edit_02_url");
  var load = document.getElementById("button_02_load");


  load.addEventListener('click',()=>{
    var url = element_url.value;// 送信したい URL先 %>
    if(url.match(/.*youtube.*/)){
      var youtube_url=url.split("watch?v=")
      url="https://www.youtube.com/embed/"+youtube_url[1]
      video.src = url;
    }else if(url.match(/.*youtu.be\/.*/)){
      var youtube_url=url.split("youtu.be\/")
      url="https://www.youtube.com/embed/"+youtube_url[1]
      video.src = url;
    }
    else{
      video.src = url;	// URL アドレスをセット %>
    }
  });


  //canvas関連 %>
  canvas		=document.getElementById("canvas");
  context		=canvas.getContext('2d');		//コンテキスト取得 %>
  start			=document.getElementById("start");
  end				=document.getElementById("end");
  clear			=document.getElementById("clear");




  //カメラ取得開始or動画取得開始--ここから---------------------- %>

  var cameraCanvas=document.getElementById("canvas")
  var video_original=document.getElementById("video_original")


  start.addEventListener('click',()=>{		//カメラ取得開始or動画開始 %>
    //カメラの場合-------------------------------------- %>
    if(cameraFlg===1){
      media = navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          width: { ideal: resolution.w },
          height: { ideal: resolution.h }
        }
      }).then(function(stream) {
        video_original.srcObject = stream;
        //cameraCanvas.play(); %>
      });
      if(canvasUpdFlg===0){
        canvasUpdate();	//画像描画の呼び水 %>
        canvasUpdFlg=1;
      }
    //動画の場合-------------------------------------------- %>
    }
  });

  end.addEventListener('click',()=>{		//カメラ取得終了or動画停止 %>
    if(cameraFlg===1){
      let stream = video_original.srcObject;
      let tracks = stream.getTracks();

      tracks.forEach(function(track) {
        track.stop();
      });
        video_original.srcObject=null;
    }
  });

  let sousa_movie=document.getElementById("sousa_movie");	//動画の一時停止 %>
  sousa_movie.addEventListener('click',()=>{
    if(dougaFlg===1){
      video.style.zIndex=2
      canvas.style.zIndex=1
    }
  });

  let sousa_canvas=document.getElementById("sousa_canvas");	//動画の再生再開 %>
  sousa_canvas.addEventListener('click',()=>{
    if(dougaFlg===1){
      video.style.zIndex=1
      canvas.style.zIndex=2
    }
  });

  //カメラ取得開始or動画取得開始--ここまで---------------------- %>




  clear.addEventListener('click',()=>{	//描画のクリア %>
    context.clearRect(0, 0,resolution.w,resolution.h );
    drawContext.clearRect(0, 0,resolution.w,resolution.h );
    canvasUpdFlg=0;
  });



  function canvasUpdate(){			//カメラ取得映像の連続描画 %>
    if(cameraFlg===1){
      context.drawImage(video_original,0,0,resolution.w,resolution.h);
    }else if (dougaFlg===1) {
      context.drawImage(drawCanvas,0,0,resolution.w,resolution.h);
    }
    requestAnimationFrame(canvasUpdate);
  };



  //canvas終了 %>




  //書き込みコード部分 %>

  //書き込み時の初期設定 %>
  var cnvWidth=500;
  var cnvHeight=500;
  var cnvColor="0,0,0,1";	//線の色 %>
  var cnvBold=5;				//線の太さ %>
  var clickFlg=0;	//クリック中の判定　１：クリック開始　２：クリック中 %>


  //マウスイベント %>
  // canvas上でのイベント と　サーバーへの送信
  var down = false;

  canvas.addEventListener('mousedown',(e)=>{
    clickFlg = 1; // マウス押下開始 %>
    if(canvasUpdFlg===0){
      canvasUpdate();
      canvasUpdFlg=1;
    }
    //console.log("down");
    socket.emit("message",{
      act: "down",
      x: e.offsetX,
      y: e.offsetY,
      color: cnvColor,
      bold :cnvBold,
    });
  });

  canvas.addEventListener('mouseup',(e)=>{
    clickFlg = 0; // マウス押下終了 %>
    socket.emit("message",{
      act: "up",
      x: e.offsetX,
      y: e.offsetY,
    });
  });

  canvas.addEventListener('mousemove',(e)=>{
   // マウス移動処理 %>
    if(!clickFlg) return false;
    draw(e.offsetX, e.offsetY);
    socket.emit("message",{
      act: "move",
      x: e.offsetX,
      y: e.offsetY,
    });
  });



  var remote_down = false;

  socket.on('message', function(data) {
    if(canvasUpdFlg===0){
      canvasUpdate();
      canvasUpdFlg=1;
    }
      switch (data.act) {
          case "down":
              remote_down = true;
              drawContext.strokeStyle = 'rgba('+data.color+')'
              drawContext.lineWidth=data.bold
              drawContext.beginPath();
              drawContext.moveTo(data.x, data.y);
          case "move":
              console.log("remote: " + data.x, data.y);
              //draw(data.x, data.y)
              drawContext.lineTo(data.x, data.y);
              drawContext.stroke();
          case "up":
              if (!remote_down) return;
              drawContext.lineTo(data.x, data.y);
              drawContext.stroke();
              drawContext.closePath();
              remote_down = false;
      }
  });





  // 描画処理 %>
  let drawCanvas=document.getElementById("drawCanvas");
  let drawContext=drawCanvas.getContext("2d");

  function draw(x, y) {
    drawContext.lineWidth = cnvBold;
    drawContext.strokeStyle = 'rgba('+cnvColor+')';
    // 初回処理の判定 %>
    if (clickFlg == "1") {
      clickFlg = "2";
      drawContext.beginPath();
      drawContext.lineCap = "round";  //　線を角丸にする %>
      drawContext.moveTo(x, y);
    } else {
      drawContext.lineTo(x, y);
    }
    drawContext.stroke();
  };

// 色の変更 %>
  var color=document.getElementsByClassName('setColor');
  for(let i=0;i<color.length;i++){
    //console.log(color[i].dataset); %>
    color[i].onclick=function(){
      cnvColor=color[i].dataset.setcolor;
    }
  }


  // 線の太さ変更 %>
  var bold=document.getElementsByClassName('setBold');
  for(let i=0;i<bold.length;i++){
  	//console.log(bold[i].dataset); %>
    bold[i].onclick=function(){
      cnvBold=bold[i].dataset.bold;
    }
  }


  //ソケット通信からの描画










},false);
