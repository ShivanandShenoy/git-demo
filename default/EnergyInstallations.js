cube(`EnergyInstallations`, {
  sql: `
    SELECT *
    FROM public.project_tracker_masters
    WHERE status_id IN (
      SELECT id FROM public.statuses WHERE filter = true
    ) and project_type_id IN (
      SELECT project_type_sub_tracker_masters.project_type_id FROM project_type_sub_tracker_masters
      JOIN sub_tracker_masters ON sub_tracker_masters.id = project_type_sub_tracker_masters.sub_tracker_master_id 
      AND sub_tracker_masters.name = 'Energy Storage'
    )
  `,
  // sql_table: `public.solar_wind_hybrid_chart_view`,

  data_source: `default`,

  title: `Energy Installations`,
  description: `Energy installation projects with capacity, status, and location information`,

  joins: {
    States: {
      relationship: `belongsTo`,
      sql: `${CUBE}.solar_state_id = ${States}.id`
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
    
  },

  dimensions: {
    id: {
      sql: `id`,
      type: `number`,
      primary_key: true,
    },

    statusId: {
      sql: `status_id`,
      type: `number`,
      title: `Status ID`,
    },

    status: {
      sql: `(SELECT name FROM public.statuses WHERE id = ${CUBE}.status_id AND filter = true)`,
      type: `string`,
      title: `Status`,
    },

    commissioning_date: {
      sql: `${CUBE}.commisioned_date`,
      type: `time`,
      title: `Commissioning Date`,
    },

    developerId: {
      sql: `developer_id`,
      type: `number`,
      title: `Developer ID`,
    },

    developer: {
      sql: `(SELECT name FROM public.firms WHERE id = ${CUBE}.developer_id)`,
      type: `string`,
      title: `Developer`,
    },

    projectCategoryId: {
      sql: `project_category_id`,
      type: `number`,
      title: `Project Category ID`,
    },

    project_category: {
      sql: `(SELECT name FROM public.project_categories WHERE id = ${CUBE}.project_category_id)`,
      type: `string`,
      title: `Project Category`,
    },

    projectTypeId: {
      sql: `project_type_id`,
      type: `number`,
      title: `Project Type ID`,
    },

    project_type: {
      sql: `(SELECT name FROM public.project_types WHERE id = ${CUBE}.project_type_id)`,
      type: `string`,
      title: `Project Type`,
    },

    stateId: {
      sql: `solar_state_id`,
      type: `number`,
      title: `State ID`,
    },

    state: {
      sql: `(SELECT name FROM public.states WHERE id = ${CUBE}.solar_state_id)`,
      type: `string`,
      title: `State`,
    },


    // Additional dimensions
    location: {
      sql: `${CUBE}.location`,
      type: `string`,
      title: `Location`,
    },

    project_name: {
      sql: `${CUBE}.project_name`,
      type: `string`,
      title: `Project Name`,
    },

    // Derived dimensions for better analysis
    commissioning_year: {
      sql: `EXTRACT(YEAR FROM ${CUBE}.commisioned_date)`,
      type: `number`,
      title: `Commissioning Year`,
    },

    commissioning_quarter: {
      sql: `EXTRACT(QUARTER FROM ${CUBE}.commisioned_date)`,
      type: `string`,
      title: `Commissioning Quarter`,
    },

    commissioning_month: {
      sql: `TO_CHAR(${CUBE}.commisioned_date, 'YYYY-MM')`,
      type: `string`,
      title: `Commissioning Month`,
    },
  },

  measures: {
    count: {
      type: `count`,
      title: `Number of Projects`,
    },

    totalCapacity: {
      sql: `solar_capacity`,
      type: `sum`,
      title: `Total Solar Capacity (MW)`,
      format: `number`,
      filters: [{ sql: `${CUBE}.status_id IN (SELECT id FROM public.statuses WHERE filter = 'true')` }],
    },

    averageCapacity: {
      sql: `solar_capacity`,
      type: `avg`,
      title: `Average Project Capacity (MW)`,
      format: `number`,
    },

    maxCapacity: {
      sql: `solar_capacity`,
      type: `max`,
      title: `Largest Project Capacity (MW)`,
      format: `number`,
    },

    minCapacity: {
      sql: `solar_capacity`,
      type: `min`,
      title: `Smallest Project Capacity (MW)`,
      format: `number`,
    },

    // Additional capacity measures
    windCapacity: {
      sql: `wind_capacity`,
      type: `sum`,
      title: `Total Wind Capacity (MW)`,
      format: `number`,
    },

    bessCapacity: {
      sql: `bess_storage_capacity`,
      type: `sum`,
      title: `Total BESS Storage Capacity (MWh)`,
      format: `number`,
    },

    // Calculated measures
    completedProjects: {
      type: `count`,
      filters: [{ sql: `${CUBE}.status_id IN (SELECT id FROM public.statuses WHERE name = 'In-Operation')` }],
      title: `In-Operation Projects`,
    },

    underConstructionProjects: {
      type: `count`,
      filters: [{ sql: `${CUBE}.status_id IN (SELECT id FROM public.statuses WHERE name = 'Under Construction')` }],
      title: `Under Construction Projects`,
    },

    completedCapacity: {
      sql: `solar_capacity`,
      type: `sum`,
      filters: [{ sql: `${CUBE}.status_id IN (SELECT id FROM public.statuses WHERE name = 'In-Operation')` }],
      title: `In-Operation Capacity (MW)`,
    },

    underConstructionCapacity: {
      sql: `solar_capacity`,
      type: `sum`,
      filters: [{ sql: `${CUBE}.status_id IN (SELECT id FROM public.statuses WHERE name = 'Under Construction')` }],
      title: `Under Construction Capacity (MW)`,
    },

    // Additional measures for KPIs
    preConstructionProjects: {
      type: `count`,
      filters: [{ sql: `${CUBE}.status_id IN (SELECT id FROM public.statuses WHERE name = 'Pre Construction')` }],
      title: `Pre Construction Projects`,
    },

    preConstructionCapacity: {
      sql: `solar_capacity`,
      type: `sum`,
      filters: [{ sql: `${CUBE}.status_id IN (SELECT id FROM public.statuses WHERE name = 'Pre Construction')` }],
      title: `Pre Construction Capacity (MW)`,
    },

    underDevelopmentProjects: {
      type: `count`,
      filters: [{ sql: `${CUBE}.status_id IN (SELECT id FROM public.statuses WHERE name = 'Under Development')` }],
      title: `Under Development Projects`,
    },

    underDevelopmentCapacity: {
      sql: `solar_capacity`,
      type: `sum`,
      filters: [{ sql: `${CUBE}.status_id IN (SELECT id FROM public.statuses WHERE name = 'Under Development')` }],
      title: `Under Development Capacity (MW)`,
    },
  },

  segments: {
    inOperationSegment: {
      sql: `${CUBE}.status_id IN (SELECT id FROM public.statuses WHERE name = 'In-Operation')`,
    },

    underConstructionSegment: {
      sql: `${CUBE}.status_id IN (SELECT id FROM public.statuses WHERE name = 'Under Construction')`,
    },

    preConstructionSegment: {
      sql: `${CUBE}.status_id IN (SELECT id FROM public.statuses WHERE name = 'Pre Construction')`,
    },

    underDevelopmentSegment: {
      sql: `${CUBE}.status_id IN (SELECT id FROM public.statuses WHERE name = 'Under Development')`,
    },

    largeScale: {
      sql: `${CUBE}.solar_capacity >= 100`,
    },

    mediumScale: {
      sql: `${CUBE}.solar_capacity >= 10 AND ${CUBE}.solar_capacity < 100`,
    },

    smallScale: {
      sql: `${CUBE}.solar_capacity < 10`,
    },

    solarOnly: {
      sql: `${CUBE}.solar_capacity > 0 AND COALESCE(${CUBE}.wind_capacity, 0) = 0`,
    },

    hybrid: {
      sql: `${CUBE}.solar_capacity > 0 AND ${CUBE}.wind_capacity > 0`,
    },
  },

  pre_aggregations: {
    monthlyRollup: {
      measures: [
        EnergyInstallations.count,
        EnergyInstallations.totalCapacity,
        EnergyInstallations.completedProjects,
        EnergyInstallations.underConstructionProjects,
        EnergyInstallations.preConstructionProjects,
        EnergyInstallations.underDevelopmentProjects,
      ],
      dimensions: [
        EnergyInstallations.state,
        EnergyInstallations.statusId,
        EnergyInstallations.commissioning_month,
      ],
      timeDimension: EnergyInstallations.commissioning_date,
      granularity: `month`,
      partitionGranularity: `year`,
      refreshKey: {
        every: `1 hour`,
      },
    },

    stateRollup: {
      measures: [
        EnergyInstallations.count,
        EnergyInstallations.totalCapacity,
        EnergyInstallations.averageCapacity,
        EnergyInstallations.completedCapacity,
        EnergyInstallations.underConstructionCapacity,
        EnergyInstallations.preConstructionCapacity,
        EnergyInstallations.underDevelopmentCapacity,
      ],
      dimensions: [
        EnergyInstallations.state,
        EnergyInstallations.statusId,
        EnergyInstallations.projectTypeId,
      ],
      refreshKey: {
        every: `1 hour`,
      },
    },

    developerRollup: {
      measures: [
        EnergyInstallations.count,
        EnergyInstallations.totalCapacity,
        EnergyInstallations.completedProjects,
        EnergyInstallations.underConstructionProjects,
      ],
      dimensions: [
        EnergyInstallations.developer,
        EnergyInstallations.status,
      ],
      refreshKey: {
        every: `1 hour`,
      },
    },
  },
});
