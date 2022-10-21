let score_player = 0;
let score_computer = 0;
let name_element = document.getElementById("name");
let dice_player_element = document.getElementById("dice_player");
let score_player_element = document.getElementById("score_player");
let score_computer_element = document.getElementById("score_computer");
let dice_computer_element = document.getElementById("dice_computer");
let generate_element = document.getElementById("generate");
let user_img_element = document.getElementById("user_img");
let computer_img_element = document.getElementById("computer_img");
let popup_text_element = document.getElementById("popup_text");
let popup_img_element = document.getElementById("popup_img");
let popup_registration_element = document.getElementById("popup_registration");
let registration_close_element = document.getElementById("registration_close");
let registration_close_button_element = document.getElementById("registration_close_button");
let popup_registration__area_element = document.getElementById("popup_registration__area");
document.getElementById("registration_name");
registration_close_element.onclick = CloseRegistration;
registration_close_button_element.onclick = CloseRegistration;
popup_registration__area_element.onclick = CloseRegistration;
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
let name;
function CloseRegistration(){
	popup_registration_element.style.visibility = "hidden";
	popup_registration_element.style.opacity = 0; 
	name = document.getElementById("registration_name").value;
	if (name == "" || name == null) {
    name = "Player";
	}
	name_element.innerHTML = name;	
}
let newGame = 0;
function generate() {
    generate_element.innerHTML = "Generate";
    if (newGame == 0) {
        let ball_player = getRandomInt(6)+1;
				console.log(ball_player);
        dice_player_element.src = ball_player + ".png";
				dice_player_element.style.opacity = 0;
        let ball_computer = getRandomInt(6)+1;
				console.log(ball_computer);
        dice_computer_element.src = ball_computer + ".png";
				dice_computer_element.style.opacity = 0;
				setTimeout(function OpacityPlayer(){
					dice_player_element.style.opacity = 1;
				}, 150);
				setTimeout(function OpacityComputer(){
					dice_computer_element.style.opacity = 1;
				}, 150);
        if (ball_player > ball_computer) {
            score_player++;
            score_player_element.innerHTML = score_player;
						user_img_element.style.scale = 1.4;
						setTimeout(function ScaleUser(){
							user_img_element.style.scale = 1;
						}, 700);
        }

        else if (ball_player < ball_computer) {
            score_computer++;
            score_computer_element.innerHTML = score_computer;
						computer_img_element.style.scale = 1.4;
						setTimeout(function ScaleComputer(){
							computer_img_element.style.scale = 1;
						}, 700);
        }
        if (score_player == 3 || score_computer == 3) {
            newGame = 1;
            generate_element.innerHTML = "New Game";
        }
    }
    else if (newGame == 1) {
			generate_element.setAttribute("href", "#popup");
      if (score_player == 3) {
				popup_img_element.src = "user.png";
        popup_text_element.innerText = name + ", you win!";
      }
      else if (score_computer == 3) {
				popup_img_element.src = "computer.png";
				popup_text_element.innerText = name + ", you lose!";
      }
      newGame = 0;
      score_player = 0;
      score_player_element.innerHTML = score_player;
      score_computer = 0;
      score_computer_element.innerHTML = score_computer;
			setTimeout(function ResetPopup(){
				generate_element.setAttribute("href", "#");
			}, 500);
    }
}