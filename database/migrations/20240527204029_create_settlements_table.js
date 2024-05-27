/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const {
  timestamps,
  ON_UPDATE_TIMESTAMP_FUNCTION,
  onUpdateTrigger,
} = require('../helpers');

exports.up = async function (knex) {
  await knex.raw(ON_UPDATE_TIMESTAMP_FUNCTION);
  const migration = await knex.schema
    .createTableIfNotExists('settlements', (table) => {
      table.string('id', 26).index().primary();
      table.string('transaction_id');
      table.string('payee_id');
      table.string('payer_id');
      table.integer('payment_mode');
      timestamps(knex, table);
    })
    .raw(onUpdateTrigger('settlements'));
  return migration;
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('settlements');
};
