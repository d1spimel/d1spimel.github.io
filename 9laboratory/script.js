let attempts_element = document.getElementById("attempts");
let username_element = document.getElementById("username");
let card_player_element = document.querySelector('#card_player');
let card_computer_element = document.querySelector('#card_computer');
let score_computer_element = document.getElementById("score_computer");
let score_player_element = document.getElementById("score_player");


    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }
    let username = prompt("Enter your name: ");
    if (username == "" || username == null || username.length>12){
        username = "Player";
    }

    username_element.innerHTML = username;
    let score_user = 0;
    let score_computer = 0;
    let attempts = 0;

    function generate(){
        attempts++;
        attempts_element.innerHTML = "Attempt " + (attempts) + " of 3";
        let card_user = getRandomInt(36);
        let card_computer = getRandomInt(36);
        card_player_element.src = "img/" + card_user + ".png";
        card_computer_element.src = "img/" + card_computer + ".png";

        if (card_user > 0 && card_user <= 4)   { score_user += 6; }
        if (card_user > 4 && card_user <= 8)   { score_user += 7; }
        if (card_user > 8 && card_user <= 12)  { score_user += 8; }
        if (card_user > 12 && card_user <= 16) { score_user += 9; }
        if (card_user > 16 && card_user <= 20) { score_user += 10;}
        if (card_user > 20 && card_user <= 24) { score_user += 2; }
        if (card_user > 24 && card_user <= 28) { score_user += 3; }
        if (card_user > 28 && card_user <= 32) { score_user += 4; }
        if (card_user > 32 && card_user <= 36) { score_user += 11;}
        if (card_computer > 0 && card_computer <= 4)   { score_computer += 6; }
        if (card_computer > 4 && card_computer <= 8)   { score_computer += 7; }
        if (card_computer > 8 && card_computer <= 12)  { score_computer += 8; }
        if (card_computer > 12 && card_computer <= 16) { score_computer += 9; }
        if (card_computer > 16 && card_computer <= 20) { score_computer += 10;}
        if (card_computer > 20 && card_computer <= 24) { score_computer += 2; }
        if (card_computer > 24 && card_computer <= 28) { score_computer += 3; }
        if (card_computer > 28 && card_computer <= 32) { score_computer += 4; }
        if (card_computer > 32 && card_computer <= 36) { score_computer += 11;}
        score_player_element.innerHTML = score_user;
        score_computer_element.innerHTML = score_computer;
        if (attempts == 3)
        {
            if (score_user > score_computer)
            {
                alert(username + ", you win!")
            }
            else if(score_computer > score_user)
            {
                alert(username + ", you lose!")
            }
            else
            {
                alert(username + ", its draw!")
            }
            attempts = 0;
            score_computer = 0;
            score_user = 0;
            attempts_element.innerHTML = "Attempt " + (attempts) + " of 3";
            score_player_element.innerHTML = score_user;
            score_computer_element.innerHTML = score_computer;
            card_player_element.src = "img/" + 0 + ".png";
            card_computer_element.src = "img/" + 0 + ".png";
        }
    }