var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var body = document.getElementById("body");




// mobil cihazlar için hareketfonksiyonları hatta bilgisayar içinde bunu kullanacağız
function moveLeft() {
  topX -= 2 * topVX;
}

function moveRight() {
  topX += 2 * topVX;
}

function jump() {
  topY -= 0.25 * topVY;
}

// leftButton.addEventListener("click", moveLeft);
// rightButton.addEventListener("click", moveRight);
// jumpButton.addEventListener("click", jump);

// hangi cihazdaysak o cihazın yüksekliğine ve genişliğine göre canvas boyutları ayarladım
canvas.width = window.innerWidth * 0.5;
canvas.height = window.innerHeight * 0.98 ;

// sesleri yükledim
var gameOverSound = new Audio();
gameOverSound.src = "sounds/gameOver.mp3";

var herAdimSound = new Audio();
herAdimSound.src = "sounds/herAdim.mp3";



// fotoğrafları yükledim

var topImage = new Image();
topImage.src = "images/redball.png";

var duvar = new Image();
duvar.src = "images/duvar.jpg";



var arkaPlan = new Image();
arkaPlan.src = "images/arkaPlan.png";

var sagYonTusu = new Image();
sagYonTusu.src = "images/sagYonTusu.jpeg";

var solYonTusu = new Image();
solYonTusu.src = "images/solYonTusu.jpeg";

var yukariYonTusu = new Image();
yukariYonTusu.src = "images/yukariYonTusu.jpeg";


// top konum bilgileri
var topX = canvas.width * 0.75;
var topY = canvas.height * 0.85;

// top hız bilgileri

var topVY = canvas.height * 0.05;
var topVX = canvas.width * 0.05;
// duvar hız bilgisi 
var duvarVY = 1;

//! top resminin genişlik ve yükseklik bilgileri  topun fotoğrafı hep kare olucak şekilde ayarladım
var enBoyOrani = 1;
topImage.width = canvas.width / 20;
topImage.height = topImage.width * enBoyOrani;



// ok tuşlarına basıldığında topun konumu değişiyor

document.addEventListener("keydown", function (event) {
  
  
  
  if (duvarlar.length>2){
    if (event.keyCode == 39) {
      moveRight();
    } else if (event.keyCode == 37) {
      moveLeft();
    } else if (event.keyCode == 38) {
      jump();
    }
  }
});




// başlangıç skoru
var Score = 0;


var duvarlar = [];
duvarlar[0] = {
  x: 0,
  y: 0,
  width: canvas.width * 0.3,
  height: canvas.height * 0.02,
  gap: canvas.height * 0.02,
};

