
export function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

// chart.js options
export const options = {
    plugins: {
        title: {
        display: true,
        text: 'Chart.js Bar Chart - Stacked',
        },
    },
    responsive: true,
    scales: {
        x: {
        stacked: true,
        },
        y: {
        stacked: true,
        },
    },
};
