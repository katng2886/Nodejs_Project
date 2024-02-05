// //Funtion Add:
exports.add = function (db, qs, cb) {
  let sql = `
  DELIMITER $$
CREATE PROCEDURE add_sailor (IN qs.Sname VARCHAR(255), IN qs.B_date DATE, IN qs.Rate int, OUT msg VARCHAR(255)) 
BEGIN 
	DECLARE age INTEGER; 
	SET age = floor(datediff(curdate(), B_date)/365); 
	IF age >= 24 
	THEN INSERT INTO sailors (Sname, B_date, Rate) VALUES(qs.Sname, qs.B_date, qs.Rate); 
	SET msg = 'Sailors is added'; 
	ELSE SET msg = 'Sailor\'s age must be more than 24'; 
	END IF;
END $$
DELIMITER ;`;
  //sql = `call add_sailor(?,?,?, @msg); SELECT @msg;`
  db.query(sql, [qs.Sname, qs.B_date, qs.Rate], (err, results) => {
    db.query(
      `call add_sailor(?,?,?, @msg);`,
      [qs.Sname, qs.B_date, qs.Rate],
      (err, results) => {
        db.query(`SELECT @msg;`, (err, results) => {
          if (err) {
            throw err;
          }
          //console.log('This is results:'+ JSON.stringify(results));
          //console.log(Object.keys(results)); //['0']
          //console.log(Object.values(results)); //['msg']
          //console.log(JSON.stringify(results[0][`@msg`])); // "sailor's age must more than 24"
          cb(200, results[0][`@msg`]);
        });
      }
    );
  });
};

//Function Display:
exports.display = function (db, cb) {
  // Construct the SQL query
  let sql = `SELECT S_Id, Sname, DATE_FORMAT(B_Date, "%Y %M %D") as B_date, Rate FROM Sailors`;
  db.query(sql, function (err, results) {
    // Execute the SQL query
    if (err) {
      console.log("Error" + err);
      return;
    }
    console.log(results)
    cb(200, results); // Pass the results to the callback function
  });
};
exports.displayolderage = function (db, qs, cb){
  let sql = `call displayolderage(?)`; 
  db.query(sql, qs.age, function(err, results) {
    if (err){
    console.log('Err'+ err.message);
    return;
  }
    console.log(results); 
    cb(200, results[0]);
})}
exports.displayyoungerage = function (db, qs, cb){
  let sql = `call displayyoungerage(?)`; 
  db.query(sql, qs.age, function(err, results) {
    if (err){
    console.log('Err'+ err.message);
    return;
  }
    console.log(results); 
    cb(200, results[0]);
})}



//Funtion Delete
exports.delete = function (db, qs, cb) {
  id = qs.S_Id;
  let column = "S_Id";
  let sql = `DELETE FROM Sailors WHERE ${column} = ? `; //DELETE FROM TABLE WHERE S_Id = qs.S_Id; => Syntax: http://localhost:3000/sailors?S_Id=x
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
  sql = `SELECT * FROM Sailors WHERE S_Id = \'${qs.S_Id}'`;
  db.query(sql, (err, result) => {
    if (err) {
      cb(err.message);
    } else if (result && result.lenght === 0) {
      cb("Record Not found");
    } else {
      //If the row exists,
      let keys = Object.keys(qs);
      const name = keys.includes("Sname") ? qs.Sname : result[0].Sname;
      const Bdate = keys.includes("B_date") ? qs.B_date : result[0].B_date;
      const newRate = keys.includes("Rate") ? qs.Rate : result[0].Rate;
      sql = "UPDATE Sailors SET Sname = ?, B_date = ?, Rate = ? WHERE S_Id = ?";
      db.query(sql, [name, Bdate, newRate, qs.S_Id], (err, result) => {
        if (err) {
          cb(err.message);
        } else if (result.affectedRows === 0) {
          //Check if there is an update, if not, call record not found.
          cb("Record not found!");
        } else {
          console.log("Sailors update");
          cb("Update is success");
        }
      });
    }
  });
};
