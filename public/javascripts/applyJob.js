const form = document.getElementById("formForApply")

form.addEventListener("submit", async function (e) {

    e.preventDefault();
    const id = form.dataset.jobid;
    try {
        const response = await fetch(`/applications/apply/${id}`, {
            method: "POST"
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
})