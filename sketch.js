
//crie as variaveis
var PLAY=1;
var END=0;
var gameState=PLAY;

var ground,groundImg,groundInvisivel;
var trex,trexCorrendo,trexColidiu;
var nuvemImg;
var cac1,cac2,cac3,cac4,cac5,cac6;


var grupoCactos;
var grupoNuvens;


var gameOver,gameImg;
var restart, restartImg;

var sonPulo,sonMorte,sonPontos;

var numero=10;
var pontos=0;
function preload(){

  //adicione a animação
 trexCorrendo=loadAnimation("trex1.png","trex3.png","trex4.png");
 trexColidiu=loadImage("trex_collided.png");
 groundImg=loadImage("ground2.png");
 nuvemImg=loadImage("cloud.png");

 cac1=loadImage("obstacle1.png");
 cac2=loadImage("obstacle2.png");
 cac3=loadImage("obstacle3.png");
 cac4=loadImage("obstacle4.png");
 cac5=loadImage("obstacle5.png");
 cac6=loadImage("obstacle6.png");
 gameImg=loadImage("gameOver.png")
 restartImg=loadImage("restart.png");
 sonPulo=loadSound("jump.mp3");
 sonPontos=loadSound("checkPoint.mp3");
 sonMorte=loadSound("die.mp3");
}

function setup() {
  createCanvas(600,200)
 
  
  //criar sprite do ground
  ground=createSprite(305,180,600,10);
  ground.addImage(groundImg);
  ground.x=ground.width/2;

  groundInvisivel=createSprite(305,190,600,10);
  groundInvisivel.visible=false;

  //criar a sprite do trex
  trex=createSprite(200,150,30,30);
  trex.addAnimation("correndo",trexCorrendo);
  trex.addAnimation('colidiu',trexColidiu);
  trex.scale=0.5;
  trex.setCollider('circle',0,0,50);
  trex.debug=true;

  //sripte fim de jogo e restart

  gameOver=createSprite(300,100,10,10);
  gameOver.addImage(gameImg);
  gameOver.scale=0.5;


  
  restart=createSprite(300,130,10,10);
  restart.addImage(restartImg);
  restart.scale=0.5;

  //criar grupos de nuvens e cactos

  grupoCactos = createGroup();
  grupoNuvens= createGroup();
}

function draw() {
  background(180);
  //pontos na tela
  text("Pontuação:"+pontos,500,20);
 
  //ESTADO DO JOGO
  if( gameState===PLAY){  

    gameOver.visible=false;
    restart.visible=false;
      //velocidade do solo
      ground.velocityX= -(4 +3* pontos/100);

    pontos=pontos+Math.round(getFrameRate()/60);

    if(pontos>0 && pontos%100===0){
      sonPontos.play();
    }
    //retorno do solo
    if(ground.x<0){
      ground.x=ground.width/2;
    }

    //adicione o controle de pulo
    if(keyDown("space")&& trex.y>=150){
      sonPulo.play(); 
      trex.velocityY=-12;
     }
  

    //adicione gravidade
    trex.velocityY=trex.velocityY+0.8;
    //chamada de função
    GerarNuvens();
    gerarCactos()
    

    if(grupoCactos.isTouching(trex)){
      gameState=END
      //trex.velocityY=-12
      sonMorte.play();
    }
    
  } 
  else if(gameState===END){
    gameOver.visible=true;
    restart.visible=true;
    ground.velocityX=0;
    ground.velocityX = 0;
    trex.velocityY = 0;
    trex.changeAnimation('colidiu',trexColidiu);
     
    //tempo de vida do grupo
    grupoCactos.setLifetimeEach(-1);
    grupoNuvens.setLifetimeEach(-1);

    //velocidade do grupo
    grupoCactos.setVelocityXEach(0);
    grupoNuvens.setVelocityXEach(0)
    if(mousePressedOver(restart)){
      resetar();
     }
  
  }
//adicione a colisão com o ground
  trex.collide(groundInvisivel);
  drawSprites();
}

function resetar(){
  gameState=PLAY
  restart.visible=false;
  gameOver.visible=false;
  pontos=0;
  trex.changeAnimation("correndo",trexCorrendo);
  grupoCactos.destroyEach();
  grupoNuvens.destroyEach();

}

function GerarNuvens(){

  if(frameCount %60===0){
    
    var nuvem=createSprite(600,50,10,10);
    nuvem.velocityX=-3;
    nuvem.addImage(nuvemImg);
    nuvem.scale=0.4;
    nuvem.y=Math.round(random(10,100));

    //profundidade
    nuvem.depth=trex.depth;
    trex.depth=trex.depth+1;

    //tempo de vida
    nuvem.lifetime=200;
    
    //adicionar a sprite nuvem no grupo
    grupoNuvens.add(nuvem);
  }
 
}


function gerarCactos(){
  if(frameCount %100===0){     

    var cacto=createSprite(600,165,10,10);
    cacto.velocityX= -(6 + 3*pontos/100);

    //switch
    //gerar cactos
    var rand=Math.round(random(1,6));

    switch(rand){
      case 1:cacto.addImage(cac1);
              break;
      case 2:cacto.addImage(cac2);
              break;
      case 3:cacto.addImage(cac3); 
              break;
      case 4:cacto.addImage(cac4);
              break;
      case 5:cacto.addImage(cac5);
              break;
      case 6:cacto.addImage(cac6);
              break
      default: break;                    
    }

    //escala e tempo de vida
    cacto.scale=0.5;
    cacto.lifetime=200;

    //adicionar a sprite cacto no grupo
    grupoCactos.add(cacto);
  }
}