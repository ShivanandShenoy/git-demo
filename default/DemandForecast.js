cube(`DemandForecast`, {
  sql_table: `public.demand_forecasts`,
  
  data_source: `default`,
  
  title: `Demand Forecast`,
  description: `Solar demand forecasting data including rooftop and large-scale installations`,
  
  joins: {
    Analyst: {
      relationship: `belongsTo`,
      sql: `${CUBE}.analyst_id = ${Analyst}.id`
    },
  },

  dimensions: {
    id: {
      sql: `id`,
      type: `number`,
      primary_key: true,
      title: `ID`
    },
    
    year: {
      sql: `year`,
      type: `number`,
      title: `Year`
    },
    
    forecast: {
      sql: `forecast`,
      type: `boolean`,
      title: `Is Forecast`
    },
    
    // Derived dimensions for better analysis
    yearString: {
      sql: `CAST(${CUBE}.year AS VARCHAR)`,
      type: `string`,
      title: `Year (String)`
    },
    
    forecastType: {
      sql: `CASE WHEN ${CUBE}.forecast = true THEN 'Forecasted' ELSE 'Actual' END`,
      type: `string`,
      title: `Forecast Type`
    },
    
    // Time-based groupings
    decade: {
      sql: `FLOOR(${CUBE}.year / 10) * 10`,
      type: `number`,
      title: `Decade`
    },
    
    yearRange: {
      sql: `
        CASE 
          WHEN ${CUBE}.year BETWEEN 2020 AND 2025 THEN '2020-2025'
          WHEN ${CUBE}.year BETWEEN 2026 AND 2030 THEN '2026-2030'
          WHEN ${CUBE}.year BETWEEN 2031 AND 2035 THEN '2031-2035'
          ELSE 'Other'
        END
      `,
      type: `string`,
      title: `Year Range`
    },

    // Additional dimensions
    analystId: {
      sql: `analyst_id`,
      type: `number`,
      title: `Analyst ID`
    },

    timeHorizon: {
      sql: `
        CASE 
          WHEN ${CUBE}.year < EXTRACT(YEAR FROM CURRENT_DATE) THEN 'Historical'
          WHEN ${CUBE}.year = EXTRACT(YEAR FROM CURRENT_DATE) THEN 'Current Year'
          WHEN ${CUBE}.year BETWEEN EXTRACT(YEAR FROM CURRENT_DATE) + 1 AND EXTRACT(YEAR FROM CURRENT_DATE) + 5 THEN 'Short-term'
          WHEN ${CUBE}.year BETWEEN EXTRACT(YEAR FROM CURRENT_DATE) + 6 AND EXTRACT(YEAR FROM CURRENT_DATE) + 10 THEN 'Medium-term'
          ELSE 'Long-term'
        END
      `,
      type: `string`,
      title: `Time Horizon`
    },

    yearDate: {
      sql: `CAST(CONCAT(${CUBE}.year, '-01-01') AS DATE)`,
      type: `time`,
      title: `Year Date`
    }
  },
  
  measures: {
    count: {
      type: `count`,
      title: `Number of Records`
    },
    
    // Main forecast measures
    annualRooftopSolarInstallations: {
      sql: `annual_rooftop_solar_installations`,
      type: `sum`,
      title: `Annual Rooftop Solar Installations (MW)`,
      format: `number`
    },

    cumulativeAnnualLargeScaleSolarInst: {
      sql: `cumulative_large_scale_solar_installations`, 
      type: `sum`,
      title: `Cumulative Annual Large Scale Solar Installations (MW)`,
      format: `number`
    },

    cumulativesolarinst: {
      sql: `cumulative_large_scale_solar_installations`, 
      type: `sum`,
      title: `Cumulative Annual Large Scale Solar Installations (MW)`,
      format: `number`
    },

    annualLargeScaleSolarInstallations: {
      sql: `annual_large_scale_solar_installations`, 
      type: `sum`,
      title: `Annual Large Scale Solar Installations (MW)`,
      format: `number`
    },
    
    cumulativeSolarInstallations: {
      sql: `cumulative_solar_installations`,
      type: `sum`,
      title: `Cumulative Solar Installations (MW)`,
      format: `number`
    },
    
    // Calculated measures
    totalAnnualInstallations: {
      sql: `annual_rooftop_solar_installations + annual_large_scale_solar_installations`,
      type: `sum`,
      title: `Total Annual Solar Installations (MW)`,
      format: `number`
    },
    
    // Average measures
    avgRooftopSolarInstallations: {
      sql: `annual_rooftop_solar_installations`,
      type: `avg`,
      title: `Average Annual Rooftop Solar (MW)`,
      format: `number`
    },
    
    avgLargeScaleSolarInstallations: {
      sql: `annual_large_scale_solar_installations`,
      type: `avg`, 
      title: `Average Annual Large Scale Solar (MW)`,
      format: `number`
    },
    
    // Growth rate calculations
    yearOverYearGrowth: {
      sql: `
        CASE 
          WHEN LAG(annual_rooftop_solar_installations + annual_large_scale_solar_installations) 
               OVER (ORDER BY year) > 0
          THEN ((annual_rooftop_solar_installations + annual_large_scale_solar_installations) - 
                LAG(annual_rooftop_solar_installations + annual_large_scale_solar_installations) 
                OVER (ORDER BY year)) * 100.0 / 
                LAG(annual_rooftop_solar_installations + annual_large_scale_solar_installations) 
                OVER (ORDER BY year)
          ELSE 0
        END
      `,
      type: `avg`,
      title: `Year-over-Year Growth Rate (%)`,
      format: `percent`
    },
    
    // Proportion measures
    rooftopProportion: {
      sql: `
        CASE 
          WHEN (annual_rooftop_solar_installations + annual_large_scale_solar_installations) > 0
          THEN annual_rooftop_solar_installations * 100.0 / 
               (annual_rooftop_solar_installations + annual_large_scale_solar_installations)
          ELSE 0
        END
      `,
      type: `avg`,
      title: `Rooftop Solar Proportion (%)`,
      format: `percent`
    },
    
    largeScaleProportion: {
      sql: `
        CASE 
          WHEN (annual_rooftop_solar_installations + annual_large_scale_solar_installations) > 0
          THEN annual_large_scale_solar_installations * 100.0 / 
               (annual_rooftop_solar_installations + annual_large_scale_solar_installations)
          ELSE 0
        END
      `,
      type: `avg`,
      title: `Large Scale Solar Proportion (%)`,
      format: `percent`
    },

    // Additional comprehensive measures
    maxAnnualInstallations: {
      sql: `annual_rooftop_solar_installations + annual_large_scale_solar_installations`,
      type: `max`,
      title: `Maximum Annual Installations (MW)`,
      format: `number`
    },

    minAnnualInstallations: {
      sql: `annual_rooftop_solar_installations + annual_large_scale_solar_installations`,
      type: `min`,
      title: `Minimum Annual Installations (MW)`,
      format: `number`
    },

    // Forecasted vs Actual measures
    actualRooftopInstallations: {
      sql: `annual_rooftop_solar_installations`,
      type: `sum`,
      filters: [{ sql: `${CUBE}.forecast = false` }],
      title: `Actual Rooftop Installations (MW)`,
      format: `number`
    },

    forecastedRooftopInstallations: {
      sql: `annual_rooftop_solar_installations`,
      type: `sum`,
      filters: [{ sql: `${CUBE}.forecast = true` }],
      title: `Forecasted Rooftop Installations (MW)`,
      format: `number`
    },

    actualLargeScaleInstallations: {
      sql: `annual_large_scale_solar_installations`,
      type: `sum`,
      filters: [{ sql: `${CUBE}.forecast = false` }],
      title: `Actual Large Scale Installations (MW)`,
      format: `number`
    },

    forecastedLargeScaleInstallations: {
      sql: `annual_large_scale_solar_installations`,
      type: `sum`,
      filters: [{ sql: `${CUBE}.forecast = true` }],
      title: `Forecasted Large Scale Installations (MW)`,
      format: `number`
    },

    // Compound annual growth rate (CAGR)
    cagr: {
      sql: `
        CASE 
          WHEN MIN(${CUBE}.year) < MAX(${CUBE}.year) AND MIN(annual_rooftop_solar_installations + annual_large_scale_solar_installations) > 0
          THEN (POWER(MAX(cumulative_solar_installations) / MIN(cumulative_solar_installations), 
                1.0 / (MAX(${CUBE}.year) - MIN(${CUBE}.year))) - 1) * 100
          ELSE 0
        END
      `,
      type: `number`,
      title: `CAGR (%)`,
      format: `percent`
    },

    // Running total measures
    runningTotalInstallations: {
      sql: `SUM(annual_rooftop_solar_installations + annual_large_scale_solar_installations) OVER (ORDER BY ${CUBE}.year)`,
      type: `number`,
      title: `Running Total Installations (MW)`,
      format: `number`
    },

    // Forecast accuracy (when comparing actuals to forecasts)
    forecastAccuracy: {
      sql: `
        CASE 
          WHEN SUM(CASE WHEN ${CUBE}.forecast = true THEN annual_rooftop_solar_installations + annual_large_scale_solar_installations ELSE 0 END) > 0
          THEN (1 - ABS(SUM(CASE WHEN ${CUBE}.forecast = false THEN annual_rooftop_solar_installations + annual_large_scale_solar_installations ELSE 0 END) - 
                        SUM(CASE WHEN ${CUBE}.forecast = true THEN annual_rooftop_solar_installations + annual_large_scale_solar_installations ELSE 0 END)) / 
                    SUM(CASE WHEN ${CUBE}.forecast = true THEN annual_rooftop_solar_installations + annual_large_scale_solar_installations ELSE 0 END)) * 100
          ELSE NULL
        END
      `,
      type: `number`,
      title: `Forecast Accuracy (%)`,
      format: `percent`
    }
  },
  
  segments: {
    actualData: {
      sql: `${CUBE}.forecast = false`,
      title: `Actual Data`
    },
    
    forecastData: {
      sql: `${CUBE}.forecast = true`,
      title: `Forecast Data`
    },
    
    recent: {
      sql: `${CUBE}.year >= 2020`,
      title: `Recent Years (2020+)`
    },
    
    nearTerm: {
      sql: `${CUBE}.year BETWEEN 2024 AND 2030`,
      title: `Near-term Forecast (2024-2030)`
    },
    
    longTerm: {
      sql: `${CUBE}.year > 2030`,
      title: `Long-term Forecast (2030+)`
    },
    
    highGrowth: {
      sql: `(annual_rooftop_solar_installations + annual_large_scale_solar_installations) > 1000`,
      title: `High Growth Years (>1000 MW)`
    },
    
    rooftopDominated: {
      sql: `annual_rooftop_solar_installations > annual_large_scale_solar_installations`,
      title: `Rooftop Dominated`
    },
    
    largeScaleDominated: {
      sql: `annual_large_scale_solar_installations > annual_rooftop_solar_installations`,
      title: `Large Scale Dominated`
    }
  },
  
  pre_aggregations: {
    yearlyForecast: {
      measures: [
        DemandForecast.annualRooftopSolarInstallations,
        DemandForecast.annualLargeScaleSolarInstallations,
        DemandForecast.cumulativeSolarInstallations,
        DemandForecast.totalAnnualInstallations,
        DemandForecast.count
      ],
      dimensions: [
        DemandForecast.year,
        DemandForecast.forecast,
        DemandForecast.forecastType
      ],
      refreshKey: {
        every: `1 hour`
      }
    },
    
    forecastTrends: {
      measures: [
        DemandForecast.avgRooftopSolarInstallations,
        DemandForecast.avgLargeScaleSolarInstallations,
        DemandForecast.rooftopProportion,
        DemandForecast.largeScaleProportion
      ],
      dimensions: [
        DemandForecast.yearRange,
        DemandForecast.forecastType
      ],
      refreshKey: {
        every: `4 hours`
      }
    }
  }
});