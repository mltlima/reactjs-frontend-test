import React from 'react';
import { useDispatch } from 'react-redux';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { actions as routeActions, types as routes } from '../reducers/routes.actions';

function Header() {
  const dispatch = useDispatch();

  const handleHomeClick = () => {
    dispatch(routeActions.redirectTo(routes.HOME));
  };

  const handleAddUserClick = () => {
    dispatch(routeActions.redirectTo(routes.ADD_USER));
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: 'navy', marginBottom: 4 }}>
      <Toolbar>
        <Typography 
          variant="h6" 
          sx={{ flexGrow: 1, cursor: 'pointer' }} 
          onClick={handleHomeClick}
        >
          Taya
        </Typography>
        <Button color="inherit" onClick={handleAddUserClick}>
          Adicionar Usuário
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Header;