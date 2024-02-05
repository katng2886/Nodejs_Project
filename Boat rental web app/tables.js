//Activity 3

//import the mysql2 module
const mysql2 = require("mysql2");
//const operation = require("./lib/operation.js");
const http = require("http");
const path = require("path");
const { URL } = require("url"); // WHATWG API
const sailors = require("./lib/sailors.js");
const boats = require("./lib/boats.js");
const reserves = require("./lib/reserves.js");
const { resourceLimits } = require("worker_threads");

//initialize the connection object
let db = mysql2.createConnection({
  host: "localhost",
  user: "root",
  password: "Katieng06%",
  database: "sailingadventure",
});

//Check the status of the connection
db.connect((err) => {
  if (err) throw err;
  console.log("Connected");
});

//Creat database "StudTracking"
sql = "CREATE DATABASE IF NOT EXISTS SailingAdventure";
db.query(sql, (err) => {
  if (err) throw err;
  console.log("Database created...");
});

//Create table Student
sql = `CREATE TABLE IF NOT EXISTS Sailors 
  (S_Id int AUTO_INCREMENT PRIMARY KEY , 
    Sname VARCHAR(100), 
    B_date DATE, RATE int(1))`;
db.query(sql, (err) => {
  if (err) throw err;
  console.log("Sailors table created");
});

//Create table Course
sql = `CREATE TABLE IF NOT EXISTS Boats 
  (B_Id int NOT NULL AUTO_INCREMENT primary key, 
    B_name VARCHAR(500), 
    Type VARCHAR(500))`;
db.query(sql, (err) => {
  if (err) throw err;
  console.log("Boats table created");
});

//Create table StudentCourse
sql = `CREATE TABLE IF NOT EXISTS Reserves( 
    S_Id int, 
    B_Id int, 
    Day Date,
    PRIMARY KEY (S_Id, B_Id, Day), 
    foreign key (S_Id) references Sailors(S_Id)
    ON DELETE CASCADE,
    foreign key (B_Id) references Boats(B_Id)
    ON DELETE CASCADE )`;
db.query(sql, (err) => {
  if (err) throw err;
  console.log("Reserves table created");
});

