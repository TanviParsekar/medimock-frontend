import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Paper,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";

const profileSchema = z
  .object({
    name: z.string().optional(),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .optional()
      .or(z.literal("")),
    currentPassword: z.string().optional(),
  })
  .refine((data) => data.name || data.password, {
    message: "No changes to update",
  })
  .refine(
    (data) => {
      if (data.password) {
        return !!data.currentPassword;
      }
      return true;
    },
    {
      message: "Current password is required",
      path: ["currentPassword"],
    }
  );

type ProfileFormData = z.infer<typeof profileSchema>;

export default function Profile() {
  const { user, token, logout, setUser } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? "",
      password: "",
      currentPassword: "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({ name: user.name, password: "", currentPassword: "" });
    }
  }, [user, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    const trimmedName = data.name?.trim();

    const newPassword = data.password?.trim();
    const currentPassword = data.currentPassword?.trim();

    const updates: {
      name?: string;
      password?: string;
      currentPassword?: string;
    } = {};

    if (trimmedName && trimmedName !== user?.name) {
      updates.name = trimmedName;
    }
    if (newPassword) {
      if (!currentPassword) {
        toast.error("Please enter your current password.");
        return;
      }

      if (newPassword === currentPassword) {
        toast.error("Enter a new password different from the current one.");
        return;
      }

      updates.password = newPassword;
      updates.currentPassword = currentPassword;
    }

    if (Object.keys(updates).length === 0) {
      toast("No changes to update");
      return;
    }

    try {
      const res = await axios.patch(
        "http://localhost:5000/api/users/me",
        updates,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const updatedUser = res.data;

      toast.success("Profile updated successfully");

      if (updates.password) {
        logout();
        toast("Please log in again with your new password");
      } else {
        setUser(updatedUser);

        reset({ name: updatedUser.name, password: "", currentPassword: "" });
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const msg = err.response?.data?.error;

        if (msg === "Invalid current password") {
          toast.error("Enter correct password");
        } else if (
          msg === "New password must be different from the current one"
        ) {
          toast.error("Enter a new password");
        } else if (msg === "No changes to update") {
          toast.error("No changes to update");
        } else {
          toast.error("Failed to update profile");
        }
      } else {
        console.error("Unexpected error:", err);
        toast.error("Something went wrong");
      }
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete("http://localhost:5000/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Account deleted successfully");
      logout();
    } catch (err) {
      console.error("Delete error", err);
      toast.error("Failed to delete account");
    }
  };

  if (!user) return <CircularProgress sx={{ mt: 4 }} />;

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 12, p: 2 }}>
      <Typography sx={{ mb: 2 }}>
        <span style={{ color: "#888" }}>My Profile &gt; </span>
        <span style={{ color: "#000", fontWeight: 600 }}>Edit Profile</span>
      </Typography>
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
          My Profile
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Box mb={4} mt={4}>
            <Typography variant="subtitle1" fontWeight="bold">
              📧 Email Address
            </Typography>
            <TextField fullWidth margin="none" value={user.email} disabled />
          </Box>

          <Box mb={4} mt={3}>
            <Typography variant="subtitle1" fontWeight="bold">
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

          {/* Current Password */}
          <Box mb={4} mt={3}>
            <Typography variant="subtitle1" fontWeight="bold">
              🔑 Current Password
            </Typography>
            <TextField
              placeholder="Current Password"
              type={showCurrentPassword ? "text" : "password"}
              fullWidth
              margin="none"
              {...register("currentPassword")}
              error={!!errors.currentPassword}
              helperText={errors.currentPassword?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowCurrentPassword((prev) => !prev)}
                      edge="end"
                    >
                      {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* New Password */}
          <Box mb={3} mt={3}>
            <Typography variant="subtitle1" fontWeight="bold">
              🔒 New Password
            </Typography>
            <TextField
              placeholder="New Password"
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
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {errors?.root && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {errors.root.message}
            </Typography>
          )}

          <Box display="flex" gap={4}>
            <Button
              variant="contained"
              type="submit"
              fullWidth
              sx={{ mt: 2, textTransform: "capitalize" }}
              disabled={isSubmitting}
            >
              {isSubmitting ? <CircularProgress size={24} /> : "Update Profile"}
            </Button>

            <Button
              variant="contained"
              color="error"
              fullWidth
              sx={{ mt: 2, textTransform: "capitalize" }}
              onClick={() => setOpenDialog(true)}
            >
              Delete Account
            </Button>
          </Box>
        </form>
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete your account? This action is
            irreversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={() => {
              setOpenDialog(false);
              handleDelete();
            }}
            color="error"
          >
            Yes, Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
