function connectDB(callback) {
    mongoClient.connect(dbConfig.url, function(err, db) {
        assert.equal(null, err);
        reader_test_db = db;
        console.log("COnnection attempt succeeded");
        callback(0);
    });
}

function drop_user_collection(callback) {
    var user_collection = reader_test_db.collection(dbConfig.userCollection);
    if (undefined != user_collection) {
        user_collection.drop(function(err, reply) {
            assert.equal(null, err);
            console.log(dbConfig.userCollection+"Successfully dropped");
            callback(0);
        });
    } else {
        callback(0);
    }
}

function dropUserFeedEntrycollection(callback) {
    var user_feed_entry_collection = reader_test_db.collection(dbConfig.userFeedEntryCollection);
    if (undefined != user_feed_entry_collection) {
        user_feed_entry_collection.drop(function(err, reply) {
            assert.equal(null, err);
            console.log(dbConfig.userFeedEntryCollection+"Successfully dropped");
            callback(0);
        });
    } else {
        callback(0);
    }
}

function getApplication(callback) {
    console.log("getApplication");
    client.getApplications({
        name: SP_APP_NAME
    }, function(err, applications) {
        console.log(applications);
        if (err) {
            log("Error")
        }
        app = applications.items[0];
        callback(0);
    });
}

function deleteTestAccounts(callback) {
    app.getAccounts({ email : TU_EMAIL_REGEX }, function(err, accounts) {
        if (err) throw err;
        accounts.items.forEach(function deleteAccount(account) {
            account.delete(function deleteError(err) {
                if (err) throw err;
            });
        });
        callback(0);
    });
}

function closeDB(callback) {
    reader_test_db.close();
}

async.series([connectDB, dropUserCollection, dropUserFeedEntryCollection, dropUserFeedEntryCollection, getApplication, deleteTestAccounts, closeDB]);