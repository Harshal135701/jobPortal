
document.getElementById("candidatePrompt")
    .addEventListener("submit", SendPrompt);

async function SendPrompt(event) {

    event.preventDefault();

    try {

        const prompt =
            document.getElementById("inputPrompt").value;

        if (prompt.trim() === "") {
            return;
        }

        const button=document.querySelector(".generate-btn");
        button.disabled=true;
        button.innerHTML="Generating.."

        const request = await fetch("/ai/preparation", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                prompt
            })

        });
        button.disabled=false;
        button.innerHTML="Generate Questions"

        const response = await request.json();
        if (!response.success) {
            return document.getElementById("result").innerText = response.message || "AI service temporarily unavailable";
        }
        document.getElementById("result").innerText = response.data;

    }
    catch (err) {
        console.log(err.message);
        alert("Something went wrong");

    }

}
