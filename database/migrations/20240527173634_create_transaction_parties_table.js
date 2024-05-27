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
    .createTableIfNotExists('transaction_parties', (table) => {
      table.string('id', 26).index().primary();
      table.string('transaction_id');
      table.string('user_id');
      table.integer('type');
      table.integer('amount_in_cents');
      table.string('currency', 10).defaultTo('INR');
      timestamps(knex, table);
    })
    .raw(onUpdateTrigger('transaction_parties'));
  return migration;
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('transaction_parties');
};
