

const profilePic = document.querySelector(".profile-pic");
const menu = document.getElementById("dropdownMenu");

profilePic.addEventListener("click", function (event) {

    event.stopPropagation();
    // This stops to triggered immediatly .

    if (menu.style.display === "block") {
        menu.style.display = "none";
    }
    else {
        menu.style.display = "block";
    }

});

document.addEventListener("click", function () {

    menu.style.display = "none";

});

menu.addEventListener("click", function (event) {

    event.stopPropagation();

});
