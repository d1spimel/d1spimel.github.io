    function getRandomInt(max)
    {
        return Math.floor(Math.random() * max);
    }
    let score_player = 0;
    let score_computer = 0;

    let name = prompt("Enter your name: ");
    if (name == "" || name == null)
    {
        name = "Player";
    }
    let name_element = document.getElementById("name");
    name_element.innerHTML = name;
    let new_game = 0;
    function generate()
    {
        let ball_player_element = document.getElementById("ball_player");
        let score_player_element = document.getElementById("score_player");
        let score_computer_element = document.getElementById("score_computer");
        let ball_computer_element = document.getElementById("ball_computer");

        let ball_player = getRandomInt(7);
        ball_player_element.innerHTML = ball_player;
        let ball_computer = getRandomInt(7);
        ball_computer_element.innerHTML = ball_computer;
        if (ball_player > ball_computer)
        {
            score_player++;
            score_player_element.innerHTML = score_player;
        }
        else if (ball_player < ball_computer)
        {
            score_computer++;
            score_computer_element.innerHTML = score_computer;
        }
        if (score_player == 3)
        {
            alert(`${name}, you win!`);
            new_game = 20;
        }
        else if (score_computer == 3)
        {
            alert(`${name}, you lose!`);
            new_game = 20;
        }
        new_game++;
        if (new_game == 21 || score_computer == 21)
        {
            score_player = 0;
            score_player_element.innerHTML = score_player;
            ball_player_element.innerHTML = "&nbsp;";
            score_computer = 0;
            score_computer_element.innerHTML = score_computer;
            ball_computer_element.innerHTML = "&nbsp;";
        }
    }