const serverHandler = (req, res) => {
  //Get the URL, routing the path, and route the method
  let baseURL = "http://" + req.headers.host + "/";
  let parsedUrl = new URL(req.url, baseURL); //parseURL as an object

  //Trim the URL - remove all the /
  const path = parsedUrl.pathname;
  console.log("This is path" + path);
  const trimmedPath = path.replace(/^\/+|\/+$/g, "");
  console.log(`Trimmed path: ${trimmedPath}`);

  //Get the query string as an object - Extract the query string as an JS object
  const urlquery = parsedUrl.searchParams;
  let entries = urlquery.entries();
  const qs = Object.fromEntries(entries); //qs = querry string
  console.log(qs);
  console.log(Object.values(qs)); //

  //GET the http method
  const med = req.method.toUpperCase();

  switch (med) {
    case "GET": //Succeeded
      switch (path) {
        case "/sailors":
          //if (trimmedPath === 'sailors'){
          sailors.display(db, (statusCode, results) => {
            res.setHeader("content-type", 'text/plain ; charset= "utf-8"');
            res.writeHead(statusCode);
            res.end(JSON.stringify(results));
          });
          break;
        case "/sailors/older":
          sailors.displayolderage(db, qs, (statusCode, results) => {
            res.setHeader("content-type", 'text/plain ; charset= "utf-8"');
            res.writeHead(statusCode);
            res.end(JSON.stringify(results));
          });
          break;
        case "/sailors/younger":
          sailors.displayyoungerage(db, qs, (statusCode, results) => {
            res.setHeader("content-type", 'text/plain ; charset= "utf-8"');
            res.writeHead(statusCode);
            res.end(JSON.stringify(results));
          });
          break;

        case "/boats":
          boats.display(db, (results) => {
            res.setHeader("content-type", 'text/plain; charset= "utf-8"');
            res.writeHead(200);
            res.end(JSON.stringify(results));
            console.log("Display");
            console.log("The results are\n");
            console.log(results);
          });
          break;
        case "/boats/type":
          boats.displayboatname(db, qs, (statusCode, results) => {
            res.setHeader("content-type", 'text/plain; charset= "utf-8"');
            res.writeHead(statusCode);
            res.end(JSON.stringify(results));
            console.log(results);
          });
          break;
        case "/boats/count":
          boats.displayboatcount(db, qs, (statusCode, results) => {
            res.setHeader("content-type", 'text/plain; charset= "utf-8"');
            res.writeHead(statusCode);
            res.end(JSON.stringify(results));
            console.log(results);
          });
          break;
        case "/reserves":
          reserves.display(db, (results) => {
            res.setHeader("content-type", 'text/plain; charset= "utf-8"');
            res.writeHead(200);
            res.end(JSON.stringify(results));
            console.log("Display");
            console.log("The results are\n");
            console.log(results);
          });
          break;

        case "/reserves/before":
          reserves.displaybeforedate(db, qs, (statusCode, results) => {
            res.setHeader("content-type", 'text/plain; charset= "utf-8"');
            res.writeHead(statusCode);
            res.end(JSON.stringify(results));
            console.log(results);
          });
          break;
        case "/reserves/after":
          reserves.displayafterdate(db, qs, (statusCode, results) => {
            res.setHeader("content-type", 'text/plain; charset= "utf-8"');
            res.writeHead(statusCode);
            res.end(JSON.stringify(results));
            console.log(results);
          });
          break;
        // } else {
        //   res.setHeader("Content-Type", 'text/plain; charset= "utf-8"');
        //   res.writeHead(400);
        //   res.end("BAD REQUEST GET");
        // }
        // break;
      }
      break;
    case "POST":
      if (trimmedPath === `sailors`) {
        //console.log('POST SAILORS');
        sailors.add(db, qs, (statusCode, results) => {
          res.setHeader("content-type", 'text/plain; charset= "utf-8"');
          res.writeHead(statusCode);
          res.end(JSON.stringify(results));
        });
      } else if (trimmedPath === `boats`) {
        //Suceeded
        console.log("POST BOATS");
        boats.add(db, qs, (result) => {
          console.log(result);
          res.setHeader("content-type", 'text/plain; charset= "utf-8"');
          res.writeHead(200);
          res.end("OK");
        });
      } else if (trimmedPath === `reserves`) {
        //Suceeded
        //console.log('POST RESERVES');
        reserves.add(db, qs, (statusCode, results) => {
          console.log(results);
          res.setHeader("content-type", 'text/plain; charset= "utf-8"');
          res.writeHead(statusCode);
          res.end(JSON.stringify(results));
        });
      } else {
        res.setHeader("content-type", 'text/plain; charset="utf-8"');
        res.writeHeader(400);
        res.end("BAD REQUEST");
      }
      break;

    case "DELETE":
      if (trimmedPath === `sailors`) {
        //Suceeded.
        console.log("SAILORS DELETE");
        sailors.delete(db, qs, (result) => {
          console.log(result);
          res.setHeader("content-type", 'text/plain; charset= "utf-8"');
          res.writeHead(200);
          res.end("OK");
        });
      } else if (trimmedPath === `boats`) {
        //Suceeded.
        console.log("BOATS DELETE");
        boats.delete(db, qs, (result) => {
          console.log(result);
          res.setHeader("content-type", 'text/plain; charset= "utf-8"');
          res.writeHead(200);
          res.end("OK");
        });
      } else if (trimmedPath === `reserves`) {
        //Suceeded.
        console.log("RESERVES DELETE");
        reserves.delete(db, qs, (err, result) => {
          console.log(result);
          res.setHeader("content-type", 'text/plain; charset= "utf-8"');
          res.writeHead(200);
          res.end("OK");
        });
      } else {
        res.setHeader("content-type", 'text/plain; charset="utf-8"');
        res.writeHeader(400);
        res.end("BAD REQUEST DELETE");
      }
      break;

    case "PUT":
      if (trimmedPath === `sailors`) {
        console.log("SAILORS PUT");
        sailors.update(db, qs, (err, result) => {
          if (!err) {
            res.setHeader("content-type", 'text/plain; charset= "utf-8"');
            res.writeHead(200);
            res.end("Update is success");
            return;
          } else {
            res.end(JSON.stringify(err));
          }
        });
      } else if (trimmedPath === `boats`) {
        console.log("BOATS PUT");
        boats.update(db, qs, (err, result) => {
          if (!err) {
            res.setHeader("content-type", 'text/plain; charset= "utf-8"');
            res.writeHead(200);
            res.end("Update is success");
            return;
          } else {
            res.end(JSON.stringify(err));
          }
        });
      } else if (trimmedPath === `reserves`) {
        res.setHeader("content-type", 'text/plain; charset= "utf-8"');
        res.writeHead(400);
        res.end("CANNOT UPDATE RESERVES TABLE"); //Cases where user tries to update reserves table
      } else {
        res.setHeader("content-type", 'text/plain; charset="utf-8"');
        res.writeHeader(400);
        res.end("BAD REQUEST");
      }
      break;
  }
};

//Create server
const server = http.createServer(serverHandler);
server.listen(3000, () => {
  console.log("The server is listen to port 3000 ... ");
});

//Close the connection
//Using event emitter to make sure that all the querries are done before closing connection. When the user hit ctrl+C => Close the connection.
process.on("SIGINT", function () {
  db.end(function (err) {
    if (err) {
      return console.log("error: " + err.message);
    }
    console.log("Closing the database connection ...");
  });
});
