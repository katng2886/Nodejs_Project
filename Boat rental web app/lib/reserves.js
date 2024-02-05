//Function Display:
exports.display = function (db, cb) {
    // Construct the SQL query
    let sql = `SELECT r.S_Id, s.Sname, r.B_Id, b.B_name, DATE_FORMAT(r.Day, "%Y %M %D") as Day 
    FROM sailors as s, boats as b, reserves as r 
    WHERE r.S_Id = s.S_Id and r.B_Id = b.B_Id;`;
    db.query(sql, function (err, result) {
      // Execute the SQL query
      if (err) throw err;
      cb(200, result); // Pass the results to the callback function
    });
  };


exports.displaybeforedate = function (db, qs, cb){
  // let sql =  `
  // DELIMITER $$
  // DROP PROCEDURE IF EXISTS displaybefore$$
  // CREATE PROCEDURE displaybefore (IN qs.B_Id int, IN qs.Day DATE)
  //   BEGIN 
  //     SELECT r.B_Id, b.B_name, DATE_FORMAT(r.Day, "%Y %M %D") AS Day FROM reserves as r, boats as b where r.B_Id = b.B_Id and r.Day < qs.Day;
  //    END$$
  // DELIMITER ;`
  let sql = `call displaybefore(?,?);`
  db.query(sql, [qs.B_Id, qs.Day], (err, results)=>{
    if (err) throw err; 
    console.log(results);
    cb(200, results[0]);
})
};


exports.displayafterdate = function (db, qs, cb){
  /*DELIMITER $$
DROP PROCEDURE IF EXISTS displayafter$$
CREATE PROCEDURE displayafter (IN B_Id int, IN Day DATE)
BEGIN 
	SELECT r.B_Id, b.B_name, DATE_FORMAT(r.Day, "%Y %M %D") AS Day FROM reserves as r JOIN boats as b ON r.B_Id = b.B_Id WHERE r.Day > Day;
END$$
DELIMITER ;

 */
let sql = `call displayafter(?,?)`;
db.query(sql, [qs.B_Id, qs.Day], (err, results)=>{
  if (err) throw err; 
  console.log(results); 
  cb(200, results[0]);
})
}


//Function ADD: 
exports.add = function (db, qs, cb) {
  let sql = `call Ratechecking(?,?,?, @msg)`
  db.query(sql, [qs.S_Id, qs.B_Id, qs.Day], (err) =>{
    if (err) throw (err);
      db.query(`SELECT @msg;`, (err, results) => {
        if (err){throw err};
        cb(200,results[0][`@msg`]);
    });
    });
  };

//Function DELETE

exports.delete = function (db, qs, cb) {
  let id = [qs.S_Id, qs.B_Id, qs.Day];
  let column1 = "S_Id";
  let column2 = "B_Id";
  let column3 = "Day";
  let sql = `DELETE FROM reserves WHERE ${column1} = ? and ${column2} = ? and ${column3}= ?`;
  db.query(sql, id, (err, result) => {
    if (err) throw err;
    console.log("Deleted rows: " + result.affectedRows);
    cb(result);
  });
};

