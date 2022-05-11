class Bookmark {
    static add(options, callback) {
        buildfire.bookmarks.add(options, (err, res)=> {
            if(err) return callback(err, null);
            callback(null, res);
        });
    }

    static delete(bookmarkId, callback) {
        buildfire.bookmarks.delete(bookmarkId, (err, res)=> {
            if(err) return callback(err, null);
            callback(null, res)
        }) 
    }
    
}