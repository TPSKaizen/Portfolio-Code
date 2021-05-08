for(var a = 0; a < document.querySelectorAll(".drum").length; a++){
  //loop is for going through every instance of .drum class
  document.querySelectorAll("button")[a].addEventListener("click", function() {
    //Puts every button object in an array and apply click function to them
      var drumKey = this.innerHTML;

      makeSound(drumKey);
      //detecting click input

      buttonAnimation(drumKey);
      //adding Animation
  });
} 


document.addEventListener("keydown", function(event){
//detecting keyboard press
    makeSound(event.key);
 
//adding Animation
    buttonAnimation(event.key);
    
});


function makeSound(input){
  switch(input){
    case "w":
      var tom1 = new Audio('sounds/tom-1.mp3');
      tom1.play();  
    break;

    case "a":
        var tom2 = new Audio('sounds/tom-2.mp3');
        tom2.play();  
    break;

    case "s":
        var tom3 = new Audio('sounds/tom-3.mp3');
        tom3.play();  
    break;

    case "d":
        var tom4 = new Audio('sounds/tom-4.mp3');
        tom4.play();  
    break;

    case "j":
        var snare = new Audio('sounds/snare.mp3');
        snare.play();  
    break;

    case "k":
        var crash = new Audio('sounds/crash.mp3');
        crash.play();  
    break;

    case "l":
        var kick = new Audio('sounds/kick-bass.mp3');
        kick.play();  
    break;

    default: console.log(input);
    }
  }

  function buttonAnimation(currentKey){

    var activeButton = document.querySelector("." + currentKey);

    activeButton.classList.add("pressed");

    setTimeout(function(){
      activeButton.classList.remove("pressed");
    }, 100);

  }





