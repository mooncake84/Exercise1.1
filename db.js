//const { Pool } = require("pg");
import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
  connectionString:
    "postgresql://root:HNKZ47GTPikqqYL3fzc4cMdszPBOhmfA@dpg-d0vknoggjchc7388rf4g-a.oregon-postgres.render.com/database_iot_55ln",
  ssl: {
    rejectUnauthorized: false,
  },
});
export default pool;
/*
async function testConecction() {
  try {
    const client = await pool.connect();
    console.log("Conexion exitosa");
    client.release();
    await pool.end();
  } catch (err) {
    console.err("Error al conectar ", err);
  }
}

testConecction();
*/
