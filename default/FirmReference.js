cube(`Firm`, {
  sql_table: `public.firms`,
  
  data_source: `default`,
  
  title: `Firms`,
  description: `Companies including developers, EPCs, suppliers, and other organizations`,

  dimensions: {
    id: {
      sql: `id`,
      type: `number`,
      primary_key: true,
    },

    name: {
      sql: `name`,
      type: `string`,
      title: `Firm Name`,
    },

    short_name: {
      sql: `short_name`,
      type: `string`,
      title: `Short Name`,
    },

    is_developer: {
      sql: `is_developer`,
      type: `boolean`,
      title: `Is Developer`,
    },

    firm_type: {
      sql: `
        CASE 
          WHEN ${CUBE}.is_developer = true THEN 'Developer'
          WHEN ${CUBE}.name LIKE '%EPC%' OR ${CUBE}.name LIKE '%Engineering%' THEN 'EPC'
          WHEN ${CUBE}.name LIKE '%Module%' OR ${CUBE}.name LIKE '%Solar%' THEN 'Module Supplier'
          WHEN ${CUBE}.name LIKE '%Inverter%' THEN 'Inverter Supplier'
          ELSE 'Other'
        END
      `,
      type: `string`,
      title: `Firm Type`,
    },
  },

  measures: {
    count: {
      type: `count`,
      title: `Number of Firms`,
    },

    developer_count: {
      type: `count`,
      filters: [{ sql: `${CUBE}.is_developer = true` }],
      title: `Number of Developers`,
    },
  },
});