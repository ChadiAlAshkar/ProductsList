const dummyData = {
    fetchDummyRecords: () => {

        let dummyImages = ["https://alnnibitpo.cloudimg.io/v7/https://s3-us-west-2.amazonaws.com/imageserver.prod/1649774124364-0019321411895620644/97d67930-bcc4-11ec-a150-391c0afe6247.jpeg?func=crop&width=358&height=202",
            "https://alnnibitpo.cloudimg.io/v7/https://s3-us-west-2.amazonaws.com/imageserver.prod/1649774124364-0019321411895620644/945ae700-bcc4-11ec-a150-391c0afe6247.jpg?func=crop&width=358&height=202",
            "https://alnnibitpo.cloudimg.io/v7/https://s3-us-west-2.amazonaws.com/imageserver.prod/1649774124364-0019321411895620644/9aae0330-bcc4-11ec-824c-21f57944d41f.jpeg?func=crop&width=358&height=202"
        ];

        let product1 = new Product();
        product1.title = "Item 1";
        product1.subTitle = "Subtitle 1";
        product1.description = "Description 1";
        product1.creationDate = new Date();
        product1.profileImgUrl = dummyImages[0];
        product1.coverImgUrl = dummyImages[0];

        let product2 = new Product();
        product2.title = "Item 2";
        product2.subTitle = "Subtitle 2";
        product2.description = "Description 2";
        product2.creationDate = new Date();
        product2.profileImgUrl = dummyImages[1];
        product2.coverImgUrl = dummyImages[1];

        let product3 = new Product();
        product3.title = "Item 3";
        product3.subTitle = "Subtitle 3";
        product3.description = "Description 3";
        product3.creationDate = new Date();
        product3.profileImgUrl = dummyImages[2];
        product3.coverImgUrl = dummyImages[2];

        let products = [];
        products.push(product1, product2, product3);
        return products;
    },
    insertDummyRecords() {

        return new Promise((resolve, reject) => {
            let recordCount = 3
            let tag = Helper.Collections.PRODUCTS;
            let results = this.fetchDummyRecords(recordCount);
            let records = [];
            results.forEach((row) => {
                let r = {
                    title: row.title,
                    subTitle: row.subTitle,
                    description: row.description,
                    creationDate: row.creationDate,
                    profileImgUrl: row.profileImgUrl,
                    coverImgUrl: row.coverImgUrl
                };
                records.push(r);
            });
            Products.bulkInsert(records)
                .then((result) => {
                    resolve(result)
                })
                .catch((err) => {
                    reject(err);
                });;
        });
    }
};