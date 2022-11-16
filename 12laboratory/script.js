let word = $(".card__name span");
let easyWords = new Array("always", "hello", "bye", "hand", "mother", "father", "brother", "car", "left", "table");
let easyAnswers = new Array("завжди", "привіт", "до побачення", "рука", "мати", "батько", "брат", "автомобіль", "зліва", "стіл");
let middleWords = new Array("abandon", "absolute", "absense", "acid", "actual", "accuse", "bear", "basis", "bend", "belong");
let middleAnswers = new Array("покидати", "абсолютний", "безглуздий", "кислот", "фактичний", "звинувачувати", "несучий", "основа", "згинаит", "належати");
let highWords = new Array("above", "abrupt", "adolescent", "cabin", "calf", "definitive", "defy", "favour", "fearless", "feast");
let highAnswers = new Array("нагорі", "різкий", "підліток", "каюта","теля","остаточний","протистояти","користь","безстрашний","свято");
$('#radio-1').prop('checked',true); 
let words = easyWords;
let answers = easyAnswers;
let oldAnswers = new Array();
let current = 0;
let correct = 0, error = 0, pos = new Array();
$("#form").change(function changeLevel() { 
	let value = $('input[name="radio-1"]:checked').val();
	button.attr("href", "#");
	if (value == "Easy")
	{

		words = easyWords;
		answers = easyAnswers;
	} else if (value == "Middle")
	{
		words = middleWords;
		answers = middleAnswers;
	} else{
		words = highWords;
		answers = highAnswers;
	}
	current = 0;
	word.html(words[current]);
	error = 0, correct = 0;
	rightCounter.html(correct);
	errorCounter.html(correct);
	counter.html(current + 1 + "/10");
	oldAnswers.splice(0,oldAnswers.length);
	pos.splice(0, pos.length);
	console.log(pos);
	console.log(oldAnswers);
});

word.html(words[current]);
let button = $(".button").bind("click", checker);
let rightCounter = $(".right");
let errorCounter = $(".error");
let card = $(".card__block");
let right_icon = $(".right__icon img");
let error_icon = $(".error__icon img");
let popup_text = $("#popup_text");
let popup_img = $("#popup_img");
function checker(){
	let input = $(".input").val();
	if (!oldAnswers.includes(answers[current]) && input.toLowerCase() == answers[current] && !pos[current])
	{
		oldAnswers.push(answers[current]);
		rightCounter.html(++correct);
		card.css("box-shadow", "0 14px 28px rgba(123, 255, 0, 0.25), 0 10px 10px rgba(0,0,0,0.22)");
		right_icon.css("scale", "1.1");
	}
	else if(!oldAnswers.includes(answers[current]) && !pos[current]){
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
	word.html(words[current]);
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
	word.html(words[current]);
	setTimeout(function opacity(){
		word.css("transition", "opacity 1s");
		word.css("opacity", "1");
	}, 100); 
}