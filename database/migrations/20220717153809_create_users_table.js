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
    .createTableIfNotExists('users', (table) => {
      table.string('id', 26).index().primary();
      table.string('email').index();
      table.string('firstName');
      table.string('lastName');
      table.varchar('phoneNumber');
      table.varchar('countryCode');
      table.varchar('password');
      table.integer('status');
      timestamps(knex, table);
    })
    .raw(onUpdateTrigger('users'));
  return migration;
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('users');
};
