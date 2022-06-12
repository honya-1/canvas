
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('main',{
    title:"動画に書き込めるん",
  });
/*
router.get('/', function(req, res, next) {

  res.render('main',{
    title:"動画に書き込めるん",
  });

});

router.post('/', function(req, res, next) {
*/
/*
  const cameraSize={w:360,h:240};
  const resolution={w:1080,h:720};
  let video;
  let canvas;	//canvas要素取得用
  let media;	//取り込んだ動画の入れ物
  let context;
  let start;
  let end;
  let clear;
  let canvasUpdFlg=0;


  //カメラか動画の判定

  let cameraFlg = 0;
  let dougaFlg  = 0;
  let camera=document.getElementById("camera");
  var hide=document.getElementsByClassName('douga');


  camera.addEventListener('click',()=>{
  	cameraFlg=1;
  	dougaFlg=0;
  	//camera.classList.add("pushButton");
  	//douga.classList.add("originalButton");
  	camera.style.backgroundColor="#808080";
  	douga.style.backgroundColor="#F0F0F0";
  	video.src=null;
  	for (var i = 0; i < hide.length; i++) {
  		hide[i].style.display="none"
  	}
  });

  let douga=document.getElementById("douga");
  douga.addEventListener('click',()=>{
  	cameraFlg=0;
  	dougaFlg=1;
  	//douga.classList.add("pushButton");
  	//camera.classList.add("originalButton");
  	douga.style.backgroundColor="#808080";
  	camera.style.backgroundColor="#F0F0F0";
  	for (var i = 0; i < hide.length; i++) {
  		hide[i].style.display="block"
  	}
  });

  //video関連
  video		=document.getElementById("video");
  var element_url = document.getElementById("edit_02_url");
  var element_slider = document.getElementById("edit_02_slider");
  var element_autoplay = document.getElementById("input_02_autoplay");
  var element_rate = document.getElementById("input_02_rate");
  var element_loop = document.getElementById("input_02_loop");
  var element;
  element = document.getElementById("button_02_load");

  element.addEventListener('click',()=>{
  	var url = element_url.value;// 送信したい URL 先
  	video.src = url;	// URL アドレスをセット
  	video.load();	// 読み込み開始
  });

  //canvas関連
  canvas		=document.getElementById("canvas");
  context		=canvas.getContext('2d');		//コンテキスト取得
  start		=document.getElementById("start");
  end			=document.getElementById("end");
  clear		=document.getElementById("clear");
  element_slider.onchange = function (){
  	video.currentTime = this.value;
  };
  //カメラ取得開始or動画取得開始--ここから----------------------

  start.addEventListener('click',()=>{					//カメラ取得開始or動画開始

  	//カメラの場合--------------------------------------
  	if(cameraFlg===1){
  		media = navigator.mediaDevices.getUserMedia({
    		audio: false,
    		video: {
      		width: { ideal: resolution.w },
      		height: { ideal: resolution.h }
    		}
  		}).then(function(stream) {
    		video.srcObject = stream;
  	  	video.play();
  		});
  		if(canvasUpdFlg===0){
  			canvasUpdate();		//画像描画の呼び水
  			canvasUpdFlg=1;
  		}
  	//動画の場合--------------------------------------------
  	}else if (dougaFlg===1) {
  		video.preload="metadata";
  		video.play();
  		canvasUpdate();		//画像描画の呼び水
  		setInterval(function (){
  			// 再生位置を取得する
  			//console.log(video.currentTime);
  			var v;
  			v = element_rate.value;
  			video.playbackRate = v;

  			v = element_autoplay.checked;
  			video.autoplay = v;

  			v = element_loop.checked;
  			video.loop = v;
  		},1000/60);
  		video.addEventListener("loadedmetadata",function (e){
  			// 再生総時間を取得する
  			console.log(video.duration);
  		});
  		// ビデオのイベント
  		video.addEventListener("timeupdate",function (e){
  			// スライダーを更新
  			element_slider.max = video.duration;
  			element_slider.value = video.currentTime;
  		},false);



  	}
  });

  end.addEventListener('click',()=>{		//カメラ取得終了or動画停止
  	if(cameraFlg===1){
  		let stream = video.srcObject;
  		let tracks = stream.getTracks();

  		tracks.forEach(function(track) {
  			track.stop();
  		});
  			video.srcObject=null;
  	}else if (dougaFlg===1) {
  		video.pause();
  		video.currentTime = 0;
  	}
  });

  let pause=document.getElementById("pause");	//動画の一時停止
  pause.addEventListener('click',()=>{
  	if(dougaFlg===1){
  		video.pause();
  	}
  });

  let replay=document.getElementById("replay");	//動画の再生再開
  replay.addEventListener('click',()=>{
  	if(dougaFlg===1){
  		video.play();
  	}
  });

  //カメラ取得開始or動画取得開始--ここまで----------------------




  clear.addEventListener('click',()=>{	//描画のクリア
  	context.clearRect(0, 0,resolution.w,resolution.h );
  	drawContext.clearRect(0, 0,resolution.w,resolution.h );
  });



  function canvasUpdate(){				//カメラ取得映像の連続描画
  	context.drawImage(video,0,0,resolution.w,resolution.h);
  	context.drawImage(drawCanvas,0,0,resolution.w,resolution.h);
  	requestAnimationFrame(canvasUpdate);			//後でこれをconcatCanvasに変える
  };



  //canvas終了




  //書き込みコード部分

  //書き込み時の初期設定
  var cnvWidth=500;
  var cnvHeight=500;
  var cnvColor="0,0,0,1";	//線の色
  var cnvBold=5;				//線の太さ
  var clickFlg=0;	//クリック中の判定　１：クリック開始　２：クリック中


  //マウスイベント
  // canvas上でのイベント
      canvas.addEventListener('mousedown',()=>{
        clickFlg = 1; // マウス押下開始
  			if(canvasUpdFlg===0){
  				canvasUpdate();
  				canvasUpdFlg=1;
  			}
      });
      canvas.addEventListener('mouseup',()=>{
        clickFlg = 0; // マウス押下終了
      });
      canvas.addEventListener('mousemove',(e)=>{
        // マウス移動処理
        if(!clickFlg) return false;
        draw(e.offsetX, e.offsetY);
      });

      // 描画処理
  		let drawCanvas=document.getElementById("drawCanvas");
  		let drawContext=drawCanvas.getContext("2d");
      function draw(x, y) {
        drawContext.lineWidth = cnvBold;
        drawContext.strokeStyle = 'rgba('+cnvColor+')';
        // 初回処理の判定
        if (clickFlg == "1") {
          clickFlg = "2";
          drawContext.beginPath();
          drawContext.lineCap = "round";  //　線を角丸にする
          drawContext.moveTo(x, y);
        } else {
          drawContext.lineTo(x, y);
        }
        drawContext.stroke();
      };

      // 色の変更
  		var color=document.getElementsByClassName('setColor');
  		for(let i=0;i<color.length;i++){
  			//console.log(color[i].dataset);
  			color[i].onclick=function(){
  				cnvColor=color[i].dataset.setcolor;
  			}
  		}


      // 線の太さ変更
      var bold=document.getElementsByClassName('setBold');
  		for(let i=0;i<bold.length;i++){
  			//console.log(bold[i].dataset);
  			bold[i].onclick=function(){
  				cnvBold=bold[i].dataset.bold;
  			}
  		}
  /*
  res.render('main',{
    title:"動画に書き込めるん",
  });
  */

});


module.exports = router;
