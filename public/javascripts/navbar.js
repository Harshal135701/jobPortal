const profilePic = document.querySelector(".profile-pic");
const menu = document.getElementById("dropdownMenu");

const notificationCountElement =
    document.getElementById("notificationCount");

const notificationBell =
    document.getElementById("notificationBell");

const notificationDropdown =
    document.getElementById("notificationDropdown");

const notificationList =
    document.getElementById("notificationList");

let notificationCount = 0;

const socket = io();

/* ---------------- PROFILE DROPDOWN ---------------- */

profilePic.addEventListener("click", function (event) {
    event.stopPropagation();

    if (menu.style.display === "block") {
        menu.style.display = "none";
    } else {
        menu.style.display = "block";
    }
});

/* ---------------- NOTIFICATION DROPDOWN ---------------- */

notificationBell.addEventListener("click", (event) => {
    event.stopPropagation();

    if (notificationDropdown.style.display === "block") {
        notificationDropdown.style.display = "none";
    } else {
        notificationDropdown.style.display = "block";
    }
});

/* close everything on outside click */

document.addEventListener("click", function () {
    menu.style.display = "none";
    notificationDropdown.style.display = "none";
});

/* prevent inside click close */

menu.addEventListener("click", function (event) {
    event.stopPropagation();
});

notificationDropdown.addEventListener("click", function (event) {
    event.stopPropagation();
});

/* ---------------- SOCKET SETUP ---------------- */

socket.emit(
    "join_notification_room",
    window.currentUserId
);

/* ---------------- LOAD NOTIFICATIONS (DB) ---------------- */

async function loadNotifications() {
    try {
        const response = await fetch(
            `/notification/${window.currentUserId}`
        );

        const notifications = await response.json();

        notificationCount = notifications.length;
        notificationCountElement.innerText = notificationCount;

        notificationList.innerHTML = "";

        if (notifications.length === 0) {
            notificationList.innerHTML = `
                <div class="empty-notification">
                    No notifications yet
                </div>
            `;
            return;
        }

        notifications.forEach((notification) => {

            const div = document.createElement("div");

            div.classList.add("notification-item");

            div.setAttribute("data-id", notification._id);

            const time = new Date(notification.createdAt)
                .toLocaleString();

            div.innerHTML = `
                <div class="notification-message">
                    ${notification.message}
                </div>
                <div class="notification-time">
                    ${time}
                </div>
            `;

            notificationList.appendChild(div);
        });

    } catch (error) {
        console.log(error);
    }
}

/* ---------------- REALTIME NOTIFICATION ---------------- */

socket.on("new_notification", (data) => {

    // prevent duplicates
    const existing = document.querySelector(
        `[data-id="${data._id}"]`
    );

    if (existing) return;

    // update count safely
    notificationCount++;
    notificationCountElement.innerText = notificationCount;

    const div = document.createElement("div");

    div.classList.add("notification-item", "new");

    div.setAttribute("data-id", data._id);

    const time = new Date(data.createdAt)
        .toLocaleString();

    div.innerHTML = `
        <div class="notification-message">
            ${data.message}
        </div>
        <div class="notification-time">
            ${time}
        </div>
    `;

    notificationList.prepend(div);

});

/* ---------------- INIT ---------------- */

loadNotifications();