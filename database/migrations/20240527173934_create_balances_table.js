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
    .createTableIfNotExists('balances', (table) => {
      table.string('id', 26).index().primary();
      table.string('group_id');
      table.string('borrower_id');
      table.string('lender_id');
      table.integer('amount_in_cents');
      table.string('currency', 10).defaultTo('INR');
      timestamps(knex, table);
    })
    .raw(onUpdateTrigger('balances'));
  return migration;
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('balances');
};
