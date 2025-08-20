//const { Pool } = require("pg");
import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
  connectionString:
    "postgresql://exercise111_user:sLh9MRUx38dvKX1x29P2ewD1w8SXfjjO@dpg-d2j3ceodl3ps738mjbp0-a.oregon-postgres.render.com/exercise111",
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
