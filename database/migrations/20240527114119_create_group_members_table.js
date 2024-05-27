/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.up = async function (knex) {
  const migration = await knex.schema.createTableIfNotExists(
    'group_members',
    (table) => {
      table.string('group_id');
      table.string('user_id');
    },
  );
  return migration;
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('group_members');
};
