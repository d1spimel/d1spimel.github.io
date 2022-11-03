let attempt_element = document.getElementById("attempt");
let username_element = document.getElementById("username");
let generate_element = document.getElementById("generate");
let popup_element = document.getElementById("popup");
let popup_text_element = document.getElementById("popup_text");
let popup_img_element = document.getElementById("popup_img");
let popup_registration_element = document.getElementById("popup_registration");
let registration_close_element = document.getElementById("registration_close");
let registration_close_button_element = document.getElementById("registration_close_button");
let popup_registration__area_element = document.getElementById("popup_registration__area");
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
let attempts = 0;
let arr = new Array();

function generate() {
	attempts++;
	generate_element.setAttribute("href", "#");
	if (attempts < 4) {
		for (let i = 0; i < 9; i++) {
			let random = getRandomInt(6) + 1;
			arr[i] = random;
		}
		while (arr[1] == arr[0]) {
			arr[1] = getRandomInt(8) + 1;
		}
		while (arr[2] == arr[1] || arr[2] == arr[0]) {
			arr[2] = getRandomInt(8) + 1;
		}
		while (arr[4] == arr[3]) {
			arr[4] = getRandomInt(8) + 1;
		}
		while (arr[5] == arr[4] || arr[5] == arr[3]) {
			arr[5] = getRandomInt(8) + 1;
		}
		while (arr[7] == arr[6]) {
			arr[7] = getRandomInt(8) + 1;
		}
		while (arr[8] == arr[7] || arr[8] == arr[6]) {
			arr[8] = getRandomInt(8) + 1;
		}
		attempt_element.innerHTML = "Attempt " + attempts + " of 3";
		for (let i = 0; i < 9; i++) {
			let slot_element = document.getElementById("slot" + i);
			slot_element.src = "img/" + arr[i] + ".png";
		}
		if (
			(arr[0] == arr[3] && arr[0] == arr[6]) ||
			(arr[1] == arr[4] && arr[1] == arr[7]) ||
			(arr[2] == arr[5] && arr[2] == arr[8])
		) {
			popup_img_element.src = "user.png";
			popup_text_element.innerHTML = username + ", you win!";
			generate_element.setAttribute("href", "#popup");
			generate_element.setAttribute("onClick", "#popup");
			generate_element.click();
			attempts = 0;
			attempt_element.innerHTML = "Attempt " + attempts + " of 3";
			
		}
	}
	setTimeout(() => {
		generate_element.setAttribute("href", "#");
		generate_element.setAttribute("onClick", "generate()");
	}, 200);

	if (attempts == 3) {
		generate_element.setAttribute("href", "#popup");
		popup_img_element.src = "computer.png";
		popup_text_element.innerHTML = username + ", you lose!";
		attempts = 0;
		attempt_element.innerHTML = "Attempt " + attempts + " of 3";
	}
}
