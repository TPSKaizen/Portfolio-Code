//generate random numbers
var randomNumber1 = Math.floor(Math.random()*6)+1;
var randomNumber2 = Math.floor(Math.random()*6)+1;

//set the pictures based on random number created thorough setAttribute
document.querySelector(".img1").setAttribute("src", "imgs/dice" + randomNumber1 + ".png");
document.querySelector(".img2").setAttribute("src", "imgs/dice" + randomNumber2 + ".png");

//set game conditions and advertise results through DOM
if(randomNumber1 > randomNumber2){
 console.log( document.querySelector("h1").innerHTML = "Player 1 wins! <i class='fas fa-flag'></i> ");
}
else if (randomNumber1 < randomNumber2) {
  console.log( document.querySelector("h1").innerHTML = " <i class='fas fa-flag'></i> Player 2 wins!");
}

else{
  console.log( document.querySelector("h1").innerHTML = "Draw!");
}