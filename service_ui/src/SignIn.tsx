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
import {EMPTY_FIELD_VALIDATION_ERROR, USERNAME_EMAIL_VALIDATION_ERROR, PASSWORD_VALIDATION_ERROR, SUCCESSFUL_SIGN_IN, UNKNOWN_ERROR } from './Helpers/texts';
import { getLanguage } from './Helpers/helpers';

export interface SignInProps {
   setSignedIn:React.Dispatch<React.SetStateAction<{
    username: string;
    role: string;
}>>
}

export const SignIn: React.FC<SignInProps> = ({setSignedIn}) => {

    const language = getLanguage();
    const theme = createTheme();

    const [Errormsg, setErrormsg] = React.useState<string>("");

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const email = data.get('email');
      const password = data.get('password');
      if(email === "" || password === ""
      || email === null ||password === null){
          setErrormsg(EMPTY_FIELD_VALIDATION_ERROR[language]);
          return;
      }
      else if(password!.toString()?.length < 8){
          setErrormsg(PASSWORD_VALIDATION_ERROR[language]);
          return;
      }
      else if(email!.toString().length < 4){
          setErrormsg(USERNAME_EMAIL_VALIDATION_ERROR[language]);
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
              alert(SUCCESSFUL_SIGN_IN[language]);
              const cookies = new Cookies();
              cookies.set("token", res.data.token);
              setSignedIn({username: res.data.username, role: res.data.role});
          }
          catch(err: any){
              let message = ""
              if(err.response && err.response.data && err.response.data.message)
                  message = err.response.data.message;
              else if(err.message)
                  message = err.message;
              else
                  message = UNKNOWN_ERROR[language];
  
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
                <Link variant="body2" href="mailto:TechnioNLP@gmail.com
                    ?subject=Registration Request
                    &body=tell us who you are, your desired username, email and password.
                    otherwise the username and password will be randomly generated based
                    requestors email address">
                  Forgot password? Contact an admin
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}