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
import axios from 'axios';
import { FE_SERVER } from './Helpers/consts';
import Cookies from 'universal-cookie';

export interface SignInProps {
   setSignedIn:React.Dispatch<React.SetStateAction<boolean>>;
}

export const SignIn: React.FC<SignInProps> = ({setSignedIn}) => {

    const theme = createTheme();

    const [Errormsg, setErrormsg] = React.useState<string>("");

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const email = data.get('email');
      const password = data.get('password');
      if(email === "" || password === ""
      || email === null ||password === null){
          setErrormsg("Please fill out all fields");
          return;
      }
      else if(password!.toString()?.length < 8){
          setErrormsg("Password must be at least 8 characters");
          return;
      }
      else if(email!.toString().length < 4){
          setErrormsg("Username or email must be at least 4 characters");
          return;
      }
      else{
          try{
              let res = await axios.post(FE_SERVER + "/login", {
                  email: email,
                  password: password,
                  username: email
              })
              setErrormsg("");
              alert("Successfully logged in!");
              const cookies = new Cookies();
              cookies.set("token", res.data.token);
              setSignedIn(true);
          }
          catch(err: any){
              let message = ""
              if(err.response && err.response.data && err.response.data.message)
                  message = err.response.data.message;
              else if(err.message)
                  message = err.message;
              else
                  message = "Unknown error";
  
              setErrormsg(message);
              return;
          }
      }
    };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: -1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            Welcome!
          </Typography>
          <Typography component="h1" variant="h5">
            Please Sign In to Continue
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Username or Email Address"
              name="email"
              autoComplete="email"
              autoFocus
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
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Typography component="h5" variant="body1" color="red" hidden={Errormsg.length === 0}>
                {Errormsg}
            </Typography>
            <Grid container>
              <Grid item>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}