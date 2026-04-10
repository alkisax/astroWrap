// frontend\src\authLogin\loginBackend\LoginBackend.tsx

import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { UserAuthContext } from "../context/UserAuthContext";

interface Props {
  url: string;
}

const LoginBackend = ({ url }: Props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { setUser, setIsLoading } = useContext(UserAuthContext);

  const handleTogglePassword = () => {
    setShowPassword(prev => !prev);
  };

  const handleSubmitBackend = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true)

    try {
      const response = await axios.post(`${url}/api/sqlite/auth`, {
        username,
        password,
      });

      console.log("Login successful:", response.data);

      // store token
      const token = response.data.data.token;
      // console.log("backend login token: ", token);
      localStorage.setItem("token", token);

      // decode and update context
      const user = response.data.data.user;

      setUser({
        _id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        roles: [user.role],
        hasPassword: true,
        provider: "backend",
      });

      navigate("/user");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false)
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmitBackend}
      sx={{
        maxWidth: 400,
        margin: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        mt: 5,
      }}
    >
      <TextField
        id="backend-login-username"
        label="Username"
        variant="outlined"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        fullWidth
        autoComplete="email"
      />

      <TextField
        id="backend-login-password"
        label="Password"
        type={showPassword ? "text" : "password"}
        variant="outlined"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        autoComplete="current-password"
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleTogglePassword} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />

      <Button
        id="backend-form-submit-btn"
        type="submit" variant="contained" color="primary">
        Login
      </Button>

      <Typography variant="body2" align="center">
        Don’t have an account? <Link id="backend-form-register-link" to="/register-backend">Register</Link>
      </Typography>
      <Typography variant="caption" align="center">
        Powered by SQLite
      </Typography>
    </Box>
  );
};

export default LoginBackend;
