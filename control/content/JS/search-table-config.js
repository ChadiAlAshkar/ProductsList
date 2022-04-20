const searchTableConfig = {
  options: {
    showEditButton: true,
    showDeleteButton: true,
  },
  columns: [
    {
      header: "",
      data: "${data.profileImgUrl}",
      type: "Image",
      width: "",
      sortBy: "",
    },
    {
      header: "Title",
      data:
        "${data.title.substring(0,20)}" +
        "${data.title.length > 20 ? '...' : '' }",
      type: "string",
      width: "",
      sortBy: "title",
    },
    {
      header: "Sub Title",
      data:
        "${data.subTitle.substring(0,20)}" +
        "${data.subTitle.length > 20 ? '...' : '' }",
      type: "string",
      width: "",
      sortBy: "subTitle",
    },
    {
      header: "Created On",
      data: "${ new Date(data.creationDate).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})  }",
      type: "date",
      width: "",
      sortBy: "creationDate",
    },
  ],
};
