function init() {
    getData();
    setupHandlers();
}

function getData() {
    Design.get().then(res => {
        if (res) {
            if (res.data.list == 2)
                list.src = "./images/List2.png";
            else
                list.src = "./images/List1.png";

            if (res.data.details == 2)
                details.src = "./images/Details2.png";
            else
                details.src = "./images/Details1.png";
        }
    }).catch(err => {
        console.log(err);
    });
}

function setupHandlers() {
    list1.addEventListener('click', () => {
        list.src = "./images/List1.png"
        saveData();
    });

    list2.addEventListener('click', () => {
        list.src = "./images/List2.png"
        saveData();
    });

    details1.addEventListener('click', () => {
        details.src = "./images/Details1.png"
        saveData();
    });

    details2.addEventListener('click', () => {
        details.src = "./images/Details2.png"
        saveData();
    });
}

function saveData() {
    let des = new DesignItem();
    console.log(list.src.endsWith("List2.png"))
    if (list.src.endsWith("List2.png"))
        des.list = 2;
    else
        des.list = 1;

    if (details.src.endsWith("Details2.png"))
        des.details = 2;
    else
        des.details = 1;
    Design.save(des).then(res => {
        console.log(res)
    }).catch(err => {

    })
}

init();