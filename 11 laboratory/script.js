let word = $(".card__name span");
let words = new Array("always", "hello", "bye", "hand", "mother", "father", "brother", "car", "left", "table");
let answers = new Array("завжди", "привіт", "до побачення", "рука", "мати", "батько", "брат", "автомобіль", "зліва", "стіл");
let oldAnswers = new Array();
let current = Math.floor(Math.random()*11);
// Змішування слів
let shuffleWords = new Array();
shuffleWords[0] = words[current];
shuffleWords = shuffleWords.concat(words);
delete shuffleWords[current+1];
shuffleWords = shuffleWords.filter(element => element != null);
// Змішування відповідей
let shuffleAnswers = new Array();
shuffleAnswers[0] = answers[current];
shuffleAnswers = shuffleAnswers.concat(answers);
delete shuffleAnswers[current+1];
shuffleAnswers = shuffleAnswers.filter(element => element != null);

current = 0;
word.html(shuffleWords[current]);
let button = $(".button").bind("click", checker);
let rightCounter = $(".right");
let errorCounter = $(".error");
let correct = 0, error = 0, pos = new Array();
let card = $(".card__block");
let right_icon = $(".right__icon img");
let error_icon = $(".error__icon img");
let popup_text = $("#popup_text");
let popup_img = $("#popup_img");
function checker(){
	let input = $(".input").val();
	if (!oldAnswers.includes(shuffleAnswers[current]) && input.toLowerCase() == shuffleAnswers[current] && !pos[current])
	{
		oldAnswers.push(shuffleAnswers[current]);
		rightCounter.html(++correct);
		card.css("box-shadow", "0 14px 28px rgba(123, 255, 0, 0.25), 0 10px 10px rgba(0,0,0,0.22)");
		right_icon.css("scale", "1.1");
	}
	else if(!oldAnswers.includes(shuffleAnswers[current]) && !pos[current]){
		errorCounter.html(++error);
		card.css("box-shadow", "0 14px 28px rgba(255, 0, 0, 0.25), 0 10px 10px rgba(0,0,0,0.22)");
		error_icon.css("scale", "1.1");
	}
	pos[current] = true;
	setTimeout(function shadow(){
		card.css("box-shadow", "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)");
	}, 1000); 
	if (correct + error == 10)
	{
		if(correct <= 3)
		{
			popup_img.attr("src", "img/1.png")
			popup_text.html("Your english level is low!");
		} else if(correct <= 7)
		{
			popup_img.attr("src", "img/2.png")
			popup_text.html("Your english level is middle!");
		}else{
			popup_img.attr("src", "img/3.png")
			popup_text.html("Your english level is high!");
		}
		button.attr("href", "#popup");
		button.bind("click", "");
		button.click();
	}else{
		setTimeout(function next(){
			right();
			right_icon.css("scale", "1");
			error_icon.css("scale", "1");
		}, 500);
	}
}

let counter = $(".words");
let leftArrow = $(".left__arrow a").bind("click", left);
let rightArrow = $(".right__arrow a").bind("click", right);
function left(){
	if (current != 0)
	{
		current--;
	}
	else{
		current = 9;
	}
	counter.html(current + 1 + "/10");
	word.css("transition", "opacity 0s");
	word.css("opacity", "0");
	word.html(shuffleWords[current]);
	setTimeout(function opacity(){
		word.css("transition", "opacity 1s");
		word.css("opacity", "1");
	}, 100); 
}
function right(){
	if (current != 9)
	{
		current++
	}
	else{
		current = 0;
	}
	counter.html(current + 1 + "/10");
	word.css("transition", "opacity 0s");
	word.css("opacity", "0");
	word.html(shuffleWords[current]);
	setTimeout(function opacity(){
		word.css("transition", "opacity 1s");
		word.css("opacity", "1");
	}, 100); 
}