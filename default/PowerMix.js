cube(`PowerMix`, {
  sql_table: `public.power_mixes`,
  
  data_source: `default`,
  
  title: `Power Generation Mix`,
  description: `State-wise energy generation mix by quarter across different power sources`,

  joins: {
    States: {
      relationship: `belongsTo`,
      sql: `${CUBE}.state_id = ${States}.id`
    },
  },

  dimensions: {
    id: {
      sql: `id`,
      type: `number`,
      primary_key: true,
    },

    // State
    stateId: {
      sql: `state_id`,
      type: `number`,
      title: `State ID`,
    },

    // Time dimensions
    quarter: {
      sql: `quarter`,
      type: `string`,
      title: `Quarter`,
    },

    year: {
      sql: `year`,
      type: `number`,
      title: `Year`,
    },

    yearQuarter: {
      sql: `CONCAT(${CUBE}.year, '-Q', ${CUBE}.quarter)`,
      type: `string`,
      title: `Year-Quarter`,
    },

    // Derived time dimension for Cube.js time series
    quarterDate: {
      sql: `CAST(CONCAT(${CUBE}.year, '-', LPAD(((${CUBE}.quarter::integer - 1) * 3 + 1)::text, 2, '0'), '-01') AS DATE)`,
      type: `time`,
      title: `Quarter Date`,
    },

    // Categories for grouping
    sourceCategory: {
      sql: `
        CASE 
          WHEN (COALESCE(${CUBE}.coal, 0) + COALESCE(${CUBE}.lignite, 0) + COALESCE(${CUBE}.gas, 0) + COALESCE(${CUBE}.diesel, 0)) > 0 THEN 'Thermal'
          WHEN COALESCE(${CUBE}.nuclear, 0) > 0 THEN 'Nuclear'
          WHEN (COALESCE(${CUBE}.hydro, 0) + COALESCE(${CUBE}.small_hydro, 0)) > 0 THEN 'Hydro'
          WHEN (COALESCE(${CUBE}.wind, 0) + COALESCE(${CUBE}.large_scale_solar, 0) + COALESCE(${CUBE}.rooftop_solar, 0) + 
                COALESCE(${CUBE}.bagasse_co_gen, 0) + COALESCE(${CUBE}.waste_to_energy, 0) + COALESCE(${CUBE}.non_bagasse_captive, 0)) > 0 THEN 'Renewable'
          ELSE 'Unknown'
        END
      `,
      type: `string`,
      title: `Source Category`,
    },
  },

  measures: {
    // Thermal sources
    coalGeneration: {
      sql: `coal`,
      type: `sum`,
      title: `Coal Generation (MW)`,
      format: `number`,
    },

    ligniteGeneration: {
      sql: `lignite`,
      type: `sum`,
      title: `Lignite Generation (MW)`,
      format: `number`,
    },

    gasGeneration: {
      sql: `gas`,
      type: `sum`,
      title: `Gas Generation (MW)`,
      format: `number`,
    },

    dieselGeneration: {
      sql: `diesel`,
      type: `sum`,
      title: `Diesel Generation (MW)`,
      format: `number`,
    },

    // Total thermal
    totalThermalGeneration: {
      sql: `COALESCE(coal, 0) + COALESCE(lignite, 0) + COALESCE(gas, 0) + COALESCE(diesel, 0)`,
      type: `sum`,
      title: `Total Thermal Generation (MW)`,
      format: `number`,
    },

    // Nuclear
    nuclearGeneration: {
      sql: `nuclear`,
      type: `sum`,
      title: `Nuclear Generation (MW)`,
      format: `number`,
    },

    // Hydro
    hydroGeneration: {
      sql: `hydro`,
      type: `sum`,
      title: `Hydro Generation (MW)`,
      format: `number`,
    },

    smallHydroGeneration: {
      sql: `small_hydro`,
      type: `sum`,
      title: `Small Hydro Generation (MW)`,
      format: `number`,
    },

    // Total hydro
    totalHydroGeneration: {
      sql: `COALESCE(hydro, 0) + COALESCE(small_hydro, 0)`,
      type: `sum`,
      title: `Total Hydro Generation (MW)`,
      format: `number`,
    },

    // Renewable sources
    windGeneration: {
      sql: `wind`,
      type: `sum`,
      title: `Wind Generation (MW)`,
      format: `number`,
    },

    largeScaleSolarGeneration: {
      sql: `large_scale_solar`,
      type: `sum`,
      title: `Large Scale Solar Generation (MW)`,
      format: `number`,
    },

    rooftopSolarGeneration: {
      sql: `rooftop_solar`,
      type: `sum`,
      title: `Rooftop Solar Generation (MW)`,
      format: `number`,
    },

    // Total solar
    totalSolarGeneration: {
      sql: `COALESCE(large_scale_solar, 0) + COALESCE(rooftop_solar, 0)`,
      type: `sum`,
      title: `Total Solar Generation (MW)`,
      format: `number`,
    },

    // Other renewable
    bagasseCoGenGeneration: {
      sql: `bagasse_co_gen`,
      type: `sum`,
      title: `Bagasse Co-Gen Generation (MW)`,
      format: `number`,
    },

    wasteToEnergyGeneration: {
      sql: `waste_to_energy`,
      type: `sum`,
      title: `Waste to Energy Generation (MW)`,
      format: `number`,
    },

    nonBagasseCaptiveGeneration: {
      sql: `non_bagasse_captive`,
      type: `sum`,
      title: `Non-Bagasse Captive Generation (MW)`,
      format: `number`,
    },

    // Total renewable
    totalRenewableGeneration: {
      sql: `COALESCE(wind, 0) + COALESCE(large_scale_solar, 0) + COALESCE(rooftop_solar, 0) + 
            COALESCE(small_hydro, 0) + COALESCE(bagasse_co_gen, 0) + COALESCE(waste_to_energy, 0) + COALESCE(non_bagasse_captive, 0)`,
      type: `sum`,
      title: `Total Renewable Generation (MW)`,
      format: `number`,
    },

    // Grand total
    totalGeneration: {
      sql: `COALESCE(coal, 0) + COALESCE(lignite, 0) + COALESCE(gas, 0) + COALESCE(diesel, 0) + 
            COALESCE(nuclear, 0) + COALESCE(hydro, 0) + COALESCE(wind, 0) + 
            COALESCE(large_scale_solar, 0) + COALESCE(rooftop_solar, 0) + COALESCE(small_hydro, 0) + 
            COALESCE(bagasse_co_gen, 0) + COALESCE(waste_to_energy, 0) + COALESCE(non_bagasse_captive, 0)`,
      type: `sum`,
      title: `Total Generation (MW)`,
      format: `number`,
    },

    // Percentage measures
    thermalPercentage: {
      sql: `(COALESCE(coal, 0) + COALESCE(lignite, 0) + COALESCE(gas, 0) + COALESCE(diesel, 0)) * 100.0 / 
            NULLIF(COALESCE(coal, 0) + COALESCE(lignite, 0) + COALESCE(gas, 0) + COALESCE(diesel, 0) + 
            COALESCE(nuclear, 0) + COALESCE(hydro, 0) + COALESCE(wind, 0) + 
            COALESCE(large_scale_solar, 0) + COALESCE(rooftop_solar, 0) + COALESCE(small_hydro, 0) + 
            COALESCE(bagasse_co_gen, 0) + COALESCE(waste_to_energy, 0) + COALESCE(non_bagasse_captive, 0), 0)`,
      type: `number`,
      title: `Thermal Percentage`,
      format: `percent`,
    },

    renewablePercentage: {
      sql: `(COALESCE(wind, 0) + COALESCE(large_scale_solar, 0) + COALESCE(rooftop_solar, 0) + 
            COALESCE(small_hydro, 0) + COALESCE(bagasse_co_gen, 0) + COALESCE(waste_to_energy, 0) + COALESCE(non_bagasse_captive, 0)) * 100.0 / 
            NULLIF(COALESCE(coal, 0) + COALESCE(lignite, 0) + COALESCE(gas, 0) + COALESCE(diesel, 0) + 
            COALESCE(nuclear, 0) + COALESCE(hydro, 0) + COALESCE(wind, 0) + 
            COALESCE(large_scale_solar, 0) + COALESCE(rooftop_solar, 0) + COALESCE(small_hydro, 0) + 
            COALESCE(bagasse_co_gen, 0) + COALESCE(waste_to_energy, 0) + COALESCE(non_bagasse_captive, 0), 0)`,
      type: `number`,
      title: `Renewable Percentage`,
      format: `percent`,
    },

    solarPercentage: {
      sql: `(COALESCE(large_scale_solar, 0) + COALESCE(rooftop_solar, 0)) * 100.0 / 
            NULLIF(COALESCE(coal, 0) + COALESCE(lignite, 0) + COALESCE(gas, 0) + COALESCE(diesel, 0) + 
            COALESCE(nuclear, 0) + COALESCE(hydro, 0) + COALESCE(wind, 0) + 
            COALESCE(large_scale_solar, 0) + COALESCE(rooftop_solar, 0) + COALESCE(small_hydro, 0) + 
            COALESCE(bagasse_co_gen, 0) + COALESCE(waste_to_energy, 0) + COALESCE(non_bagasse_captive, 0), 0)`,
      type: `number`,
      title: `Solar Percentage`,
      format: `percent`,
    },

    // Average measures
    avgCoalGeneration: {
      sql: `coal`,
      type: `avg`,
      title: `Average Coal Generation (MW)`,
      format: `number`,
    },

    avgSolarGeneration: {
      sql: `COALESCE(large_scale_solar, 0) + COALESCE(rooftop_solar, 0)`,
      type: `avg`,
      title: `Average Solar Generation (MW)`,
      format: `number`,
    },

    avgWindGeneration: {
      sql: `wind`,
      type: `avg`,
      title: `Average Wind Generation (MW)`,
      format: `number`,
    },

    // Count of records
    recordCount: {
      type: `count`,
      title: `Number of Records`,
    },
  },

  segments: {
    highRenewableStates: {
      sql: `(COALESCE(wind, 0) + COALESCE(large_scale_solar, 0) + COALESCE(rooftop_solar, 0) + 
            COALESCE(small_hydro, 0) + COALESCE(bagasse_co_gen, 0) + COALESCE(waste_to_energy, 0) + COALESCE(non_bagasse_captive, 0)) * 100.0 / 
            NULLIF(COALESCE(coal, 0) + COALESCE(lignite, 0) + COALESCE(gas, 0) + COALESCE(diesel, 0) + 
            COALESCE(nuclear, 0) + COALESCE(hydro, 0) + COALESCE(wind, 0) + 
            COALESCE(large_scale_solar, 0) + COALESCE(rooftop_solar, 0) + COALESCE(small_hydro, 0) + 
            COALESCE(bagasse_co_gen, 0) + COALESCE(waste_to_energy, 0) + COALESCE(non_bagasse_captive, 0), 0) > 20`,
      title: `High Renewable States (>20%)`,
    },

    coalDominantStates: {
      sql: `coal * 100.0 / 
            NULLIF(COALESCE(coal, 0) + COALESCE(lignite, 0) + COALESCE(gas, 0) + COALESCE(diesel, 0) + 
            COALESCE(nuclear, 0) + COALESCE(hydro, 0) + COALESCE(wind, 0) + 
            COALESCE(large_scale_solar, 0) + COALESCE(rooftop_solar, 0) + COALESCE(small_hydro, 0) + 
            COALESCE(bagasse_co_gen, 0) + COALESCE(waste_to_energy, 0) + COALESCE(non_bagasse_captive, 0), 0) > 50`,
      title: `Coal Dominant States (>50%)`,
    },

    recentData: {
      sql: `${CUBE}.year >= EXTRACT(YEAR FROM CURRENT_DATE) - 2`,
      title: `Recent Data (Last 2 Years)`,
    },
  },

  pre_aggregations: {
    quarterlyStateRollup: {
      measures: [
        PowerMix.totalGeneration,
        PowerMix.totalThermalGeneration,
        PowerMix.totalRenewableGeneration,
        PowerMix.totalSolarGeneration,
        PowerMix.windGeneration,
        PowerMix.renewablePercentage,
      ],
      dimensions: [
        PowerMix.stateId,
        PowerMix.yearQuarter,
      ],
      timeDimension: PowerMix.quarterDate,
      granularity: `quarter`,
      partitionGranularity: `year`,
      refreshKey: {
        every: `1 hour`,
      },
    },

    yearlyNationalRollup: {
      measures: [
        PowerMix.totalGeneration,
        PowerMix.coalGeneration,
        PowerMix.nuclearGeneration,
        PowerMix.hydroGeneration,
        PowerMix.windGeneration,
        PowerMix.totalSolarGeneration,
        PowerMix.totalRenewableGeneration,
        PowerMix.renewablePercentage,
      ],
      dimensions: [PowerMix.year],
      refreshKey: {
        every: `1 hour`,
      },
    },

    sourceTypeRollup: {
      measures: [
        PowerMix.coalGeneration,
        PowerMix.ligniteGeneration,
        PowerMix.gasGeneration,
        PowerMix.dieselGeneration,
        PowerMix.nuclearGeneration,
        PowerMix.hydroGeneration,
        PowerMix.windGeneration,
        PowerMix.largeScaleSolarGeneration,
        PowerMix.rooftopSolarGeneration,
        PowerMix.smallHydroGeneration,
        PowerMix.bagasseCoGenGeneration,
        PowerMix.wasteToEnergyGeneration,
        PowerMix.nonBagasseCaptiveGeneration,
      ],
      dimensions: [
        PowerMix.stateId,
        PowerMix.yearQuarter,
      ],
      refreshKey: {
        every: `1 hour`,
      },
    },
  },
});