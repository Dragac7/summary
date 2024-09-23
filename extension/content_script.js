browser.runtime.onMessage.addListener((message) => {
    if (message.action === "captureHTML") {
        captureHTML();
    }
});

function captureHTML() {
    let divs = [...document.querySelectorAll('div')].filter(x => x.innerText);
    let res = [];
    for (const div of divs) {
        res.push([...div.querySelectorAll('*')]
            .filter(x => x.tagName.match(/(^p$)|(^h[0-9]+$)/gi))
            .filter(x => x.innerText)
            .map(x => {
                const res = {};
                res[x.tagName.toLowerCase()] = x.innerText;
                return res;
            })
        );
    }

    res = res.sort((a,b) => b.length-a.length)

    browser.runtime.sendMessage({
        action: "sendHTML",
        res: JSON.stringify(res.filter(x => x.length).at(0))
    });
}
