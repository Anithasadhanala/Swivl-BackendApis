const mysql = require('mysql');



class Database {

  // constructor for creating the connection btw mysql DB and return it to "pool" instance variable
  constructor(configData) {
    this.pool = mysql.createPool(configData);
  }
  

  // method for executing the query on the DB
  myQuery(sqlQuery, args, returnCallback) {

    this.pool.getConnection((err, connEstablished) => {
      // could not get connection
      if (err) return returnCallback(err);
      // if connection is successful, make a query
      connEstablished.query(sqlQuery, args, (err, response) => {
        connEstablished.release();
        if (err) return returnCallback(err);
        returnCallback(null, response);
      });
    });
  }

  
  // method to close the DB connection
  close() {
    this.pool.end(err => {
      if (err) console.error('Error closing the DB connection:', err);
      else console.log('DB connection closed successfully.');
    });
  }
}

module.exports = Database;

