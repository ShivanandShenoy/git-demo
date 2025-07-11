cube(`DiscomsRating`, {
  sql_table: `public.discoms_rating`,
  
  data_source: `default`,
  
  title: `DISCOMs Rating`,
  description: `Distribution company performance ratings and efficiency metrics`,

  joins: {
    States: {
      relationship: `belongsTo`,
      sql: `${CUBE}.state_id = ${States}.id`
    },
    
    Utility: {
      relationship: `belongsTo`,
      sql: `${CUBE}.utility_id = ${Utility}.id`
    },
    
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
    },

    // Organization dimensions
    stateId: {
      sql: `state_id`,
      type: `number`,
      title: `State ID`,
    },

    utilityId: {
      sql: `utility_id`,
      type: `number`,
      title: `Utility ID`,
    },

    // Time dimensions
    year: {
      sql: `year`,
      type: `number`,
      title: `Year`,
    },

    yearString: {
      sql: `CAST(${CUBE}.year AS VARCHAR)`,
      type: `string`,
      title: `Year (String)`,
    },

    yearDate: {
      sql: `CAST(CONCAT(${CUBE}.year, '-01-01') AS DATE)`,
      type: `time`,
      title: `Year Date`,
    },

    // Rating dimensions
    rating: {
      sql: `rating`,
      type: `string`,
      title: `Rating`,
    },

    ratingCategory: {
      sql: `
        CASE 
          WHEN ${CUBE}.rating IN ('A+', 'A') THEN 'Excellent'
          WHEN ${CUBE}.rating IN ('B+', 'B') THEN 'Good'
          WHEN ${CUBE}.rating IN ('C+', 'C') THEN 'Average'
          WHEN ${CUBE}.rating IN ('D+', 'D') THEN 'Below Average'
          ELSE 'Poor'
        END
      `,
      type: `string`,
      title: `Rating Category`,
    },

    ratingScore: {
      sql: `
        CASE 
          WHEN ${CUBE}.rating = 'A+' THEN 9
          WHEN ${CUBE}.rating = 'A' THEN 8
          WHEN ${CUBE}.rating = 'B+' THEN 7
          WHEN ${CUBE}.rating = 'B' THEN 6
          WHEN ${CUBE}.rating = 'C+' THEN 5
          WHEN ${CUBE}.rating = 'C' THEN 4
          WHEN ${CUBE}.rating = 'D+' THEN 3
          WHEN ${CUBE}.rating = 'D' THEN 2
          ELSE 1
        END
      `,
      type: `number`,
      title: `Rating Score`,
    },

    // Performance categories
    billingEfficiencyCategory: {
      sql: `
        CASE 
          WHEN ${CUBE}.billing_efficiency >= 95 THEN 'Excellent (≥95%)'
          WHEN ${CUBE}.billing_efficiency >= 90 THEN 'Good (90-95%)'
          WHEN ${CUBE}.billing_efficiency >= 85 THEN 'Average (85-90%)'
          WHEN ${CUBE}.billing_efficiency >= 80 THEN 'Below Average (80-85%)'
          ELSE 'Poor (<80%)'
        END
      `,
      type: `string`,
      title: `Billing Efficiency Category`,
    },

    collectionEfficiencyCategory: {
      sql: `
        CASE 
          WHEN ${CUBE}.collection_efficiency >= 95 THEN 'Excellent (≥95%)'
          WHEN ${CUBE}.collection_efficiency >= 90 THEN 'Good (90-95%)'
          WHEN ${CUBE}.collection_efficiency >= 85 THEN 'Average (85-90%)'
          WHEN ${CUBE}.collection_efficiency >= 80 THEN 'Below Average (80-85%)'
          ELSE 'Poor (<80%)'
        END
      `,
      type: `string`,
      title: `Collection Efficiency Category`,
    },

    atcLossCategory: {
      sql: `
        CASE 
          WHEN ${CUBE}.at_and_c_losses <= 10 THEN 'Excellent (≤10%)'
          WHEN ${CUBE}.at_and_c_losses <= 15 THEN 'Good (10-15%)'
          WHEN ${CUBE}.at_and_c_losses <= 20 THEN 'Average (15-20%)'
          WHEN ${CUBE}.at_and_c_losses <= 25 THEN 'Below Average (20-25%)'
          ELSE 'Poor (>25%)'
        END
      `,
      type: `string`,
      title: `AT&C Loss Category`,
    },

    // Metadata
    analystId: {
      sql: `analyst_id`,
      type: `number`,
      title: `Analyst ID`,
    },

    entryDate: {
      sql: `entry_date`,
      type: `time`,
      title: `Entry Date`,
    },

    // Derived dimensions
    isHighPerformer: {
      sql: `CASE WHEN ${CUBE}.rating IN ('A+', 'A', 'B+') THEN 'Yes' ELSE 'No' END`,
      type: `string`,
      title: `Is High Performer`,
    },

    hasPositiveAcsArrGap: {
      sql: `CASE WHEN ${CUBE}.acs_arr_gap > 0 THEN 'Surplus' ELSE 'Deficit' END`,
      type: `string`,
      title: `ACS-ARR Status`,
    },
  },

  measures: {
    // Count measures
    count: {
      type: `count`,
      title: `Number of Records`,
    },

    uniqueUtilities: {
      sql: `${CUBE}.utility_id`,
      type: `countDistinct`,
      title: `Number of Utilities`,
    },

    uniqueStates: {
      sql: `${CUBE}.state_id`,
      type: `countDistinct`,
      title: `Number of States`,
    },

    // Efficiency measures
    avgBillingEfficiency: {
      sql: `billing_efficiency`,
      type: `avg`,
      title: `Average Billing Efficiency (%)`,
      format: `percent`,
    },

    maxBillingEfficiency: {
      sql: `billing_efficiency`,
      type: `max`,
      title: `Maximum Billing Efficiency (%)`,
      format: `percent`,
    },

    minBillingEfficiency: {
      sql: `billing_efficiency`,
      type: `min`,
      title: `Minimum Billing Efficiency (%)`,
      format: `percent`,
    },

    avgCollectionEfficiency: {
      sql: `collection_efficiency`,
      type: `avg`,
      title: `Average Collection Efficiency (%)`,
      format: `percent`,
    },

    maxCollectionEfficiency: {
      sql: `collection_efficiency`,
      type: `max`,
      title: `Maximum Collection Efficiency (%)`,
      format: `percent`,
    },

    minCollectionEfficiency: {
      sql: `collection_efficiency`,
      type: `min`,
      title: `Minimum Collection Efficiency (%)`,
      format: `percent`,
    },

    // Loss measures
    avgATCLosses: {
      sql: `at_and_c_losses`,
      type: `avg`,
      title: `Average AT&C Losses (%)`,
      format: `percent`,
    },

    maxATCLosses: {
      sql: `at_and_c_losses`,
      type: `max`,
      title: `Maximum AT&C Losses (%)`,
      format: `percent`,
    },

    minATCLosses: {
      sql: `at_and_c_losses`,
      type: `min`,
      title: `Minimum AT&C Losses (%)`,
      format: `percent`,
    },

    // Gap measures
    avgAcsArrGap: {
      sql: `acs_arr_gap`,
      type: `avg`,
      title: `Average ACS-ARR Gap`,
      format: `currency`,
    },

    totalAcsArrGap: {
      sql: `acs_arr_gap`,
      type: `sum`,
      title: `Total ACS-ARR Gap`,
      format: `currency`,
    },

    positiveAcsArrGap: {
      sql: `acs_arr_gap`,
      type: `sum`,
      filters: [{ sql: `${CUBE}.acs_arr_gap > 0` }],
      title: `Total Surplus (Positive Gap)`,
      format: `currency`,
    },

    negativeAcsArrGap: {
      sql: `acs_arr_gap`,
      type: `sum`,
      filters: [{ sql: `${CUBE}.acs_arr_gap < 0` }],
      title: `Total Deficit (Negative Gap)`,
      format: `currency`,
    },

    // Rating score measures
    avgRatingScore: {
      sql: `
        CASE 
          WHEN ${CUBE}.rating = 'A+' THEN 9
          WHEN ${CUBE}.rating = 'A' THEN 8
          WHEN ${CUBE}.rating = 'B+' THEN 7
          WHEN ${CUBE}.rating = 'B' THEN 6
          WHEN ${CUBE}.rating = 'C+' THEN 5
          WHEN ${CUBE}.rating = 'C' THEN 4
          WHEN ${CUBE}.rating = 'D+' THEN 3
          WHEN ${CUBE}.rating = 'D' THEN 2
          ELSE 1
        END
      `,
      type: `avg`,
      title: `Average Rating Score`,
      format: `number`,
    },

    // Performance count measures
    highPerformers: {
      type: `count`,
      filters: [{ sql: `${CUBE}.rating IN ('A+', 'A', 'B+')` }],
      title: `High Performers (A+/A/B+)`,
    },

    lowPerformers: {
      type: `count`,
      filters: [{ sql: `${CUBE}.rating IN ('C', 'D+', 'D')` }],
      title: `Low Performers (C/D+/D)`,
    },

    excellentBilling: {
      type: `count`,
      filters: [{ sql: `${CUBE}.billing_efficiency >= 95` }],
      title: `Excellent Billing (≥95%)`,
    },

    excellentCollection: {
      type: `count`,
      filters: [{ sql: `${CUBE}.collection_efficiency >= 95` }],
      title: `Excellent Collection (≥95%)`,
    },

    lowATCLoss: {
      type: `count`,
      filters: [{ sql: `${CUBE}.at_and_c_losses <= 10` }],
      title: `Low AT&C Loss (≤10%)`,
    },

    // Weighted efficiency (billing * collection / 100)
    weightedEfficiency: {
      sql: `(billing_efficiency * collection_efficiency) / 100`,
      type: `avg`,
      title: `Weighted Efficiency`,
      format: `percent`,
    },

    // Year-over-year improvements
    billingEfficiencyImprovement: {
      sql: `billing_efficiency - LAG(billing_efficiency) OVER (PARTITION BY ${CUBE}.utility_id ORDER BY ${CUBE}.year)`,
      type: `avg`,
      title: `YoY Billing Efficiency Change`,
      format: `percent`,
    },

    collectionEfficiencyImprovement: {
      sql: `collection_efficiency - LAG(collection_efficiency) OVER (PARTITION BY ${CUBE}.utility_id ORDER BY ${CUBE}.year)`,
      type: `avg`,
      title: `YoY Collection Efficiency Change`,
      format: `percent`,
    },

    atcLossReduction: {
      sql: `LAG(at_and_c_losses) OVER (PARTITION BY ${CUBE}.utility_id ORDER BY ${CUBE}.year) - at_and_c_losses`,
      type: `avg`,
      title: `YoY AT&C Loss Reduction`,
      format: `percent`,
    },
  },

  segments: {
    highPerformersSegment: {
      sql: `${CUBE}.rating IN ('A+', 'A', 'B+')`,
      title: `High Performers`,
    },

    averagePerformersSegment: {
      sql: `${CUBE}.rating IN ('B', 'C+')`,
      title: `Average Performers`,
    },

    lowPerformersSegment: {
      sql: `${CUBE}.rating IN ('C', 'D+', 'D')`,
      title: `Low Performers`,
    },

    efficientBilling: {
      sql: `${CUBE}.billing_efficiency >= 90`,
      title: `Efficient Billing (≥90%)`,
    },

    efficientCollection: {
      sql: `${CUBE}.collection_efficiency >= 90`,
      title: `Efficient Collection (≥90%)`,
    },

    lowLoss: {
      sql: `${CUBE}.at_and_c_losses <= 15`,
      title: `Low AT&C Loss (≤15%)`,
    },

    surplusUtilities: {
      sql: `${CUBE}.acs_arr_gap > 0`,
      title: `Surplus Utilities`,
    },

    deficitUtilities: {
      sql: `${CUBE}.acs_arr_gap < 0`,
      title: `Deficit Utilities`,
    },

    recentData: {
      sql: `${CUBE}.year >= EXTRACT(YEAR FROM CURRENT_DATE) - 3`,
      title: `Recent Data (Last 3 Years)`,
    },
  },

  pre_aggregations: {
    yearlyStatePerformance: {
      measures: [
        DiscomsRating.count,
        DiscomsRating.uniqueUtilities,
        DiscomsRating.avgBillingEfficiency,
        DiscomsRating.avgCollectionEfficiency,
        DiscomsRating.avgATCLosses,
        DiscomsRating.avgRatingScore,
        DiscomsRating.highPerformers,
        DiscomsRating.lowPerformers,
      ],
      dimensions: [
        DiscomsRating.stateId,
        DiscomsRating.year,
        DiscomsRating.ratingCategory,
      ],
      timeDimension: DiscomsRating.yearDate,
      granularity: `year`,
      refreshKey: {
        every: `1 hour`,
      },
    },

    utilityPerformanceTrends: {
      measures: [
        DiscomsRating.avgBillingEfficiency,
        DiscomsRating.avgCollectionEfficiency,
        DiscomsRating.avgATCLosses,
        DiscomsRating.weightedEfficiency,
        DiscomsRating.avgAcsArrGap,
      ],
      dimensions: [
        DiscomsRating.utilityId,
        DiscomsRating.year,
        DiscomsRating.rating,
      ],
      refreshKey: {
        every: `1 hour`,
      },
    },

    nationalPerformanceSummary: {
      measures: [
        DiscomsRating.uniqueUtilities,
        DiscomsRating.uniqueStates,
        DiscomsRating.avgBillingEfficiency,
        DiscomsRating.avgCollectionEfficiency,
        DiscomsRating.avgATCLosses,
        DiscomsRating.totalAcsArrGap,
        DiscomsRating.positiveAcsArrGap,
        DiscomsRating.negativeAcsArrGap,
      ],
      dimensions: [DiscomsRating.year],
      refreshKey: {
        every: `1 hour`,
      },
    },
  },
});