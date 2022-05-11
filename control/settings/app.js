config = {
    initialData: null
}

function init() {
    buildfire.messaging.sendMessageToWidget({
        id: Enum.messageType.closeItem,
        openSubItemPage: false,
    });

    getData();
    setupHandlers();
}

function getData() {
    Settings.get().then((result) => {
            if (result) {
                config.initialData = result;
                if (config.initialData.data) {
                    bookmarkSwitchBtn.defaultChecked = config.initialData.data.bookmarks;
                    NotesSwitchBtn.defaultChecked = config.initialData.data.notes;
                    shareSwitchBtn.defaultChecked = config.initialData.data.sharing;
                }
            }
        })
        .catch((err) => {
            console.error("Error in getting Introduction::: ", err);
        });
}

function setupHandlers() {
    bookmarkSwitchBtn.addEventListener('click', saveSettings);
    NotesSwitchBtn.addEventListener('click', saveSettings);
    shareSwitchBtn.addEventListener('click', saveSettings);
    deleteBtn.addEventListener('click', deleteData);
}

function saveSettings() {
    let sett = new SettingsItem();
    sett.bookmarks = bookmarkSwitchBtn.checked;
    sett.notes = NotesSwitchBtn.checked;
    sett.sharing = shareSwitchBtn.checked;
    Settings.save(sett)
        .then((result) => {
        })
        .catch((err2) => {
            console.error("Error in saving Introduction::: ", err2);
        });
}

function deleteData() {
    buildfire.dialog.confirm({
            title: "Delete Data",
            message: "Are you sure you want to delete all data? This action is not reverisible",
            confirmButton: {
                text: "Delete Data",
                type: "danger",
            },
        },
        (err, isConfirmed) => {
            if (err) console.error(err);

            if (isConfirmed) {
                var searchOptions = {
                    "filter": {},
                    "sort": {},
                    "fields": [],
                    "skip": 0,
                    "limit": 0
                };
                var promise1 = Introduction.save(new IntroductionItem());
                var promise2 = Products.search(searchOptions);
                Promise.all([promise1, promise2]).then((results) => {
                    results[1].forEach(prod => {
                        Products.delete(prod.id).then(res => {

                        }).catch(err => {
                            console.error(err);
                        });
                    })
                }).catch(err => {
                    console.error(err);
                });
            } else {
                //Prevent action

            }
        }
    );
}

init();