const form = document.getElementById("updateProfile");

try {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const isConfirmed = confirm("Are you sure to update the profile?");
        if (!isConfirmed) return;
        const formData = new FormData(form);
        // FormData will get all data of form
        const response = await fetch("/profile/update", {
            method: "PATCH",
            body: formData
        })
        const data = await response.json();
        alert(data.message);
        window.location.reload();
    })
}
catch (err) {
    alert("Something went wrong")
}