const forms = document.querySelectorAll(".updateStatusForm");

forms.forEach((form) => {
    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const updatedStatus = form.querySelector(".status").value;
        const id = form.dataset.applicantId;

        try {
            const response = await fetch(`/recruiter/${id}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    status: updatedStatus
                })
            });

            const data = await response.json();
            alert(data.message);

            if (data.success) {
                window.location.reload();
            }
        } catch (err) {
            alert("Something went wrong");
        }
    });
});