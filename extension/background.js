browser.runtime.onMessage.addListener((message, sender) => {
    if (message.action === "sendHTML") {
        sendBlobToServer(message)
            .then(responseData => {
                browser.runtime.sendMessage({
                    action: "displayResponse",
                    response: responseData.response
                });
            });
    }
});

// Function to send HTML to local server
async function sendBlobToServer(data) {
    try {
        const response = await fetch('http://localhost:5555/summarize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}
