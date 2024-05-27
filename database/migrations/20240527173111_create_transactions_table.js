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
    .createTableIfNotExists('transactions', (table) => {
      table.string('id', 26).index().primary();
      table.string('name');
      table.string('description');
      table.string('group_id');
      table.integer('amount_in_cents');
      table.string('currency', 10).defaultTo('INR');
      table.timestamp('paid_at');
      table.string('user_id');
      table.integer('type');
      timestamps(knex, table);
    })
    .raw(onUpdateTrigger('transactions'));
  return migration;
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('transactions');
};
