class Product {
    constructor() {
        this.title = "";
        this.subTitle = "";
        this.description = "";
        this.profileImgUrl = "";
        this.coverImgUrl = "";
        this.creationDate = new Date();
    }
}

const Products = {
    insert:(product,callback)=>{
        if(product.title == "" || product.profileImgUrl == "" || product.coverImgUrl == ""){
            callback(null,false);
            return;
        }
        buildfire.datastore.insert(product, "Products", callback);
        callback(null, true)
    } 
    ,search:(options,callback)=>{
        buildfire.datastore.search(options,"Products",callback)
    }
    ,getById:(productId, callback)=>{
        buildfire.datastore.getById(productId,"Products",callback)
        callback(null,true)

    }
    ,update:(product,callback)=>{
        buildfire.datastore.update(product,"Products",callback)
        callback(null,true)
    }
    ,delete:(productId,callback)=>{
        buildfire.datastore.delete(productId,"Products",callback)
        callback(null,true)
    }

}