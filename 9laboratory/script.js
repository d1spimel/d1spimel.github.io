let attempts_element = document.getElementById("attempts");
let username_element = document.getElementById("username");
let card_player_element = document.querySelector("#card_player");
let card_computer_element = document.querySelector("#card_computer");
let score_computer_element = document.getElementById("score_computer");
let score_player_element = document.getElementById("score_player");
let generate_element = document.getElementById("generate");
let popup_text_element = document.getElementById("popup_text");
let popup_img_element = document.getElementById("popup_img");
let popup_registration_element = document.getElementById("popup_registration");
let registration_close_element = document.getElementById("registration_close");
let registration_close_button_element = document.getElementById(
  "registration_close_button"
);
let popup_registration__area_element = document.getElementById(
  "popup_registration__area"
);
registration_close_element.onclick = CloseRegistration;
registration_close_button_element.onclick = CloseRegistration;
popup_registration__area_element.onclick = CloseRegistration;
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
let username;
function CloseRegistration() {
  popup_registration_element.style.visibility = "hidden";
  popup_registration_element.style.opacity = 0;
  username = document.getElementById("registration_name").value;
  if (username == "" || username == null) {
    username = "Player";
  }
  username_element.innerHTML = username;
}
let score_user = 0;
let score_computer = 0;
let attempts = 0;

function generate() {
  attempts++;
  if (attempts < 4) {
		generate_element.setAttribute("href", "#");
    attempts_element.innerHTML = "Attempt " + attempts + " of 3";
    let card_user = getRandomInt(36) + 1;
    let card_computer = getRandomInt(36) + 1;
    card_player_element.src = "img/" + card_user + ".png";
    card_computer_element.src = "img/" + card_computer + ".png";
    if (card_user > 0 && card_user <= 4) {
      score_user += 6;
    }
    if (card_user > 4 && card_user <= 8) {
      score_user += 7;
    }
    if (card_user > 8 && card_user <= 12) {
      score_user += 8;
    }
    if (card_user > 12 && card_user <= 16) {
      score_user += 9;
    }
    if (card_user > 16 && card_user <= 20) {
      score_user += 10;
    }
    if (card_user > 20 && card_user <= 24) {
      score_user += 2;
    }
    if (card_user > 24 && card_user <= 28) {
      score_user += 3;
    }
    if (card_user > 28 && card_user <= 32) {
      score_user += 4;
    }
    if (card_user > 32 && card_user <= 36) {
      score_user += 11;
    }
    if (card_computer > 0 && card_computer <= 4) {
      score_computer += 6;
    }
    if (card_computer > 4 && card_computer <= 8) {
      score_computer += 7;
    }
    if (card_computer > 8 && card_computer <= 12) {
      score_computer += 8;
    }
    if (card_computer > 12 && card_computer <= 16) {
      score_computer += 9;
    }
    if (card_computer > 16 && card_computer <= 20) {
      score_computer += 10;
    }
    if (card_computer > 20 && card_computer <= 24) {
      score_computer += 2;
    }
    if (card_computer > 24 && card_computer <= 28) {
      score_computer += 3;
    }
    if (card_computer > 28 && card_computer <= 32) {
      score_computer += 4;
    }
    if (card_computer > 32 && card_computer <= 36) {
      score_computer += 11;
    }
    score_player_element.innerHTML = score_user;
    score_computer_element.innerHTML = score_computer;
    console.log(attempts);
		console.log(score_user + " " + score_computer);
  }
	if (attempts == 3) {
		generate_element.setAttribute("href", "#popup");
		if (score_user > score_computer) {
			popup_img_element.src = "user.png";
			popup_text_element.innerHTML = username + ", you win!";
		} else if (score_computer > score_user) {
			popup_img_element.src = "computer.png";
			popup_text_element.innerHTML = username + ", you lose!";
		}
		setTimeout(function reset(){
			attempts = 0;
			score_computer = 0;
			score_user = 0;
			attempts_element.innerHTML = "Attempt " + attempts + " of 3";
			score_player_element.innerHTML = score_user;
			score_computer_element.innerHTML = score_computer;
		}, 1000);
	}
}