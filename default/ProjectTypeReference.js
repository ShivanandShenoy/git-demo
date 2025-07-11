cube(`ProjectType`, {
  sql_table: `public.project_types`,
  
  data_source: `default`,
  
  title: `Project Type`,
  description: `Project type reference data`,

  dimensions: {
    id: {
      sql: `id`,
      type: `number`,
      primary_key: true,
    },

    name: {
      sql: `name`,
      type: `string`,
      title: `Project Type Name`,
    },

    category: {
      sql: `
        CASE 
          WHEN ${CUBE}.name LIKE '%Solar%' THEN 'Solar'
          WHEN ${CUBE}.name LIKE '%Wind%' THEN 'Wind'
          WHEN ${CUBE}.name LIKE '%Storage%' OR ${CUBE}.name LIKE '%BESS%' THEN 'Storage'
          WHEN ${CUBE}.name LIKE '%Hybrid%' THEN 'Hybrid'
          ELSE 'Other'
        END
      `,
      type: `string`,
      title: `Type Category`,
    },
  },

  measures: {
    count: {
      type: `count`,
      title: `Number of Project Types`,
    },
  },
});