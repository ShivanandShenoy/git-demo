cube(`EnergyKPIs`, {
  extends: EnergyInstallations,

  title: `Energy KPIs`,
  description: `Key Performance Indicators for Energy Installations`,

  measures: {
    // Total Pipeline
    totalPipeline: {
      sql: `solar_capacity`,
      type: `sum`,
      title: `Total Pipeline (MW)`,
      filters: [{ sql: `${CUBE}.status_id IN (SELECT id FROM public.statuses WHERE filter = 'true')` }],
      // No filters - includes all projects
    },

    // Project Stages
    totalInOperation: {
      sql: `solar_capacity`,
      type: `sum`,
      title: `Total In-Operation (MW)`,
      filters: [{ sql: `${CUBE}.status_id IN (SELECT id FROM public.statuses WHERE name = 'In-Operation')` }],
    },

    preConstruction: {
      sql: `solar_capacity`,
      type: `sum`,
      title: `Pre Construction (MW)`,
      filters: [{ sql: `${CUBE}.status_id IN (SELECT id FROM public.statuses WHERE name = 'Pre Construction')` }],
    },

    underDevelopment: {
      sql: `solar_capacity`,
      type: `sum`,
      title: `Under Development (MW)`,
      filters: [{ sql: `${CUBE}.status_id IN (SELECT id FROM public.statuses WHERE name = 'Under Development')` }],
    },

    underConstructionCapacity: {
      sql: `solar_capacity`,
      type: `sum`,
      title: `Under Construction (MW)`,
      filters: [{ sql: `${CUBE}.status_id IN (SELECT id FROM public.statuses WHERE name = 'Under Construction')` }],
    },

    // Project Categories by Status
    centralInOperation: {
      sql: `solar_capacity`,
      type: `sum`,
      title: `Central In-Operation (MW)`,
      filters: [
        {
          sql: `${CUBE}.status_id IN (SELECT id FROM public.statuses WHERE name = 'In-Operation') AND ${CUBE}.project_category_id IN (SELECT id FROM public.project_categories WHERE name = 'Central')`,
        },
      ],
    },

    openAccessInOperation: {
      sql: `solar_capacity`,
      type: `sum`,
      title: `Open Access In-Operation (MW)`,
      filters: [
        {
          sql: `${CUBE}.status_id IN (SELECT id FROM public.statuses WHERE name = 'In-Operation') AND ${CUBE}.project_category_id IN (SELECT id FROM public.project_categories WHERE name = 'Open Access')`,
        },
      ],
    },

    stateInOperation: {
      sql: `solar_capacity`,
      type: `sum`,
      title: `State In-Operation (MW)`,
      filters: [
        {
          sql: `${CUBE}.status_id IN (SELECT id FROM public.statuses WHERE name = 'In-Operation') AND ${CUBE}.project_category_id IN (SELECT id FROM public.project_categories WHERE name = 'State')`,
        },
      ],
    },

    // Growth metrics
    weeklyGrowth: {
      sql: `
        CASE 
          WHEN (SELECT SUM(solar_capacity) 
                FROM public.solar_chart_view 
                WHERE commisioned_date >= CURRENT_DATE - INTERVAL '14 days' 
                  AND commisioned_date < CURRENT_DATE - INTERVAL '7 days') > 0
          THEN ((SELECT SUM(solar_capacity) 
                 FROM public.solar_chart_view 
                 WHERE commisioned_date >= CURRENT_DATE - INTERVAL '7 days') - 
                (SELECT SUM(solar_capacity) 
                 FROM public.solar_chart_view 
                 WHERE commisioned_date >= CURRENT_DATE - INTERVAL '14 days' 
                   AND commisioned_date < CURRENT_DATE - INTERVAL '7 days')) * 100.0 / 
                (SELECT SUM(solar_capacity) 
                 FROM public.solar_chart_view 
                 WHERE commisioned_date >= CURRENT_DATE - INTERVAL '14 days' 
                   AND commisioned_date < CURRENT_DATE - INTERVAL '7 days')
          ELSE 0 
        END
      `,
      type: `number`,
      title: `Weekly Growth (%)`,
    },

    // Count metrics
    totalProjects: {
      type: `count`,
      title: `Total Projects`,
    },

    completedProjectsCount: {
      type: `count`,
      filters: [{ sql: `${CUBE}.status_id IN (SELECT id FROM public.statuses WHERE name = 'Completed')` }],
      title: `Completed Projects Count`,
    },
  },
});
