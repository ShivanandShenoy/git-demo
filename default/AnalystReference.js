cube(`Analyst`, {
  sql_table: `public.analysts`,
  
  data_source: `default`,
  
  title: `Analysts`,
  description: `Data analysts and approvers`,

  dimensions: {
    id: {
      sql: `id`,
      type: `number`,
      primary_key: true,
    },

    name: {
      sql: `name`,
      type: `string`,
      title: `Analyst Name`,
    },
  },

  measures: {
    count: {
      type: `count`,
      title: `Number of Analysts`,
    },
  },
});