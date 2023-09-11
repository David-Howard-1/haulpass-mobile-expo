import * as SQLite from 'expo-sqlite';

// open database
const db = SQLite.openDatabase('local.db');

/**
 * creates initial tables needed for application
 */
export const createInitialTables = () => {
  console.log('Creating SQLite tables...');
  db.transaction(
    (tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS ' +
          'preferences ' +
          '(id INTEGER PRIMARY KEY AUTOINCREMENT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP, last_sync_timestamp TEXT);'
      );
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS ' +
          'readings ' +
          '(id INTEGER PRIMARY KEY AUTOINCREMENT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP, timestamp TEXT, latitude REAL, longitude REAL);'
      );
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS ' +
          'logs ' +
          '(id INTEGER PRIMARY KEY AUTOINCREMENT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP, json_data TEXT);'
      );
    },
    (err) => {
      // error
      console.error('SQLite error:', err);
    },
    () => {
      // success
      console.log('Created SQLite tables successfully!');
      populatePreferences();
    }
  );
};

const populatePreferences = () => {
  console.log('Creating initial record in preferences table...');
  db.transaction(
    (tx) => {
      tx.executeSql(
        'INSERT INTO preferences (last_sync_timestamp) ' +
          "SELECT ''" +
          'WHERE NOT EXISTS (SELECT 1 FROM preferences);'
      );
    },
    (err) => {
      // error
      console.error('SQLite error:', err);
    },
    () => {
      // success
      console.log('Created preferences records successfully!');
    }
  );
};

/**
 * inserts a Location record into the local database
 * @param latitude {number} - the latitude portion of the Location reading
 * @param longitude {number} - the longitude portion of the Location reading
 * @param timestamp {number} - the timestamp portion of the Location reading
 */
export const insertLocation = async (latitude, longitude, timestamp) => {
  console.log('Saving Location reading to readings table...');
  const date = new Date(timestamp).toISOString();

  try {
    await db.transactionAsync(async (tx) => {
      // insert into table
      await tx.executeSqlAsync(
        'INSERT INTO readings (timestamp, latitude, longitude) ' +
          `VALUES ('${date}', ${latitude}, ${longitude});`
      );
      //   select from table
      const record = await tx.executeSqlAsync(
        'SELECT * FROM readings ' +
          `WHERE timestamp = '${date}' ` +
          `AND latitude = '${latitude}' ` +
          `AND longitude = '${longitude}';`
      );
      console.log(record);
      return record;
    });
  } catch (error) {
    console.error('Error saving Location reading:', error);
  }
};

/**
 * selects all readings from database
 */
export const selectAllReadings = async () => {
  let readingsArray = [];
  await db.transactionAsync(async (tx) => {
    const readings = await tx.executeSqlAsync('SELECT * FROM readings;');
    readingsArray = readings.rows;
    console.log(readings);
  });
  return readingsArray;
};

/**
 * @param id {string} - the id of the reading
 */
export const deleteReadingById = async (id) => {};
