document.querySelectorAll(".remove-btn").forEach(btn => {
    btn.addEventListener("click", async () => {

        const jobId = btn.getAttribute("data-id");
        const confirmMess = confirm("Do you want to remove bookmark ?")

        if (!confirmMess) {
            return;
        }
        try {
            const res = await fetch(`/jobs/bookmark/${jobId}/remove`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const data = await res.json();

            if (data.success) {
                // remove from UI instantly
                btn.closest(".job-card").remove();
            } else {
                alert("Failed to remove bookmark");
            }

        } catch (err) {
            console.log(err);
            alert("Something went wrong");
        }
    });
});