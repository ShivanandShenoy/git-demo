cube(`Offtaker`, {
  sql_table: `public.offtakers`,
  
  data_source: `default`,
  
  title: `Offtakers`,
  description: `Power purchase entities`,

  dimensions: {
    id: {
      sql: `id`,
      type: `number`,
      primary_key: true,
    },

    name: {
      sql: `name`,
      type: `string`,
      title: `Offtaker Name`,
    },

    short_name: {
      sql: `short_name`,
      type: `string`,
      title: `Short Name`,
    },

    offtaker_type_id: {
      sql: `offtaker_type_id`,
      type: `number`,
      title: `Offtaker Type ID`,
    },
  },

  measures: {
    count: {
      type: `count`,
      title: `Number of Offtakers`,
    },
  },
});