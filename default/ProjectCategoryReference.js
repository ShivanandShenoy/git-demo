cube(`ProjectCategory`, {
  sql_table: `public.project_categories`,
  
  data_source: `default`,
  
  title: `Project Category`,
  description: `Project category reference data`,

  dimensions: {
    id: {
      sql: `id`,
      type: `number`,
      primary_key: true,
    },

    name: {
      sql: `name`,
      type: `string`,
      title: `Category Name`,
    },

    policy_level: {
      sql: `
        CASE 
          WHEN ${CUBE}.name LIKE '%Central%' THEN 'Central'
          WHEN ${CUBE}.name LIKE '%State%' THEN 'State'
          WHEN ${CUBE}.name LIKE '%Private%' OR ${CUBE}.name LIKE '%Corporate%' THEN 'Private'
          ELSE 'Other'
        END
      `,
      type: `string`,
      title: `Policy Level`,
    },
  },

  measures: {
    count: {
      type: `count`,
      title: `Number of Categories`,
    },
  },
});