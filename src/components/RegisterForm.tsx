import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "../utils/axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const schema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

export default function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await axios.post("/auth/register", {
        name: data.name,
        email: data.email,
        password: data.password,
      });
      toast.success("Registered successfully!");
      navigate("/login");
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
        toast.error(err.message);
      } else {
        console.error("Unexpected error", err);
        toast.error("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 8, p: 2 }}>
      <Paper
        elevation={4}
        sx={{
          p: 4,
          border: "1px solid #ccc",
          borderRadius: 2,
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          align="center"
          fontSize={40}
          fontFamily="roboto serif"
          fontWeight="bold"
        >
          Register
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box mt={3} mb={2}>
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              fontFamily="tinos, serif"
            >
              🙍 Full Name
            </Typography>
            <TextField
              placeholder="Name"
              fullWidth
              margin="none"
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
          </Box>
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
              type="email"
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
              autoComplete="new-password"
              fullWidth
              margin="none"
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
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
          </Box>
          <Box mb={3} mt={3}>
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              fontFamily="tinos, serif"
            >
              🔒 Confirm Password
            </Typography>

            <TextField
              placeholder="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              fullWidth
              margin="none"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              {...register("confirmPassword")}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
            />
          </Box>

          <Box display="flex" justifyContent="center">
            <Button
              variant="contained"
              type="submit"
              disabled={loading}
              sx={{ mt: 2, fontSize: 15 }}
            >
              {loading ? "Registering..." : "Register"}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
