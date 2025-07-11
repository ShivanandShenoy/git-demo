cube(`ProjectTrackerMaster`, {
  sql_table: `public.project_tracker_masters`,
  
  data_source: `default`,
  
  title: `Project Tracker Master`,
  description: `Comprehensive renewable energy project tracking including solar, wind, and storage`,

  joins: {
    States: {
      relationship: `belongsTo`,
      sql: `${CUBE}.location_state_id = ${States}.id`
    },
    
    Status: {
      relationship: `belongsTo`,
      sql: `${CUBE}.status_id = ${Status}.id`
    },
    
    ProjectType: {
      relationship: `belongsTo`,
      sql: `${CUBE}.project_type_id = ${ProjectType}.id`
    },
    
    ProjectCategory: {
      relationship: `belongsTo`,
      sql: `${CUBE}.project_category_id = ${ProjectCategory}.id`
    },
    
    
    TenderScheme: {
      relationship: `belongsTo`,
      sql: `${CUBE}.tender_scheme_id = ${TenderScheme}.id`
    },
    
    Offtaker: {
      relationship: `belongsTo`,
      sql: `${CUBE}.offtaker_id = ${Offtaker}.id`
    }
  },

  dimensions: {
    id: {
      sql: `id`,
      type: `number`,
      primary_key: true,
    },

    // Project Identification
    projectId: {
      sql: `project_id`,
      type: `string`,
      title: `Project ID`,
    },

    parkId: {
      sql: `park_id`,
      type: `number`,
      title: `Park ID`,
    },

    projectName: {
      sql: `${CUBE}.project_name`,
      type: `string`,
      title: `Project Name`,
    },

    // Location
    location: {
      sql: `location`,
      type: `string`,
      title: `Location`,
    },

    districtId: {
      sql: `district_id`,
      type: `number`,
      title: `District ID`,
    },

    locationStateId: {
      sql: `location_state_id`,
      type: `number`,
      title: `Location State ID`,
    },

    solarStateId: {
      sql: `solar_state_id`,
      type: `number`,
      title: `Solar State ID`,
    },

    windStateId: {
      sql: `wind_state_id`,
      type: `number`,
      title: `Wind State ID`,
    },

    // Status and Type
    statusId: {
      sql: `status_id`,
      type: `number`,
      title: `Status ID`,
    },

    projectTypeId: {
      sql: `project_type_id`,
      type: `number`,
      title: `Project Type ID`,
    },

    projectCategoryId: {
      sql: `project_category_id`,
      type: `number`,
      title: `Project Category ID`,
    },

    scaleType: {
      sql: `scale_type`,
      type: `string`,
      title: `Scale Type`,
    },

    // Dates
    commissionedDate: {
      sql: `commisioned_date`,
      type: `time`,
      title: `Commissioned Date`,
    },

    estimatedCommissioningDate: {
      sql: `estimated_commisioning_date`,
      type: `time`,
      title: `Estimated Commissioning Date`,
    },

    ppaSigned: {
      sql: `ppa_signed`,
      type: `string`,
      title: `PPA Signed`,
    },

    ppaSignedDate: {
      sql: `ppa_signed_date`,
      type: `time`,
      title: `PPA Signed Date`,
    },

    // Organizations
    developerId: {
      sql: `developer_id`,
      type: `number`,
      title: `Developer ID`,
    },

    moduleSupplierId: {
      sql: `module_suppliers_id`,
      type: `number`,
      title: `Module Supplier ID`,
    },

    inverterSupplierId: {
      sql: `inverter_suppliers_id`,
      type: `number`,
      title: `Inverter Supplier ID`,
    },

    epcId: {
      sql: `epc_id`,
      type: `number`,
      title: `EPC ID`,
    },

    offtakerId: {
      sql: `offtaker_id`,
      type: `number`,
      title: `Offtaker ID`,
    },

    // Technical Specifications
    trackerType: {
      sql: `tracker_type`,
      type: `string`,
      title: `Tracker Type`,
    },

    dc: {
      sql: `dc`,
      type: `number`,
      title: `DC Capacity`,
    },

    contractedCapacity: {
      sql: `contracted_capacity`,
      type: `number`,
      title: `Contracted Capacity`,
    },

    noOfCycle: {
      sql: `no_of_cycle`,
      type: `number`,
      title: `Number of Cycles`,
    },

    // Financial
    tariff: {
      sql: `tariff`,
      type: `number`,
      title: `Tariff`,
    },

    vgf: {
      sql: `vgf`,
      type: `string`,
      title: `VGF`,
    },

    projectCost: {
      sql: `project_cost`,
      type: `number`,
      title: `Project Cost`,
    },

    fundingAmount: {
      sql: `funding_amount`,
      type: `number`,
      title: `Funding Amount`,
    },

    // Tender/Scheme
    tenderSchemeId: {
      sql: `tender_scheme_id`,
      type: `number`,
      title: `Tender Scheme ID`,
    },

    openAccess: {
      sql: `open_access`,
      type: `string`,
      title: `Open Access`,
    },

    // Entry metadata
    entryDate: {
      sql: `entry_date`,
      type: `time`,
      title: `Entry Date`,
    },

    // Derived dimensions
    commissioningYear: {
      sql: `EXTRACT(YEAR FROM ${CUBE}.commisioned_date)`,
      type: `number`,
      title: `Commissioning Year`,
    },

    commissioningQuarter: {
      sql: `CONCAT(EXTRACT(YEAR FROM ${CUBE}.commisioned_date), '-Q', EXTRACT(QUARTER FROM ${CUBE}.commisioned_date))`,
      type: `string`,
      title: `Commissioning Quarter`,
    },

    commissioningMonth: {
      sql: `TO_CHAR(${CUBE}.commisioned_date, 'YYYY-MM')`,
      type: `string`,
      title: `Commissioning Month`,
    },

    isOperational: {
      sql: `CASE WHEN ${CUBE}.status_id IN (SELECT id FROM public.statuses WHERE name = 'In-Operation') THEN 'Yes' ELSE 'No' END`,
      type: `string`,
      title: `Is Operational`,
    },

    projectAge: {
      sql: `EXTRACT(YEAR FROM AGE(CURRENT_DATE, ${CUBE}.commisioned_date))`,
      type: `number`,
      title: `Project Age (Years)`,
    },
  },

  measures: {
    // Count measures
    count: {
      type: `count`,
      title: `Number of Projects`,
    },

    // Solar capacity measures
    totalSolarCapacity: {
      sql: `solar_capacity`,
      type: `sum`,
      title: `Total Solar Capacity (MW)`,
      format: `number`,
    },

    averageSolarCapacity: {
      sql: `solar_capacity`,
      type: `avg`,
      title: `Average Solar Capacity (MW)`,
      format: `number`,
    },

    maxSolarCapacity: {
      sql: `solar_capacity`,
      type: `max`,
      title: `Maximum Solar Capacity (MW)`,
      format: `number`,
    },

    // Wind capacity measures
    totalWindCapacity: {
      sql: `wind_capacity`,
      type: `sum`,
      title: `Total Wind Capacity (MW)`,
      format: `number`,
    },

    // Storage capacity measures
    totalBessPowerCapacity: {
      sql: `bess_power_capacity`,
      type: `sum`,
      title: `Total BESS Power Capacity (MW)`,
      format: `number`,
    },

    totalBessStorageCapacity: {
      sql: `bess_storage_capacity`,
      type: `sum`,
      title: `Total BESS Storage Capacity (MWh)`,
      format: `number`,
    },

    // Combined renewable capacity
    totalRenewableCapacity: {
      sql: `COALESCE(solar_capacity, 0) + COALESCE(wind_capacity, 0)`,
      type: `sum`,
      title: `Total Renewable Capacity (MW)`,
      format: `number`,
    },

    // Status-based measures
    operationalProjects: {
      type: `count`,
      filters: [{ sql: `${CUBE}.status_id IN (SELECT id FROM public.statuses WHERE name = 'In-Operation')` }],
      title: `Operational Projects`,
    },

    operationalSolarCapacity: {
      sql: `solar_capacity`,
      type: `sum`,
      filters: [{ sql: `${CUBE}.status_id IN (SELECT id FROM public.statuses WHERE name = 'In-Operation')` }],
      title: `Operational Solar Capacity (MW)`,
      format: `number`,
    },

    underConstructionProjects: {
      type: `count`,
      filters: [{ sql: `${CUBE}.status_id IN (SELECT id FROM public.statuses WHERE name = 'Under Construction')` }],
      title: `Under Construction Projects`,
    },

    underConstructionSolarCapacity: {
      sql: `solar_capacity`,
      type: `sum`,
      filters: [{ sql: `${CUBE}.status_id IN (SELECT id FROM public.statuses WHERE name = 'Under Construction')` }],
      title: `Under Construction Solar Capacity (MW)`,
      format: `number`,
    },

    preConstructionProjects: {
      type: `count`,
      filters: [{ sql: `${CUBE}.status_id IN (SELECT id FROM public.statuses WHERE name = 'Pre Construction')` }],
      title: `Pre Construction Projects`,
    },

    preConstructionSolarCapacity: {
      sql: `solar_capacity`,
      type: `sum`,
      filters: [{ sql: `${CUBE}.status_id IN (SELECT id FROM public.statuses WHERE name = 'Pre Construction')` }],
      title: `Pre Construction Solar Capacity (MW)`,
      format: `number`,
    },

    underDevelopmentProjects: {
      type: `count`,
      filters: [{ sql: `${CUBE}.status_id IN (SELECT id FROM public.statuses WHERE name = 'Under Development')` }],
      title: `Under Development Projects`,
    },

    underDevelopmentSolarCapacity: {
      sql: `solar_capacity`,
      type: `sum`,
      filters: [{ sql: `${CUBE}.status_id IN (SELECT id FROM public.statuses WHERE name = 'Under Development')` }],
      title: `Under Development Solar Capacity (MW)`,
      format: `number`,
    },

    // Scale-based measures
    largeScaleProjects: {
      type: `count`,
      filters: [{ sql: `${CUBE}.scale_type = 'Large Scale'` }],
      title: `Large Scale Projects`,
    },

    largeScaleSolarCapacity: {
      sql: `solar_capacity`,
      type: `sum`,
      filters: [{ sql: `${CUBE}.scale_type = 'Large Scale'` }],
      title: `Large Scale Solar Capacity (MW)`,
      format: `number`,
    },

    // Policy-based measures
    centralProjects: {
      type: `count`,
      filters: [{ sql: `${CUBE}.project_category_id IN (SELECT id FROM public.project_categories WHERE name LIKE '%Central%')` }],
      title: `Central Projects`,
    },

    centralSolarCapacity: {
      sql: `solar_capacity`,
      type: `sum`,
      filters: [{ sql: `${CUBE}.project_category_id IN (SELECT id FROM public.project_categories WHERE name LIKE '%Central%')` }],
      title: `Central Solar Capacity (MW)`,
      format: `number`,
    },

    stateProjects: {
      type: `count`,
      filters: [{ sql: `${CUBE}.project_category_id IN (SELECT id FROM public.project_categories WHERE name LIKE '%State%')` }],
      title: `State Projects`,
    },

    stateSolarCapacity: {
      sql: `solar_capacity`,
      type: `sum`,
      filters: [{ sql: `${CUBE}.project_category_id IN (SELECT id FROM public.project_categories WHERE name LIKE '%State%')` }],
      title: `State Solar Capacity (MW)`,
      format: `number`,
    },

    openAccessProjects: {
      type: `count`,
      filters: [{ sql: `${CUBE}.open_access IS NOT NULL AND ${CUBE}.open_access != ''` }],
      title: `Open Access Projects`,
    },

    openAccessSolarCapacity: {
      sql: `solar_capacity`,
      type: `sum`,
      filters: [{ sql: `${CUBE}.open_access IS NOT NULL AND ${CUBE}.open_access != ''` }],
      title: `Open Access Solar Capacity (MW)`,
      format: `number`,
    },

    // Financial measures
    totalProjectCost: {
      sql: `project_cost`,
      type: `sum`,
      title: `Total Project Cost`,
      format: `currency`,
    },

    averageProjectCost: {
      sql: `project_cost`,
      type: `avg`,
      title: `Average Project Cost`,
      format: `currency`,
    },

    totalFundingAmount: {
      sql: `funding_amount`,
      type: `sum`,
      title: `Total Funding Amount`,
      format: `currency`,
    },

    averageTariff: {
      sql: `tariff`,
      type: `avg`,
      title: `Average Tariff`,
      format: `number`,
    },

    // KPI measures for dashboard
    totalPipeline: {
      sql: `solar_capacity`,
      type: `sum`,
      title: `Total Pipeline (MW)`,
      format: `number`,
    },

    totalInOperation: {
      sql: `solar_capacity`,
      type: `sum`,
      filters: [{ sql: `${CUBE}.status_id IN (SELECT id FROM public.statuses WHERE name = 'In-Operation')` }],
      title: `Total In-Operation (MW)`,
      format: `number`,
    },
  },

  segments: {
    operational: {
      sql: `${CUBE}.status_id IN (SELECT id FROM public.statuses WHERE name = 'In-Operation')`,
    },

    underConstruction: {
      sql: `${CUBE}.status_id IN (SELECT id FROM public.statuses WHERE name = 'Under Construction')`,
    },

    preConstruction: {
      sql: `${CUBE}.status_id IN (SELECT id FROM public.statuses WHERE name = 'Pre Construction')`,
    },

    underDevelopment: {
      sql: `${CUBE}.status_id IN (SELECT id FROM public.statuses WHERE name = 'Under Development')`,
    },

    largeScale: {
      sql: `${CUBE}.scale_type = 'Large Scale'`,
    },

    centralProjectsSegment: {
      sql: `${CUBE}.project_category_id IN (SELECT id FROM public.project_categories WHERE name LIKE '%Central%')`,
    },

    stateProjectsSegment: {
      sql: `${CUBE}.project_category_id IN (SELECT id FROM public.project_categories WHERE name LIKE '%State%')`,
    },

    hasStorage: {
      sql: `${CUBE}.bess_storage_capacity > 0`,
    },

    hybrid: {
      sql: `${CUBE}.solar_capacity > 0 AND ${CUBE}.wind_capacity > 0`,
    },
  },

  pre_aggregations: {
    stateMonthlyRollup: {
      measures: [
        ProjectTrackerMaster.count,
        ProjectTrackerMaster.totalSolarCapacity,
        ProjectTrackerMaster.totalWindCapacity,
        ProjectTrackerMaster.totalBessStorageCapacity,
        ProjectTrackerMaster.operationalSolarCapacity,
        ProjectTrackerMaster.underConstructionSolarCapacity,
      ],
      dimensions: [
        ProjectTrackerMaster.locationStateId,
        ProjectTrackerMaster.statusId,
        ProjectTrackerMaster.projectTypeId,
        ProjectTrackerMaster.commissioningMonth,
      ],
      timeDimension: ProjectTrackerMaster.commissionedDate,
      granularity: `month`,
      partitionGranularity: `year`,
      refreshKey: {
        every: `1 hour`,
      },
    },

    developerRollup: {
      measures: [
        ProjectTrackerMaster.count,
        ProjectTrackerMaster.totalSolarCapacity,
        ProjectTrackerMaster.totalWindCapacity,
        ProjectTrackerMaster.averageProjectCost,
      ],
      dimensions: [
        ProjectTrackerMaster.developerId,
        ProjectTrackerMaster.statusId,
        ProjectTrackerMaster.projectTypeId,
      ],
      refreshKey: {
        every: `1 hour`,
      },
    },

    kpiRollup: {
      measures: [
        ProjectTrackerMaster.totalPipeline,
        ProjectTrackerMaster.totalInOperation,
        ProjectTrackerMaster.preConstructionSolarCapacity,
        ProjectTrackerMaster.underDevelopmentSolarCapacity,
        ProjectTrackerMaster.centralSolarCapacity,
        ProjectTrackerMaster.stateSolarCapacity,
        ProjectTrackerMaster.openAccessSolarCapacity,
      ],
      refreshKey: {
        every: `1 hour`,
      },
    },
  },
});