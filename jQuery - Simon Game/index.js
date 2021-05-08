//colour options
let buttonColours = ["red","blue","green","yellow"];

//user clicked colours
let userClickedPattern = [];

//game generated colours
let gamePattern = [];

//To show that game has started
let firstTime = false;

let level = 0;

//function for playing sound
function playSound(name){
  let playSound = new Audio('sounds/' + name + '.mp3');
  playSound.play();
}

//function for generating a new sequence of colours
function newSequence(){
  userClickedPattern = [];
  let randomNumber = Math.floor(Math.random()*4);

  let randomChosenColour = buttonColours[randomNumber];

  gamePattern.push(randomChosenColour);
  console.log(gamePattern);
  console.log("Size of game pattern array :" + gamePattern.length);

  $("#" + randomChosenColour).fadeOut(100).fadeIn(100);

  playSound(randomChosenColour);
  
  level++;

  $("#level-title").text("Level " + level);
}

//animation for clicks
function animatePress(currentColour){
  let $var1 = $("." + currentColour);
  $("." + currentColour).addClass("pressed");

  setTimeout(function(){
    $var1.removeClass("pressed")},100);
}


function patternCheck(userInputPos){
  if(userClickedPattern[userInputPos] === gamePattern[userInputPos])
    console.log(true);

    else
    {
      console.log(false);
      gameOverScreen();
      startOver();
    }

  if(userClickedPattern.length === gamePattern.length)
      setTimeout(newSequence,1000);
    
  }

function gameOverScreen(){
  let $var2 = $("body");

  $("body").addClass("game-over");
  
  setTimeout(function(){
    $("body").removeClass("game-over");
  }, 200);

  let gameOver = new Audio('sounds/wrong.mp3');
  gameOver.play();

  $("#level-title").text("Game Over, Press Any Key to Restart");
}

//detecting first keyboard stroke
$(document).keydown(function(){
  if(firstTime === false){
    firstTime = true;
    newSequence();
  }
});


//function for playing sound when button is clicked
$(".btn").click(function(event){
  userClickedPattern.push(event.target.id);
  playSound(event.target.id);
  animatePress(event.target.id);
  //buttonPresses++;

  patternCheck(userClickedPattern.length-1);
});

function startOver(){
  level = 0;
  gamePattern = [];
  firstTime = false;
}

//debugging 
function loopNewSequence(x){
  for(let i = 0; i< x;i++)
    newSequence();
}



