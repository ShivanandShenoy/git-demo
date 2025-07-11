cube(`Utility`, {
  sql_table: `public.utilities`,
  
  data_source: `default`,
  
  title: `Utilities`,
  description: `Power distribution companies`,

  dimensions: {
    id: {
      sql: `id`,
      type: `number`,
      primary_key: true,
    },

    name: {
      sql: `name`,
      type: `string`,
      title: `Utility Name`,
    },

    short_name: {
      sql: `short_name`,
      type: `string`,
      title: `Short Name`,
    },

    state_id: {
      sql: `state_id`,
      type: `number`,
      title: `State ID`,
    },

    utility_type_id: {
      sql: `utility_type_id`,
      type: `number`,
      title: `Utility Type ID`,
    },
  },

  measures: {
    count: {
      type: `count`,
      title: `Number of Utilities`,
    },
  },
});