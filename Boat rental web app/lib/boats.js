
// //Funtion Add: 
exports.add = function (db, qs, cb) {
    let sql = `INSERT INTO Boats`;
    sql += `(B_name, Type ) 
    VALUES (?,?)`;
    let values = [qs.B_name, qs.Type];
    db.query(sql, values, function (err, result) {
    if (err) throw err;
    cb(result);
  });
  };
  
//Function Display:
exports.display = function (db, cb) {
  // Construct the SQL query
  let sql = `SELECT * FROM Boats`;
  db.query(sql, function (err, results) {
    // Execute the SQL query
    if (err) {
      console.log("Error" + err);
      return;
    }
    cb(results); // Pass the results to the callback function
  });
};

exports.displayboatname = function (db, qs, cb){
  let sql = `call boatname(?)`;
  db.query(sql, qs.Type, function (err, results) {
    if (err) {
      console.log("Error" + err);
      return;
    }
    cb(200, results[0]); // Pass the results to the callback function
  });

}
exports.displayboatcount = function (db, qs, cb){
  let sql = `call boatcount(?)`;
  db.query(sql, qs.Type, function(err, results){
    if (err) throw err; 
    cb(200, results[0]);
  })
}

//Funtion Delete
exports.delete = function (db, qs, cb) {
  let id = qs.B_Id;
  column = "B_Id";
  let sql = `DELETE FROM Boats WHERE ${column} = ?`;
  db.query(sql, id, (err, result) => {
    if (err) throw err;
    console.log("Deleted rows: " + result.affectedRows);
    cb(result);
  });
};

//Function Update:
exports.update = function (db, qs, cb) {
  let sql = "";
  //Check for the table
  sql = `SELECT * FROM Boats WHERE B_Id = \'${qs.B_Id})'`;
  db.query(sql, (err, result) => {
    if (err) {
      cb(err.message);
    } else if (result && result.lenght === 0) {
      cb("Not found");
    }else {
      //If the row exists,
      let keys = Object.keys(qs);
      const Bname = keys.includes("B_name") ? qs.B_name : result[0].B_name;
      const Btype = keys.includes("Type") ? qs.Type : result[0].Type;
      sql =
        "UPDATE Boats SET B_name = ?, Type = ? WHERE B_Id = ?";
      db.query(sql, [Bname, Btype, qs.B_Id], (err, result) => {
        if (err){
          cb(err.message);
        }else if (result.affectedRows === 0){   //If affectedRows: 1 => Rows exists for updating. else: cant update.
          cb('Record not found!')
        }else{
        console.log("Boats update");
        cb('Update is success');
      }});
    }
  });
};
