import { Box, Typography } from "@mui/material";

export interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
  }

/*
* creates the tab panel for the chart.js bar chart
* each panel will have a different chart
*/
export function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    
    return (
        <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
        >
        {value === index && (
            <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
            </Box>
        )}
        </div>
    );
}
        