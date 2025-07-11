cube(`PowerGeneration`, {
  // Using project_tracker_masters as the base table for power generation data
  sql: `
    SELECT 
      id,
      category as source,
      solar_state_id,
      solar_capacity + COALESCE(wind_capacity, 0) + COALESCE(bess_storage_capacity, 0) as total_generation,
      solar_capacity + COALESCE(wind_capacity, 0) as renewable_generation,
      solar_capacity,
      wind_capacity,
      bess_storage_capacity,
      commisioned_date as date,
      'Solar' as energy_type
    FROM public.project_tracker_masters
    WHERE commisioned_date IS NOT NULL
  `,
  
  data_source: `default`,
  
  title: `Power Generation`,
  description: `Power generation data including solar, wind, and BESS`,
  
  joins: {
    States: {
      sql: `${CUBE}.solar_state_id = ${States}.id`,
      relationship: `many_to_one`
    }
  },
  
  dimensions: {
    id: {
      sql: `id`,
      type: `number`,
      primary_key: true
    },
    
    source: {
      sql: `source`,
      type: `string`,
      title: `Generation Source`
    },
    
    stateId: {
      sql: `solar_state_id`,
      type: `number`,
      title: `State ID`
    },
    
    energy_type: {
      sql: `energy_type`,
      type: `string`,
      title: `Energy Type`
    },
    
    date: {
      sql: `date`,
      type: `time`,
      title: `Date`
    },
    
    // Time-based dimensions
    year: {
      sql: `EXTRACT(YEAR FROM ${CUBE}.date)`,
      type: `number`,
      title: `Year`
    },
    
    quarter: {
      sql: `CONCAT('Q', EXTRACT(QUARTER FROM ${CUBE}.date))`,
      type: `string`,
      title: `Quarter`
    },
    
    month: {
      sql: `TO_CHAR(${CUBE}.date, 'YYYY-MM')`,
      type: `string`,
      title: `Month`
    }
  },
  
  measures: {
    count: {
      type: `count`,
      title: `Number of Projects`
    },
    
    totalGeneration: {
      sql: `total_generation`,
      type: `sum`,
      title: `Total Generation Capacity (MW)`,
      format: `number`
    },
    
    renewableGeneration: {
      sql: `renewable_generation`,
      type: `sum`,
      title: `Renewable Generation (MW)`,
      format: `number`
    },
    
    solarCapacity: {
      sql: `solar_capacity`,
      type: `sum`,
      title: `Solar Capacity (MW)`,
      format: `number`
    },
    
    windCapacity: {
      sql: `wind_capacity`,
      type: `sum`,
      title: `Wind Capacity (MW)`,
      format: `number`
    },
    
    bessCapacity: {
      sql: `bess_storage_capacity`,
      type: `sum`,
      title: `BESS Storage Capacity (MWh)`,
      format: `number`
    },
    
    // Calculated measures
    renewablePercentage: {
      sql: `CASE WHEN SUM(${totalGeneration}) > 0 
            THEN (SUM(${renewableGeneration}) * 100.0 / SUM(${totalGeneration}))
            ELSE 0 END`,
      type: `number`,
      title: `Renewable Percentage`,
      format: `percent`
    },
    
    averageProjectSize: {
      sql: `total_generation`,
      type: `avg`,
      title: `Average Project Size (MW)`,
      format: `number`
    }
  },
  
  segments: {
    solarOnly: {
      sql: `${CUBE}.solar_capacity > 0 AND ${CUBE}.wind_capacity IS NULL`
    },
    
    windOnly: {
      sql: `${CUBE}.wind_capacity > 0 AND ${CUBE}.solar_capacity IS NULL`
    },
    
    hybrid: {
      sql: `${CUBE}.solar_capacity > 0 AND ${CUBE}.wind_capacity > 0`
    },
    
    withStorage: {
      sql: `${CUBE}.bess_storage_capacity > 0`
    },
    
    largeSolar: {
      sql: `${CUBE}.solar_capacity >= 100`
    },
    
    recentProjects: {
      sql: `${CUBE}.date >= NOW() - INTERVAL '1 year'`
    }
  },
  
  pre_aggregations: {
    monthlyPowerMix: {
      measures: [
        PowerGeneration.totalGeneration,
        PowerGeneration.renewableGeneration,
        PowerGeneration.solarCapacity,
        PowerGeneration.windCapacity,
        PowerGeneration.bessCapacity,
        PowerGeneration.count
      ],
      dimensions: [
        PowerGeneration.state,
        PowerGeneration.source,
        PowerGeneration.month
      ],
      timeDimension: PowerGeneration.date,
      granularity: `month`,
      partitionGranularity: `year`,
      refreshKey: {
        every: `1 hour`
      }
    },
    
    statePowerMix: {
      measures: [
        PowerGeneration.totalGeneration,
        PowerGeneration.renewableGeneration,
        PowerGeneration.renewablePercentage
      ],
      dimensions: [
        PowerGeneration.state,
        PowerGeneration.source
      ],
      refreshKey: {
        every: `1 hour`
      }
    }
  }
});