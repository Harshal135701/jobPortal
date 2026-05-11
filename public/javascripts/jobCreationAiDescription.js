const button = document.getElementById("generateBtn");

button.addEventListener("click", async () => {
    const title = document.getElementById("title").value;
    const company = document.getElementById("company").value;
    const jobLocation = document.getElementById("location").value;
    const salary = document.getElementById("salary").value;
    const jobType = document.getElementById("jobType").value;
    const experienceLevel = document.getElementById("experienceLevel").value;

    try {
        const response = await fetch("/ai/generate-ai-description", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title,
                company,
                location: jobLocation,
                salary,
                jobType,
                experienceLevel
            })
        })
        const data = await response.json();
        if (data.success) {
            document.getElementById("description").value = data.description;
            console.log(data)
        }
        else {
            alert("Somethig went wrong")
        }
    }
    catch (err) {
        alert(err.message)
        
    }
})