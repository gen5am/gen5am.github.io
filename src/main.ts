/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";

console.log('Script started successfully');

let currentPopup: any = undefined;

// Waiting for the API to be ready
WA.onInit().then(() => {
    console.log('Scripting API ready');
    console.log('Player tags: ',WA.player.tags)

    WA.room.area.onEnter('clock').subscribe(() => {
        const today = new Date();
        const time = today.getHours() + ":" + today.getMinutes();
        currentPopup = WA.ui.openPopup("clockPopup", "It's " + time, []);
    })

    WA.room.area.onLeave('clock').subscribe(closePopup)

    // The line below bootstraps the Scripting API Extra library that adds a number of advanced properties/features to WorkAdventure
    bootstrapExtra().then(() => {
        console.log('Scripting API Extra ready');
    }).catch(e => console.error(e));

}).catch(e => console.error(e));



// Request notification permission
if (Notification.permission === 'default') {
    Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
            console.log('Notification permission granted.');
        } else {
            console.log('Notification permission denied.');
        }
    });
}

// Function to show notification
function showNotification(author, message) {
    if (Notification.permission === 'granted') {
        new Notification('New Chat Message', {
            body: `${author}: ${message}`,
            icon: '/src/icons/chat.png' // Optional: Add a path to an icon
        });

        // Optional: Add click event to focus the window
        notification.onclick = () => {
            window.focus();
        };
    }
}

// Listen for chat messages
WA.chat.onChatMessage((message, event) => {
    console.log('Message received: ', message);
    console.log('Message author: ', event.author.name);

    // Show a notification
    showNotification(event.author.name, message);
}, {
    scope: 'global' // You can change the scope to 'global' if needed
});





function closePopup(){
    if (currentPopup !== undefined) {
        currentPopup.close();
        currentPopup = undefined;
    }
}

export {};
