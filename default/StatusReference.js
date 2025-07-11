cube(`Status`, {
  sql_table: `public.statuses`,
  
  data_source: `default`,
  
  title: `Status`,
  description: `Project status reference data`,

  dimensions: {
    id: {
      sql: `id`,
      type: `number`,
      primary_key: true,
    },

    name: {
      sql: `name`,
      type: `string`,
      title: `Status Name`,
    },

    filter_flag: {
      sql: `filter_flag`,
      type: `boolean`,
      title: `Filter Flag`,
    },

    status_category: {
      sql: `
        CASE 
          WHEN ${CUBE}.name = 'In-Operation' THEN 'Operational'
          WHEN ${CUBE}.name IN ('Under Construction', 'Pre Construction') THEN 'Construction'
          WHEN ${CUBE}.name = 'Under Development' THEN 'Development'
          ELSE 'Other'
        END
      `,
      type: `string`,
      title: `Status Category`,
    },

    is_active: {
      sql: `
        CASE 
          WHEN ${CUBE}.name IN ('In-Operation', 'Under Construction', 'Pre Construction', 'Under Development') THEN 'Active'
          ELSE 'Inactive'
        END
      `,
      type: `string`,
      title: `Is Active Status`,
    },
  },

  measures: {
    count: {
      type: `count`,
      title: `Number of Statuses`,
    },

    active_count: {
      type: `count`,
      filters: [{ sql: `${CUBE}.filter_flag = true` }],
      title: `Active Statuses`,
    },
  },
});