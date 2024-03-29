import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios, { Axios, AxiosError } from 'axios';
import { FE_SERVER } from './Helpers/consts';
import { basicAxiosInstance, getLanguage } from './Helpers/helpers';
import { EMAILADRESS, EMPTY_FIELD_VALIDATION_ERROR, HELLO, PASSWORD, PASSWORD_VALIDATION_ERROR, REGISTER_ACCOUNT, SIGNUP, SUCCESSFUL_SIGN_UP, UNKNOWN_ERROR, USERNAME, USERNAME_VALIDATION_ERROR } from './Helpers/texts';


export interface SignUpProps {
   setRegistered: () => void;
}

export const SignUp: React.FC<SignUpProps> = ({setRegistered}) => {

  const language = getLanguage();

  const theme = createTheme();

  const [Errormsg, setErrormsg] = React.useState<string>("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get('email');
    const password = data.get('password');
    const username = data.get('username');
    if(email === "" || password === "" || username === ""
    || email === null ||password === null || username === null){
        setErrormsg(EMPTY_FIELD_VALIDATION_ERROR[language]);
        return;
    }
    else if(password!.toString()?.length < 8){
        setErrormsg(PASSWORD_VALIDATION_ERROR[language]);
        return;
    }
    else if(username!.toString().length < 4){
        setErrormsg(USERNAME_VALIDATION_ERROR[language]);
        return;
    }
    else{
        try{
            let res = await basicAxiosInstance()({
                method:"post",
                url:"/register",
                data: {
                  email: email,
                  password: password,
                  username: username
              }
            })
            setErrormsg("");
            alert(SUCCESSFUL_SIGN_UP[language]);
            setRegistered();
        }
        catch(err: any){
            let message = "";
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
          {REGISTER_ACCOUNT[language]}
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label= {EMAILADRESS[language]}
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  autoComplete="user-name"
                  name="username"
                  required
                  fullWidth
                  id="username"
                  label={USERNAME[language]}
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label={PASSWORD[language]}
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
            {SIGNUP[language]}
            </Button>
          </Box>
          <Typography component="h5" variant="body1" color="red" hidden={Errormsg.length === 0}>
            {Errormsg}
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
}