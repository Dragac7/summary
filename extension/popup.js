document.addEventListener("DOMContentLoaded", function () {
    const captureBtn = document.getElementById('capture-html-btn');
    const responseBox = document.getElementById('response-box');

    captureBtn.addEventListener('click', function () {
        browser.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            const activeTab = tabs[0];

            browser.tabs.sendMessage(activeTab.id, { action: "captureHTML" });
        });
    });

    browser.runtime.onMessage.addListener((message) => {
        if (message.action === "displayResponse") {
            responseBox.value = message.response;
        }
    });
});
