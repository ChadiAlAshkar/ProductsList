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
            callback(null, res);
<<<<<<< HEAD
        }) ;
=======
        });
>>>>>>> f5a93bdb13436b15a984ac4e6ee1d1626722eb3d
    }
    
}