let currentQuestion = "";

document
    .getElementById("candidatePrompt")
    .addEventListener("submit", sendData);

async function sendData(event) {

    event.preventDefault();

    try {

        const role =
            document.getElementById("inputRole").value;

        const company =
            document.getElementById("inputCompany").value;

        const experience =
            document.getElementById("experience").value;

        const difficulty =
            document.getElementById("difficulty").value;

        const button=document.querySelector(".start-btn")
        button.disabled=true;
        button.innerHTML="Generating questions.."
        

        const request = await fetch("/ai/mockInterview", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                role,
                company,
                experience,
                difficulty
            })

        });

        button.disabled=false;
        button.innerHTML="Start Interview"

        const response = await request.json();
        if (!response.success) {
            return document.getElementById("questionBox").innerText = response.message || "AI service temporarily unavailable";
        }
        currentQuestion = response.question;

        document
            .getElementById("questionBox")
            .innerHTML = `
                <div class="question-card">

                    <h3>Interview Question</h3>

                    <p>${response.question}</p>

                </div>
            `;

        document
            .getElementById("feedbackBox")
            .innerHTML = "";

        document
            .getElementById("candidateAnswer")
            .value = "";

    }
    catch (err) {

        console.log(err);

    }

}

document
    .getElementById("submitAnswerBtn")
    .addEventListener("click", submitAnswer);

async function submitAnswer() {

    try {

        const answer =
            document.getElementById("candidateAnswer").value;

        if (answer.trim() === "") {
            return;
        }

        document
            .getElementById("submitAnswerBtn")
            .innerText = "Evaluating...";


        const request = await fetch(
            "/ai/evaluateAnswer",
            {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    question: currentQuestion,

                    answer: answer

                })

            }
        );

        const response = await request.json();

        document
            .getElementById("feedbackBox")
            .innerHTML = `
                <div class="question-card">

                    <h3>AI Feedback</h3>

                    <p>
                        ${response.feedback
                ? response.feedback.replace(/\n/g, "<br>")
                : "No feedback generated"}
                    </p>

                </div>
            `;

        document
            .getElementById("submitAnswerBtn")
            .innerText = "Submit Answer";

    }
    catch (err) {

        console.log(err);

        document
            .getElementById("submitAnswerBtn")
            .innerText = "Submit Answer";

    }

}