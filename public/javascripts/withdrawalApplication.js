document.querySelectorAll(".delete-btn").forEach(button => {
    button.addEventListener("click", async function () {

        const id = this.dataset.id;
        console.log("ID:", id);
        // get status from DOM (we’ll add this below)
        const status = this.closest(".application-card")
            .querySelector(".status")
            .innerText
            .trim()
            .toLowerCase();

        if (status !== "pending") {
            alert("You cannot withdraw this application now.");
            return;
        }

        const confirmation = confirm("Withdraw this application?");
        if (!confirmation) return;

        try {
            const response = await fetch(`/applications/delete/${id}`, {
                method: "DELETE",
                credentials: "include"
            });

            const data = await response.json();

            alert(data.message);

            if (data.success) {
                // window.location.reload();
                this.closest(".application-card").remove();
            }

        } catch (err) {
            alert("Something went wrong");
        }
    });
});