import React, { useEffect } from 'react'
import { ENGLISH, HEBREW } from '../Helpers/consts';
import { getLanguage, setLanguage } from '../Helpers/helpers';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { FAQS, REGISTER, SINGOUT } from '../Helpers/texts';


export interface HeaderProps {
    setChanged: React.Dispatch<React.SetStateAction<boolean>>;
    signOut: () => void;
    openRegister: () => void;
    hideRegister: boolean;
    isLoggedIn: boolean;
    openFAQ: () => void;
    goToMainPage: () => void;
}

export const Header: React.FC<HeaderProps> = ({setChanged, signOut, openRegister, hideRegister, isLoggedIn, openFAQ, goToMainPage}) => {

    const language = getLanguage();
    const languageStrings = language == ENGLISH? "Hebrew" : "English";
    const [inRegister, setInRegister] = React.useState(false);

    const changeLanguage = () => {
        setLanguage(language == ENGLISH? HEBREW : ENGLISH);
        setChanged((old: boolean) => !old);
    }

    const onOpenRegister = () => {
        openRegister();
        setInRegister(true);
    }

    const getButtonFunction = (index: number) => {
        switch(index){
            case 0:
                //set timeout to allow button animations to finish before changing language
                return () => setTimeout(changeLanguage, 300);
            case 1:
                return openFAQ;
            case 2:
                return isLoggedIn && (!hideRegister || inRegister)? onOpenRegister
                : signOut;
            case 3:
                return isLoggedIn && (!hideRegister || inRegister)? signOut : () => {alert("show not reach here")}
            default:
                return () => {};
        }
    }

    const [pages, setPages] = React.useState<string[]>([]);

    useEffect(() => {
        if(hideRegister) setInRegister(false);
        setPages(setupPages());
    }, [language, isLoggedIn, hideRegister, inRegister]);
        
    const setupPages = () => {
        let pages = [languageStrings , FAQS[language]];
        if(isLoggedIn){
            if(!hideRegister || inRegister){
                pages.push(REGISTER[language]);
            }

            pages.push(SINGOUT[language]);
        }
        return pages;
    }

    const onGoToMainPage = () => {
        setInRegister(false);
        goToMainPage();
    }

    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
      };
    
      const handleCloseNavMenu = () => {
        setAnchorElNav(null);
      };

    const getButtonID = (index: number) => {
        switch(index){
            case 0:
                return "language";
            case 1:
                return "FAQ";
            case 2:
                return isLoggedIn && (!hideRegister || inRegister)? "register" : "signout";
            case 3:
                return isLoggedIn && (!hideRegister || inRegister)? "signout" : "";
            default:
                return "";
        }
      }

    const getHeader = () => {
        return (
            <AppBar className='Header' position="static" color='transparent'>
              <Container maxWidth="xl" >
                <Toolbar disableGutters>
                  <Box component="button" style={{backgroundColor:'transparent'}} onClick={() => goToMainPage()} className='Icon'sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }}/>
        
                  <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                    <IconButton
                      size="large"
                      aria-label="account of current user"
                      aria-controls="menu-appbar"
                      aria-haspopup="true"
                      onClick={handleOpenNavMenu}
                      color="inherit"
                    >
                      <MenuIcon />
                    </IconButton>
                    <Menu
                      id="menu-appbar"
                      anchorEl={anchorElNav}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                      }}
                      keepMounted
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                      }}
                      open={Boolean(anchorElNav)}
                      onClose={handleCloseNavMenu}
                      sx={{
                        display: { xs: 'block', md: 'none' },
                      }}
                    >
                      {pages.map((page, index) => (
                        <MenuItem key={page} onClick={handleCloseNavMenu}>
                            <Typography textAlign="center" component={Button}
                            onClick={getButtonFunction(index)}>{page}</Typography>
                        </MenuItem>
                      ))}
                    </Menu>
                  </Box>
                  <Box className='Icon' sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                  <Typography
                    variant="h5"
                    noWrap
                    component="a"
                    href=""
                    onClick={() => onGoToMainPage()}
                    sx={{
                      mr: 2,
                      display: { xs: 'flex', md: 'none' },
                      flexGrow: 1,
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      letterSpacing: '.3rem',
                      color: 'inherit',
                      textDecoration: 'none',
                    }}
                  >
                    TechnioNLP
                  </Typography>
                  <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                    {pages.map((page, index) => (
                      <Button
                        key={page}
                        id={getButtonID(index)}
                        onClick={getButtonFunction(index)}
                        sx={{ my: 2, color: 'white', display: 'block' }}
                      >
                        {page}
                      </Button>
                    ))}
                  </Box>
                </Toolbar>
            </Container>
        </AppBar>
        )
    }




    return (
        <>
        {getHeader()}
        </>
    )

};