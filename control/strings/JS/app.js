let strings;

function loadLanguage(lang) {
    buildfire.messaging.sendMessageToWidget({
        id: Enum.messageType.closeItem,
        openSubItemPage: false,
    });
    strings = new buildfire.services.Strings(lang, stringsConfig);
    strings.init().then(() => {
        stringsContainer.classList.remove("hidden");
        strings.inject();
    });
    stringsUI.init("stringsContainer", strings, stringsConfig);
}
loadLanguage("en-US");