import { Grid, Paper, Typography } from '@mui/material';

const DashboardViewer = () => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Paper elevation={3} style={{ padding: '20px' }}>
          <Typography variant="h6">Total Ponts Inspectés</Typography>
          <Typography variant="h4">150</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper elevation={3} style={{ padding: '20px' }}>
          <Typography variant="h6">Ponts en Bon État</Typography>
          <Typography variant="h4" style={{ color: 'green' }}>120</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper elevation={3} style={{ padding: '20px' }}>
          <Typography variant="h6">Ponts à Réhabiliter</Typography>
          <Typography variant="h4" style={{ color: 'red' }}>30</Typography>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default DashboardViewer;