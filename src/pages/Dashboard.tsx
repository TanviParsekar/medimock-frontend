import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Divider,
  CircularProgress,
  Card,
  CardContent,
} from "@mui/material";
import axios from "../utils/axios";
import SymptomChart from "../components/SymptomChart";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { format, isToday } from "date-fns";

interface Log {
  id: string;
  input: string;
  aiResponse: string;
  createdAt: string;
}

interface ChartPoint {
  date: string;
  count: number;
}

export default function Dashboard() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [loadingChart, setLoadingChart] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // ─────────────────────────────────────
  // Fetches chart (monthwise data)
  useEffect(() => {
    axios
      .get("/symptoms/analytics")
      .then((res) => setChartData(res.data))
      .catch((err) => console.error("Chart error", err))
      .finally(() => setLoadingChart(false));
  }, []);

  // ─────────────────────────────────────
  // Fetches logs for selected date (default: today)
  useEffect(() => {
    const formatted = format(selectedDate, "yyyy-MM-dd");

    setLoadingLogs(true);
    axios
      .get(`/symptoms/logs?date=${formatted}`)
      .then((res) => setLogs(res.data))
      .catch((err) => console.error("Logs error", err))
      .finally(() => setLoadingLogs(false));
  }, [selectedDate]);

  return (
    <Box sx={{ maxWidth: 1100, mx: "auto", mt: 9, p: 2 }}>
      {/* ───────────── Chart ───────────── */}
      <Card sx={{ borderRadius: 2, mb: 4 }}>
        <CardContent>
          {loadingChart ? (
            <CircularProgress />
          ) : (
            <SymptomChart data={chartData} />
          )}
        </CardContent>
      </Card>

      {/* ───────────── Calendar + Logs ───────────── */}
      <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
        {/* Calendar */}
        <Card
          sx={{
            borderRadius: 2,
            minWidth: 300,
            height: 400,
            overflow: "hidden",
          }}
        >
          <CardContent>
            <Typography
              variant="h6"
              gutterBottom
              fontFamily="roboto serif"
              fontWeight="bold"
            >
              📅 Calendar
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateCalendar
                value={selectedDate}
                onChange={(date) => date && setSelectedDate(date)}
              />
            </LocalizationProvider>
          </CardContent>
        </Card>

        {/* Logs List */}
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h6"
            gutterBottom
            fontFamily="roboto serif"
            fontWeight="bold"
          >
            🧾 Symptom Logs -{" "}
            {isToday(selectedDate)
              ? "Today"
              : format(selectedDate, "MMMM d, yyyy")}
          </Typography>

          {loadingLogs ? (
            <CircularProgress sx={{ mt: 2 }} />
          ) : logs.length === 0 ? (
            <Typography sx={{ mt: 2 }} color="text.secondary">
              No logs found.
            </Typography>
          ) : (
            logs.map((log) => (
              <Paper key={log.id} sx={{ p: 2, my: 2, boxShadow: 2 }}>
                <Typography fontFamily="playfair display" fontWeight="bold">
                  You said:
                </Typography>
                <Typography fontFamily="tinos, serif">{log.input}</Typography>

                <Divider sx={{ my: 1 }} />

                <Typography fontFamily="playfair display" fontWeight="bold">
                  AI Response:
                </Typography>
                <Typography fontFamily="tinos, serif">
                  {log.aiResponse}
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  {new Date(log.createdAt).toLocaleString()}
                </Typography>
              </Paper>
            ))
          )}
        </Box>
      </Box>
    </Box>
  );
}
