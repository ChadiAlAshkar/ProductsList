const searchTableConfig = {
  options: {
    showAnalyticsButton: true,
    showEditButton: true,
    showDeleteButton: true,
  },
  columns: [{
      header: "",
      data: "${data.profileImgUrl}",
      type: "Image",
      width: "",
      sortBy: "",
    },
    {
      header: "Title",
      data: "${data.title.substring(0,12)}" +
        "${data.title.length > 12 ? '...' : '' }",
      type: "string",
      width: "",
      sortBy: "title",
    },
    {
      header: "Subtitle",
      data: "${data.subTitle.substring(0,12)}" +
        "${data.subTitle.length > 12 ? '...' : '' }",
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