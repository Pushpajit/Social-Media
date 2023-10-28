import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Navigate, useNavigate } from 'react-router-dom';
import {PUBLIC_URL} from '../PUBLIC_URL.js';


function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link className='hover:text-blue-400' color="inherit" href="https://github.com/Pushpajit" target='_'>
        Pushpajit Biswas
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

// Register a user backend call.
async function getRegistered(details) {
  // console.log(details);
  const endpoint = `${PUBLIC_URL}/auth/register`;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      'Content-type': 'application/json'
    },

    body: JSON.stringify(details)
  });

  const user = await res.json();

  if(user.code === 400){
    alert(user.statusText);
  
  }

  return user;


}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function SignUp({setIsAuthenticated}) {
  const navigate = useNavigate();

  const [err, setErr] = React.useState({
    email: false,
    pass: false,
    first: false,
    last: false
  });

  // Register User
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    if (!data.get('email') || !data.get('password') || data.get('firstname') || data.get('lastname')) {
      setErr({
        email: !Boolean(data.get('email')),
        pass: !Boolean(data.get('password')),
        first: !Boolean(data.get('firstname')),
        last: !Boolean(data.get('lastname'))
      });

      alert("Please provide data for all fields!");
      return;
    }

    const details = {
      username: `${data.get('firstName')} ${data.get('lastName')}`,
      email: data.get('email'),
      password: data.get('password')
    }

    setErr({
      email: false,
      pass: false,
      first: false,
      last: false
    });

    const user = await getRegistered(details);

    if(user?.user){
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(user.user));
      alert("Successfully Registered!");
      navigate("/");
    }

  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox value="allowExtraEmails" color="primary" />}
                  label="I want to receive inspiration, marketing promotions and updates via email."
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link onClick={(e) => navigate("/signin")} href="#" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}