function draw() {
  context.drawImage(arkaPlan, 0, 0, canvas.width, canvas.height); // arka plan ayarladık

  // topu canvasa çizdim
  context.drawImage(topImage, topX, topY, topImage.width, topImage.height);
  // topun canvasın dışına çıkmasını engelledim switch case ile
  switch (true) {
    case topX < 0:
      topX = 0;
      break;
    case topX > canvas.width - topImage.width:
      topX = canvas.width - topImage.width;
      break;
    case topY < 0:
      topY = 0;
      break;
    case topY > canvas.height - topImage.height:
      topY = canvas.height - topImage.height;
      break;
  }

  // mobilse butonları çizdim

  
  

  // duvarları çizdim
  for (var i = 0; i < duvarlar.length; i++) {
    // ilk duvarı çidim
    context.drawImage(
      duvar,
      duvarlar[i].x,
      duvarlar[i].y,
      duvarlar[i].width,
      duvarlar[i].height
    );

    // ikinci duvarı çizdim
    context.drawImage(
      duvar,
      duvarlar[i].x + duvarlar[i].width + topImage.width + 3 * duvarlar[i].gap,
      duvarlar[i].y,
      canvas.width - (duvarlar[i].width + topImage.width),
      duvarlar[i].height
    );

      // for döngüsünden dolayı tüm duvarların y konumu arttırdık bu da bize hareket ediyormuş görünümü verdi
    duvarlar[i].y += duvarVY;

    // canvasın yüksekliğinin % 13 ünü bir duvar geçince yeniden duvar oluşturduj
    if (duvarlar[i].y  == Math.floor(canvas.height * 0.13)) {
      duvarlar[i + 1] = {
        x: 0,
        y: 0,
        width: Math.floor(canvas.width * Math.random()*0.8 - duvarlar[i].gap),
        height: canvas.height * 0.02,
        gap: canvas.height * 0.02,
      };
      // yeni duvar oluştuğuna göre hızını artıralım bir kere
      duvarlar[i + 1].y += duvarVY;
    }

    // yanma kuralları
    if (
      (duvarlar[i].x + duvarlar[i].width >= topX &&
        duvarlar[i].y <= topY &&
        duvarlar[i].y + duvarlar[i].height >= topY) ||
      (topX + topImage.width >=
        duvarlar[i].x +
          duvarlar[i].width +
          topImage.width +
          3 * duvarlar[i].gap &&
        topY >= duvarlar[i].y &&
        topY <= duvarlar[i].y + duvarlar[i].height) ||
      (topX <= duvarlar[i].x + duvarlar[i].width &&
        topY + topImage.height >= duvarlar[i].y &&
        topY + topImage.height <= duvarlar[i].y + duvarlar[i].height) ||
      (topX + topImage.width >=
        duvarlar[i].x +
          duvarlar[i].width +
          topImage.width +
          3 * duvarlar[i].gap &&
        topY + topImage.height >= duvarlar[i].y &&
        topY + topImage.height <= duvarlar[i].y + duvarlar[i].height)

      
    ) {
      // yandıysak yapılacaklar
      body.style.backgroundColor = "red";
      gameOverYazdir()
      gameOverSound.play()
      
      verileriSifirla()
      // oyunu baslat fonksiyonu sadece okunurluk açısından iyi olsun diye böyle yazdım aslında location reload u çağırıyorum
      // 1 sn ye sonra oyunu yeniden başlatıyor
      setTimeout(oyunuBaslat, 1000);
      

      
      
      
      
      

      
      


    } else if (
      // burada top 2 duvar arasında ise diye kontrol ediyorum
      topY <= duvarlar[i].y &&
      topY >= duvarlar[i + 1].y + duvarlar[i + 1].height &&
      topY + topImage.height <= duvarlar[i].y &&
      topY + topImage.height >= duvarlar[i + 1].y + duvarlar[i + 1].height
    ) {



      
      // top 2 duvar arasında ise skor artacak ama sadece 1 kere skor arttırmayı öğrenemedim
        changeBackgroundColor()
        Score = Score +1;
        herAdimSound.play();
      
       
      
      
      
    }

    context.fillStyle = "white";
    context.font = "20px verdana";
    context.fillText(
      "Score: " + Score,
      0,
      canvas.height - 50
    );
    context.fillText(
      "Yön tuşları ile hareket edilmektedir",
      0,
      canvas.height - 20
    );
  }

  requestAnimationFrame(draw);
}

draw();

function gameOverYazdir() {
  context.fillStyle = "white";
  context.font = "20px verdana";
  context.fillText("Game Over  " , canvas.width * 0.35, canvas.height * 0.9);
  
  
  
}

// bu fonksiyon oyun bittiğinde duvarların durmasını sağlayacak
function verileriSifirla() {
  
  duvarVY = 0;
  topVY = 0;
  topVX = 0;
  
  
}

function oyunuBaslat() {
  // ses çalması için 2 sn geciktiriyoruz yeniden başlatmayı
  location.reload();
  
}

function changeBackgroundColor() {
  // rastgele bir renk oluşturun
  var randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);

  
  

  // arka plan rengini değiştirin
  body.style.backgroundColor = randomColor;
  
}



