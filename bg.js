chrome.action.onClicked.addListener((tab) => {

    const target = { tabId: tab.id };

    chrome.debugger.attach(target, "1.3", () => {

        if (chrome.runtime.lastError) {
            console.error("Attach failed:", chrome.runtime.lastError.message);
            return;
        }

        chrome.debugger.sendCommand(
            target,
            "Page.printToPDF",
            {
                landscape: true,
                marginTop: 0,
                marginBottom: 0,
                marginLeft: 0,
                marginRight: 0,
                printBackground: true
            },
            (result) => {

                if (chrome.runtime.lastError) {
                    console.error("printToPDF failed:", chrome.runtime.lastError.message);
                    chrome.debugger.detach(target);
                    return;
                }

                chrome.downloads.download({
                    url: "data:application/pdf;base64," + result.data,
                    filename: "page.pdf",
                    saveAs: false
                });

                chrome.debugger.detach(target);
            }
        );

    });

});