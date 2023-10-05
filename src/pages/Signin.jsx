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
import { useNavigate } from 'react-router-dom';
import { PUBLIC_URL } from '../PUBLIC_URL';


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


async function getSignedIn(details) {
    // console.log(details);
    const endpoint = `${PUBLIC_URL}/auth/login`;

    const res = await fetch(endpoint, {
        method: "POST",
        headers: {
            'Content-type': 'application/json'
        },

        body: JSON.stringify(details)
    });

    const user = await res.json();

    return user;
}



// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function SignIn({ children, setIsAuthenticated }) {
    const navigate = useNavigate();

    const [err, setErr] = React.useState({
        email: false,
        pass: false
    });


    // Authentication Section.
    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        if (!data.get('email') || !data.get('password')) {
            setErr({
                email: !Boolean(data.get('email')),
                pass: !Boolean(data.get('password'))
            });
            alert("Email or Password field should not be empty!");
            return;
        }
        
        const details = {
            email: data.get('email'),
            password: data.get('password'),
        }

        setErr({
            email: false,
            pass: false
        });
        

        alert("Hold your horses!");
        const user = await getSignedIn(details);

        // console.log(user);

        if (user.code === 200){
            alert("Successfully Signed In!");
            localStorage.setItem("user", JSON.stringify(user.user));
            localStorage.setItem("post", JSON.stringify(0));
            localStorage.setItem("theme", JSON.stringify("light"));
            setIsAuthenticated(true);
            navigate("/");
            
        }
        else{
            alert(user.status);
            navigate("/signin");
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
                        Sign in
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            error={err.email}
                            onChange={() => setErr({
                                email: false,
                                pass: false
                            })}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            error={err.pass}
                            onChange={() => setErr({
                                email: false,
                                pass: false
                            })}
                        />
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary" />}
                            label="Remember me"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2">
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link onClick={(e) => navigate("/signup")} href="#" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 8, mb: 4 }} />
            </Container>
        </ThemeProvider>
    );
}