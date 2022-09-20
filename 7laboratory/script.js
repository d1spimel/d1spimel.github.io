let question = prompt("Enter a question!");
console.log(question);
if (question == "" || question == null || question.length > 26)
{
    alert("Very big question or empty!");
}
else
{
    document.body.innerHTML = `
    <div class="wrapper">
            <div class="ball__container">
                <div class="ball__background">
                    <div class="ball__title">
                        <p id="question"></p>
                    </div>
                    <div class="ball__image" onClick="random();">
                        <img src="ball.png" alt="Ball">
                    </div>
                    <div class="ball__answer">
                        <p id="answer"></p>
                    </div>
                </div>
            </div>
        </div>
    `
    let quest = document.getElementById("question");
    quest.innerHTML = question;
    function random()
    {
        let rand = parseInt(Math.random()*10);
        let answer = document.getElementById("answer");
        if (rand % 2 == 0)
        {
            answer.innerText = "Yes";
            answer.style.padding = "5px";
        }
        else
        {
            answer.innerHTML = "No";
            answer.style.padding = "5px";
        }
    }
}