import { BarChart } from "@mui/x-charts/BarChart";
import { Box, Typography } from "@mui/material";

interface ChartPoint {
  date: string;
  count: number;
}

export default function SymptomChart({ data }: { data: ChartPoint[] }) {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography
        variant="h6"
        gutterBottom
        fontFamily="roboto serif"
        fontWeight="bold"
      >
        📊 Monthly Symptom Reports
      </Typography>
      <BarChart
        xAxis={[
          { label: "Month", scaleType: "band", data: data.map((d) => d.date) },
        ]}
        yAxis={[{ label: "Symptom Count" }]}
        series={[
          {
            data: data.map((d) => d.count),
            label: "Reports",
          },
        ]}
        width={700}
        height={300}
        slotProps={{
          bar: {
            rx: 7,
            ry: 9,
          },
        }}
      />
    </Box>
  );
}
