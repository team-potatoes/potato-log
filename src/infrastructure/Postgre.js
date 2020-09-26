const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const db = pool.on('connect', () => {
  // console.error(err);
});


class Postgres {
  constructor() {
    this.criaBanco();
  }

  async criaBanco() {
    const dml = `
      CREATE TABLE IF NOT EXISTS PENDENTES (
        TRANSACTION_ID varchar(255) PRIMARY KEY,
        ORDER_ID varchar(255),
        LOGISTIC_ID UUID NOT NULL,
        PRICE INTEGER,
        NUMERO_COLETA VARCHAR(255)
      );

      CREATE TABLE IF NOT EXISTS REALIZADOS (
        TRANSACTION_ID varchar(255),
        ORDER_ID varchar(255),
        LOGISTIC_ID UUID,
        PRICE INTEGER,
        NUMERO_COLETA VARCHAR(255)
      );`;

      await db.query(dml);
  }

  insere(transaction_id, order_id, logistic_id, price, numero_coleta) {
    return this.insereTabela(transaction_id, order_id, logistic_id, price, numero_coleta, 'PENDENTES');
  }

  insereTabelaRealizados(transaction_id, order_id, logistic_id, price, numero_coleta) {
    return this.insereTabela(transaction_id, order_id, logistic_id, price, numero_coleta, 'REALIZADOS');
  }

  async insereTabela(transaction_id, order_id, logistic_id, price, numero_coleta, tabela) {
    const { rows } = await db.query(
      `INSERT INTO ${tabela} (TRANSACTION_ID, ORDER_ID, LOGISTIC_ID, PRICE, NUMERO_COLETA) VALUES ($1, $2, $3, $4, $5)`,
      [transaction_id, order_id, logistic_id, price, numero_coleta]);
      await db.query("commit;");
    return rows;
  }

  async leTodos() {
    const { rows } = await db.query("SELECT TRANSACTION_ID, ORDER_ID, LOGISTIC_ID, PRICE FROM PENDENTES");
    return rows;
  }

  async procuraPorTransactionId(transaction_id) {
    return procuraPorTransactionIdGeneric(transaction_id, 'PENDENTES');
  }

  async procuraPorTransactionIdRealizados(transaction_id) {
    return procuraPorTransactionIdGeneric(transaction_id, 'REALIZADOS');
  }

  async procuraPorTransactionIdGeneric(transaction_id, tabela) {
    const { rows } = await db.query(`SELECT TRANSACTION_ID, NUMERO_COLETA FROM ${tabela} WHERE TRANSACTION_ID = $1`, [transaction_id]);
    return rows;
  }

  async deleta(transaction_id) {
    const { rows } = await db.query("DELETE FROM PENDENTES WHERE TRANSACTION_ID = $1", [transaction_id])
    await db.query("commit;");
    return rows
  }
}

module.exports = new Postgres();