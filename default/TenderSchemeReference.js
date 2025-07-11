cube(`TenderScheme`, {
  sql_table: `public.tender_schemes`,
  
  data_source: `default`,
  
  title: `Tender Schemes`,
  description: `Government tender schemes`,

  dimensions: {
    id: {
      sql: `id`,
      type: `number`,
      primary_key: true,
    },

    name: {
      sql: `name`,
      type: `string`,
      title: `Scheme Name`,
    },

    scheme_type: {
      sql: `
        CASE 
          WHEN ${CUBE}.name LIKE '%SECI%' THEN 'SECI'
          WHEN ${CUBE}.name LIKE '%NTPC%' THEN 'NTPC'
          WHEN ${CUBE}.name LIKE '%State%' THEN 'State'
          WHEN ${CUBE}.name LIKE '%Central%' THEN 'Central'
          ELSE 'Other'
        END
      `,
      type: `string`,
      title: `Scheme Type`,
    },
  },

  measures: {
    count: {
      type: `count`,
      title: `Number of Schemes`,
    },
  },
});