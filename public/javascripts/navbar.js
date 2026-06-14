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

profilePic.addEventListener("click", (event) => {

    event.stopPropagation();

    menu.style.display =
        menu.style.display === "block"
            ? "none"
            : "block";

});

/* ---------------- NOTIFICATION DROPDOWN ---------------- */

notificationBell.addEventListener("click", (event) => {

    event.stopPropagation();

    notificationDropdown.style.display =
        notificationDropdown.style.display === "block"
            ? "none"
            : "block";

});

/* ---------------- CLOSE ON OUTSIDE CLICK ---------------- */

document.addEventListener("click", () => {

    menu.style.display = "none";

    notificationDropdown.style.display = "none";

});

/* ---------------- PREVENT INSIDE CLICK CLOSE ---------------- */

menu.addEventListener("click", (event) => {

    event.stopPropagation();

});

notificationDropdown.addEventListener("click", (event) => {

    event.stopPropagation();

});

/* ---------------- SOCKET ---------------- */

socket.emit(

    "join_notification_room",

    window.currentUserId

);

/* ---------------- LOAD NOTIFICATIONS ---------------- */

async function loadNotifications() {

    try {

        const response = await fetch(

            `/notification/${window.currentUserId}`

        );

        const notifications =
            await response.json();

        notificationCount =
            notifications.filter(

                notification =>

                    !notification.isRead

            ).length;

        notificationCountElement.innerText =
            notificationCount;

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

            const div =
                document.createElement("div");

            div.classList.add(
                "notification-item"
            );

            if (notification.isRead) {

                div.classList.add("read");

            }

            else {

                div.classList.add("new");

            }

            div.dataset.id =
                notification._id;

            div.dataset.type =
                notification.type;

            div.dataset.relatedId =
                notification.relatedId;

            div.dataset.jobId =
                notification.jobId;

            div.dataset.chatUserId =
                notification.chatUserId;

            const time =
                new Date(
                    notification.createdAt
                ).toLocaleString();

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

    }

    catch (err) {

        console.log(err);

    }

}

/* ---------------- REALTIME NOTIFICATION ---------------- */

socket.on("new_notification", (data) => {

    const existing = document.querySelector(

        `[data-id="${data._id}"]`

    );

    if (existing) return;

    notificationCount++;

    notificationCountElement.innerText =
        notificationCount;

    const div =
        document.createElement("div");

    div.classList.add(
        "notification-item",
        "new"
    );

    div.dataset.id =
        data._id;

    div.dataset.type =
        data.type;

    div.dataset.relatedId =
        data.relatedId;

    div.dataset.jobId =
        data.jobId;

    div.dataset.chatUserId =
        data.chatUserId;

    const time =
        new Date(
            data.createdAt
        ).toLocaleString();

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

/* ---------------- CLICK NOTIFICATION ---------------- */

notificationList.addEventListener(

    "click",

    async (event) => {

        const notificationItem =

            event.target.closest(

                ".notification-item"

            );

        if (!notificationItem) return;

        const notificationId =

            notificationItem.dataset.id;

        try {

            const response =

                await fetch(

                    `/notification/${notificationId}/read`,

                    {

                        method: "PATCH"

                    }

                );

            const data =

                await response.json();

            if (data.success) {

                notificationItem.classList.remove(

                    "new"

                );

                notificationItem.classList.add(

                    "read"

                );

                if (

                    notificationCount > 0

                ) {

                    notificationCount--;

                }

                const type =

                    notificationItem.dataset.type;

                const jobId =

                    notificationItem.dataset.jobId;

                const chatUserId =

                    notificationItem.dataset.chatUserId;

                /* MESSAGE - opening the chat marks every
                   notification from this same conversation
                   as read on the server, so clear them all
                   here too instead of just this one */

                if (

                    type === "MESSAGE"

                ) {

                    const sameChatItems =

                        notificationList.querySelectorAll(

                            `.notification-item.new[data-job-id="${jobId}"][data-chat-user-id="${chatUserId}"]`

                        );

                    sameChatItems.forEach((item) => {

                        item.classList.remove("new");

                        item.classList.add("read");

                        if (notificationCount > 0) {

                            notificationCount--;

                        }

                    });

                }

                notificationCountElement.innerText =

                    notificationCount;

                /* MESSAGE */

                if (

                    type === "MESSAGE"

                ) {

                    if (

                        window.currentUserRole === "recruiter"

                    ) {

                        window.location.href =

                            `/recruiter/chat/candidate/${chatUserId}/${jobId}`;

                    }

                    else {

                        window.location.href =

                            `/recruiter/chat/${jobId}/${chatUserId}`;

                    }

                }

                /* APPLICATION */

                else if (

                    type ===

                    "APPLICATION_UPDATE"

                ) {

                    window.location.href =

                        "/applications/my";

                }

            }

        }

        catch (err) {

            console.log(err);

        }

    }

);

/* ---------------- INIT ---------------- */

loadNotifications();