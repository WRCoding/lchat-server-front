const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const db = db || {};

db.sqliteDB = function (file){
    db.database = new sqlite3.Database(file)
    
    db.exist = fs.existsSync(file)
    if (!db.exist){
        console.log("create db file")
        fs.openSync(file, 'w')
    }
    console.log('open db file success')
};

db.printErrorInfo = function (err){
    console.log("Error message: " + err)
}

db.sqliteDB.prototype.createTable =  (sql,callback) => {
    db.database.serialize(() => {
        db.database.run(sql,(err,rows) => {
            if (null != err){
                db.printErrorInfo(err)
                return;
            }
            if (callback){
                callback(rows)
            }
        })
    })
}

db.sqliteDB.prototype.insertData = (sql, object) => {
    db.database.serialize(() => {
        const stmt = db.database.prepare(sql);
        for (let i = 0; i<object.length; ++i){
            stmt.run(object[i])
        }
        stmt.finalize()
    })
}

db.sqliteDB.prototype.queryData = (sql, callback) => {
    db.database.all(sql, (err, rows) => {
        if (null != err){
            db.printErrorInfo(err)
            return
        }
        if (callback){
            callback(rows)
        }
    })
}

db.sqliteDB.prototype.executeSql = (sql) => {
    db.database.run(sql, (err) => {
        if (null != err){
            db.printErrorInfo(err)
        }
    })
}

db.sqliteDB.prototype.close = () => {
    db.database.close()
}

exports.sqliteDB = db.sqliteDB
