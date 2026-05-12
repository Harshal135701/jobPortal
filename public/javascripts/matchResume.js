const matchBtn = document.querySelector(".match-btn");
const resultDiv = document.querySelector(".match-result");

matchBtn.addEventListener("click", async () => {

    const applicationId = matchBtn.dataset.applicationId;

    resultDiv.innerHTML = "Analyzing Resume...";

    try {
        console.log(applicationId);
        const response = await fetch(`/ai/check-match/${applicationId}`, {
            method: "POST"
        });

        const data = await response.json();

        console.log(data);

        if (data.success) {

            resultDiv.innerHTML = `
        <div class="ai-result">
            <pre>${data.match}</pre>
        </div>
    `;

        } else {

            resultDiv.innerHTML = `
        <p>${data.error}</p>
    `;
        }

    } catch (err) {

        console.log(err);

        resultDiv.innerHTML = `
            <p>Failed to analyze resume</p>
        `;
    }

});