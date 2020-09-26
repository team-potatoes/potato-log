


const { Pool } = require('pg');

const pool = new Pool({
  connectionString: "postgres://potato:tp25082020@potatoes.c5zxom8w0uqj.us-east-1.rds.amazonaws.com:5432/estornos"
});

const db = pool.on('connect', () => {
  // console.error(err);
});

async function main() {
  const { rows } = await db.query(
    `INSERT INTO ${tabela} (TRANSACTION_ID, ORDER_ID, LOGISTIC_ID, PRICE) VALUES ($1, $2, $3, $4)`,
    [transaction_id, order_id, logistic_id, price]);
    await db.query("commit;");

    
}

main()
