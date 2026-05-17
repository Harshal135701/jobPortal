
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

        const request = await fetch("/ai/preparation", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                prompt
            })

        });

        const response = await request.json();

        document.getElementById("result").innerText=response.data;

    }
    catch (err) {
        console.log(err.message);
        alert("Something went wrong");

    }

}
