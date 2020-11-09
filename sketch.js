var PLAY = 1;
var END = 0;
var monkey,monkey_running,monkey_collided;
var groundSprite,groundImage,invisibleGround;
var banana ,bananaImage, obstacle, obstacleImage;
var FoodGroup, obstacleGroup;
var bg1Image,bg2Image,bg,bg2;
var reset,resetImage;
var GO,GOImage;
var score = 0;
var highScore = 0;
var SurvivalTime = 0;

var gameState = PLAY;
function preload(){
  
  
 monkey_running = loadAnimation("sprite_0.png","sprite_1.png","sprite_2.png","sprite_3.png","sprite_4.png","sprite_5.png","sprite_6.png","sprite_7.png","sprite_8.png")
  monkey_collided = loadAnimation("monkeyCollided.png");
  bananaImage = loadImage("banana.png");
  obstaceImage = loadImage("obstacle.png");
  groundImage = loadImage("ground.png");
  obstacleImage = loadImage("obstacle.png");
  bg1Image = loadImage("bg1.jpg");
  bg2Image = loadImage("bg2.jpg");
  bananaImage = loadImage("banana.png");
  GOImage = loadImage("GameOver.png");
  resetImage = loadImage("rB.png");
  obstacleGroup = createGroup();
  FoodGroup = createGroup();
}  


function setup() {
  createCanvas(400,400);
  bg = createSprite(210,155,20,20);
  bg.addImage(bg1Image);
  
  bg.scale =2;
  bg2 = createSprite(800,155,20,20);
  bg2.addImage(bg2Image);
  bg.velocityX = -(4 + SurvivalTime/2);
  bg2.velocityX = -(4 + SurvivalTime/2);
  bg2.scale = 2;
  
  GO = createSprite(200,150,20,20);
  GO.addImage(GOImage);
  GO.scale = 1.3;
  
  
  reset = createSprite(200,200,20,20);
  reset.addImage(resetImage);
  reset.scale = 1.3;
  
  monkey = createSprite(80,250,20,20);
  monkey.addAnimation("moving",monkey_running);
  monkey.addAnimation("collided",monkey_collided);
  monkey.scale = 0.1;
  monkey.y = 250;
  monkey.debug = false;
  monkey.setCollider("circle",0,0,220);
  groundSprite = createSprite(0,435,400,20);
  groundSprite.x = groundSprite.width/2;
  
  groundSprite.addImage(groundImage);
  invisibleGround = createSprite(200,339,400,40);
  invisibleGround.visible = false;
  monkey.depth = groundSprite.depth + 1;
  
}


function draw() {
  background(255);
  if(gameState === PLAY){
    reset.visible = false;
    GO.visible = false;
    SurvivalTime = Math.ceil(frameCount/60);
    
    if(groundSprite.x<0){
      groundSprite.x = groundSprite.width/2;
    }
    groundSprite.velocityX = -(4 + SurvivalTime/4);
    if(bg.x<-380){
      bg.x = 800;
    }
    if(bg2.x<-380){
      bg2.x = 800;
    }
    
    if(monkey.isTouching(obstacleGroup)){
      gameState = END;
    }
    if(monkey.isTouching(FoodGroup)){
      FoodGroup.destroyEach();
      score = score+1;
    }
    spawnObstacle();
    spawnFood();
    if(keyDown("space")&& monkey.collide(invisibleGround)){
      monkey.velocityY = -12;
    }
    
  }
  if(gameState === END){
    GO.visible = true;
    reset.visible = true;
    obstacleGroup.setVelocityXEach(0);
    FoodGroup.setVelocityXEach(0);
    obstacleGroup.setLifetimeEach(-1);
    groundSprite.velocityX = 0;
    monkey.changeAnimation("collided",monkey_collided);
    monkey.scale = 0.7;
    monkey.setCollider("circle",0,0,10);
    bg.velocityX = 0;
    bg2.velocityX = 0;
    if(mousePressedOver(reset)){
      restart();
    }
  }
  monkey.collide(invisibleGround);
  monkey.velocityY+=0.6;
  drawSprites();
  fill("white");
  textSize(20);
  text("Score: "+ score,10,50);
  fill("black");
  
  text("Survival Time: "+SurvivalTime,10,80);
 
}

function spawnObstacle(){
  if(frameCount%150=== 0){
    obstacle = createSprite(430,300,20,20);
    obstacle.velocityX = -(4 + SurvivalTime/4);
    obstacle.scale = 0.13;
    obstacle.lifetime = 140;
    obstacle.addImage(obstacleImage);
    obstacleGroup.add(obstacle);
    obstacle.debug = false;
    obstacle.setCollider("circle",0,0,200);
    obstacle.depth = monkey.depth-1;
  }
}
function spawnFood(){
  if(frameCount%90 === 0){
    banana = createSprite(430,230,20,20);
    banana.debug = false;
    banana.setCollider("circle",0,-10,200);
    banana.velocityX = -(4 + SurvivalTime/4);
    banana.addImage(bananaImage);
    banana.scale = 0.1
    banana.lifetme = 140;
    FoodGroup.add(banana);
    banana.depth = monkey.depth - 1;
  }
}

function restart(){
  gameState = PLAY;
  frameCount = 0;
  SurvivalTime = 0;
  score = 0;
  obstacleGroup.destroyEach();
  FoodGroup.destroyEach();
  monkey.changeAnimation("moving",monkey_running);
  monkey.scale = 0.1;
  monkey.setCollider("circle",0,0,220);
  bg.velocityX = -4;
  bg2.velocityX = -4;
}

