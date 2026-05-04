const buttons = document.querySelectorAll(".bookmark-btn");

buttons.forEach((btn) => {
    btn.addEventListener("click", async function () {
        const jobId = this.dataset.id;
        
        try {
            const response = await fetch(`/jobs/bookmark/${jobId}`, {
                method: "POST"
            })

            const data = await response.json()

            if (data.success) {
                this.innerText = data.bookmarked ? "saved" : "save job"
            }
            else {
                alert(data.message)
            }
        }
        catch (err) {
            console.log(err)
            alert("Something went wrong");
        }
    })
});