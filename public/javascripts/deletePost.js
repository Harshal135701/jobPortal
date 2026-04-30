document.querySelectorAll(".deleteBtn").forEach(button => {
    button.addEventListener("click", async function (e) {
        e.preventDefault();
       const jobId = this.dataset.jobId;

        const isConfirmed = confirm("Are you sure to delete the post?");
        if (!isConfirmed) {
            return;
        }

        try {
            const response = await fetch(`/recruiter/${jobId}/delete`, {
                method: "DELETE"
            });

            const data = await response.json();

            alert(data.message);

            if (data.success) {
                 window.location.reload();
            }
        }
        catch (err) {
            alert("Something went wrong");
        }
    });
});
