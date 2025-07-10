import { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof schema>;

export default function LoginForm() {
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        data
      );
      const { token, user } = res.data;
      login(token, user);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "Login failed");
      } else {
        setError("Something went wrong");
      }
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 12, p: 2 }}>
      <Paper
        elevation={4}
        sx={{
          p: 4,
          border: "1px solid #ccc",
          borderRadius: 2,
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          align="center"
          fontSize={40}
          fontFamily="roboto serif"
          fontWeight="bold"
        >
          Login
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Box mb={2} mt={3}>
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              fontFamily="tinos, serif"
            >
              📧 Email Address
            </Typography>
            <TextField
              placeholder="Email"
              fullWidth
              margin="none"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          </Box>

          <Box mb={2} mt={3}>
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              fontFamily="tinos, serif"
            >
              🔑 Password
            </Typography>
            <TextField
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              fullWidth
              margin="none"
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {error && (
            <Typography color="error" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}

          <Box display="flex" justifyContent="center">
            <Button
              type="submit"
              variant="contained"
              sx={{ mt: 2, fontSize: 15 }}
            >
              Login
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
