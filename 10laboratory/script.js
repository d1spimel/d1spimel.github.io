let attempt_element = document.getElementById("attempt");
let username_element = document.getElementById("username");
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

let username = prompt("Enter your name: ");
if (username == "" || username == null) {
  username = "Player";
}

username_element.innerHTML = username;
let attempts = 0;
let arr = new Array();

function generate() {
  attempts++;
  if (attempts <= 3) {
    for (let i = 0; i < 9; i++) {
      let random = getRandomInt(8) + 1;
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
    console.log(arr[0] + " " + arr[1] + " " + arr[2]);
    if (
      (arr[0] == arr[3] && arr[0] == arr[6]) ||
      (arr[1] == arr[4] && arr[1] == arr[7]) ||
      (arr[2] == arr[5] && arr[2] == arr[8])
    ) {
      alert(username + ", you win!");
      attempts = 0;
      attempt_element.innerHTML = "Attempt " + attempts + " of 3";
    }
  } else if (attempts == 4) {
    attempts = 0;
    alert(username + ", you lose!");
    attempt_element.innerHTML = "Attempt " + attempts + " of 3";
  }
}
