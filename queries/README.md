# rsmsdb Module Instructions

## Database Connection
To connect to a MySQL database, make sure you create a `config.js` file inside the queries directory.
The file should contain the following code:

```
const database = {
    username: <yourUsername>,
    password: <yourPassword>,
    database: <yourDatabaseName>,
    host: "localhost",
    port: "3306"
};

module.exports = database;
```

## Database Creation
To create all the tables in the database, run the `rsms_create.sql` script
from a MySQL command-line, or in a mySQL database management tool. To add dummy entries into the
database, run the `rsms_insert.sql` script.