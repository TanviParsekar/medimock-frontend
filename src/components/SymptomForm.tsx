import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Paper,
} from "@mui/material";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "../utils/axios";
import { toast } from "react-hot-toast";

const schema = z.object({
  input: z.string().min(10, "Please describe your symptoms in more detail."),
});

type FormData = z.infer<typeof schema>;

export default function SymptomForm() {
  const [aiResponse, setAiResponse] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await axios.post("/symptoms", data);
      setAiResponse(res.data.summary);
      reset();
    } catch (err) {
      console.error("Error submitting symptom:", err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 15, p: 2 }}>
      <Paper
        elevation={4}
        sx={{
          p: 3,
          border: "1px solid #ccc",
          borderRadius: 2,
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          align="center"
          fontWeight="700"
          fontFamily="amarante, serif"
        >
          Welcome to MediMock
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            placeholder="Enter your Symptoms"
            multiline
            rows={2}
            fullWidth
            margin="dense"
            {...register("input")}
            error={!!errors.input}
            helperText={errors.input?.message}
          />

          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            sx={{ mt: 2, textTransform: "capitalize" }}
          >
            {isSubmitting ? <CircularProgress size={22} /> : "Lets Go"}
          </Button>
        </form>
      </Paper>

      {aiResponse && (
        <Box mt={4}>
          <Paper
            elevation={4}
            sx={{
              p: 3,
              border: "1px solid #ccc",
              borderRadius: 2,
            }}
          >
            <Typography
              variant="h6"
              fontFamily="roboto, serif"
              fontWeight="bold"
            >
              Possible Conditions:
            </Typography>
            <Typography fontFamily="roboto, serif">{aiResponse}</Typography>
          </Paper>
        </Box>
      )}
    </Box>
  );
}
