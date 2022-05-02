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
        "${data.title.substring(0,15)}" +
        "${data.title.length > 15 ? '...' : '' }",
      type: "string",
      width: "",
      sortBy: "title",
    },
    {
      header: "Subtitle",
      data:
        "${data.subTitle.substring(0,15)}" +
        "${data.subTitle.length > 15 ? '...' : '' }",
      type: "string",
      width: "",
      sortBy: "subTitle",
    },
    {
      header: "Date Of Creation",
      data: "${ new Date(data.creationDate).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})  }",
      type: "date",
      width: "",
      sortBy: "creationDate",
    },
  ],
};
