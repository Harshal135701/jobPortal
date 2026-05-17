

const aiBtn = document.querySelector(".ai-btn");
const aiDropdown = document.querySelector(".ai-dropdown");

aiBtn.addEventListener("click", function(event){

    event.stopPropagation();

    if(aiDropdown.style.display === "block"){
        aiDropdown.style.display = "none";
    }
    else{
        aiDropdown.style.display = "block";
    }

});

document.addEventListener("click", function(){

    aiDropdown.style.display = "none";

});
