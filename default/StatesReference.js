cube(`States`, {
  sql_table: `public.states`,
  
  data_source: `default`,
  
  title: `States`,
  description: `Indian states reference data`,

  dimensions: {
    id: {
      sql: `id`,
      type: `number`,
      primary_key: true,
    },

    name: {
      sql: `name`,
      type: `string`,
      title: `State Name`,
    },

    code: {
      sql: `code`,
      type: `string`,
      title: `State Code`,
    },

    region: {
      sql: `
        CASE 
          WHEN ${CUBE}.name IN ('Jammu and Kashmir', 'Himachal Pradesh', 'Punjab', 'Haryana', 'Delhi', 'Rajasthan', 'Uttar Pradesh', 'Uttarakhand') THEN 'North'
          WHEN ${CUBE}.name IN ('West Bengal', 'Odisha', 'Jharkhand', 'Bihar') THEN 'East'
          WHEN ${CUBE}.name IN ('Gujarat', 'Maharashtra', 'Goa', 'Madhya Pradesh', 'Chhattisgarh') THEN 'West'
          WHEN ${CUBE}.name IN ('Karnataka', 'Kerala', 'Tamil Nadu', 'Andhra Pradesh', 'Telangana') THEN 'South'
          WHEN ${CUBE}.name IN ('Assam', 'Arunachal Pradesh', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Tripura', 'Sikkim') THEN 'North East'
          ELSE 'Other'
        END
      `,
      type: `string`,
      title: `Region`,
    },
  },

  measures: {
    count: {
      type: `count`,
      title: `Number of States`,
    },
  },
});