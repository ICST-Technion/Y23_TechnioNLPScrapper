export const NEGATIVE = 0;
export const NEUTRAL = 1;
export const POSITIVE = 2;


export function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

// chart.js options
export const optionsStacked = {
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
export const options = {
  plugins: {
      title: {
      display: true,
      text: 'Chart.js Bar Chart',
      },
  },
  responsive: true,
  scales: {
      x: {
      stacked: false,
      },
      y: {
      stacked: false,
      },
  },
};
