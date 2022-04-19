const searchTableConfig = {
    options: {
        showEditButton: true,
        showDeleteButton: true
    },
    columns: [{
            header: "",
            data: "${data.profileImgUrl}",
            type: "Image",
            width: "",
            sortBy: ''
        }, {
            header: "Title",
            data: "${data.title}",
            type: "string",
            width: "",
            sortBy: 'title'
        }, {
            header: "Sub Title",
            data: "${data.subTitle}",
            type: "number",
            width: "",
            sortBy: 'subTitle'
        }, {
            header: "Created On",
            data: "${ new Date(data.creationDate).toLocaleDateString()  }",
            type: "date",
            width: "",
            sortBy: 'creationDate'
        }
    ]
};