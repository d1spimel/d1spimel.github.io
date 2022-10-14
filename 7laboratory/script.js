    document.body.innerHTML = `
				<div class="question__container">
				<div class="question">
					<input type="text" id="input">
				</div>
				<div class="buttons">
					<button class="set" id="set">Set</button>
					<button class="clear" id="clear">Clear</button>
				</div>
		</div>
		</div>
		<div class="wrapper">
			<div class="ball__container">
					<div class="ball__background">
							<div class="ball__title">
									<p id="question"></p>
							</div>
							<div class="ball__image" id="ball__image"">
									<img src="ball.png" alt="Ball">
							</div>
							<div class="ball__answer">
									<p id="answer"></p>
							</div>
					</div>
			</div>
		</div>
   `
		let ball__image = document.getElementById("ball__image");
    let quest = document.getElementById("question");
		let input = document.getElementById("input");
		let clear = document.getElementById("clear");
		let set = document.getElementById("set");
		clear.onclick = function clear(){
			input.value = "";
			answer.innerText = "...";
			quest.innerHTML = "";
		}
		set.onclick = function set(){
			quest.innerHTML = input.value;
		}
		ball__image.onclick = function random(){
			let content = quest.textContent;
			if (content.length > 0 && content[content.length-1] == "?")
			{
					let rand = parseInt(Math.random()*10);
					let answer = document.getElementById("answer");
					if (rand % 2 == 0)
					{
						answer.innerText = "Yes";
						answer.style.padding = "5px";
					}else
					{
						answer.innerHTML = "No";
						answer.style.padding = "5px";
					}
				}
				else if(content[content.length-1] != "?")
				{
					quest.innerHTML = "Enter a question!";
				}
		}
