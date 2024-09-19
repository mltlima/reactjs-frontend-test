import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  actions as routeActions,
  types as routes,
} from "../reducers/routes.actions";
import { DeleteOutline, Edit } from "@mui/icons-material";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  IconButton,
  Box,
  CircularProgress,
  Button,
  Tooltip,
  Snackbar,
  Alert,
} from "@mui/material";

const HomePage = () => {
  const dispatch = useDispatch();
  const { loading, data } = useSelector((state) => state.home);

  // Estado para Snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleDelete = (id) => {
    if (window.confirm("Tem certeza que deseja excluir este usuário?")) {
      // Dispatch para deletar o usuário
      dispatch(routeActions.deleteUser(id));
      setSnackbar({
        open: true,
        message: "Usuário excluído com sucesso!",
        severity: "success",
      });
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <>
        {/* Header */}
        <AppBar position="static" sx={{ marginBottom: 4 }}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Taya Management
            </Typography>
            <Button color="inherit" onClick={() => { /* Ação para adicionar usuário */ }}>
              Adicionar Usuário
            </Button>
          </Toolbar>
        </AppBar>

        {/* Indicador de Carregamento */}
        <Container
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "80vh",
          }}
        >
          <CircularProgress size={60} color="primary" />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Carregando usuários...
          </Typography>
        </Container>
      </>
    );
  }

  return (
    <>
      {/* Header */}
      <AppBar position="static" sx={{ marginBottom: 4 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Taya Management
          </Typography>
          <Button
            color="inherit"
            onClick={() => dispatch(routeActions.redirectTo(routes.ADD_USER))}
          >
            Adicionar Usuário
          </Button>
        </Toolbar>
      </AppBar>

      {/* Conteúdo Principal */}
      <Container>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h4" gutterBottom>
            Lista de Usuários
          </Typography>
        </Box>
        <TableContainer component={Paper} elevation={3}>
          <Table sx={{ minWidth: 650 }} aria-label="tabela de usuários">
            <TableHead>
              <TableRow>
                <TableCell><strong>Nome</strong></TableCell>
                <TableCell><strong>Idade</strong></TableCell>
                <TableCell><strong>Cidade/UF</strong></TableCell>
                <TableCell align="center"><strong>Ações</strong></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {data.map((u) => (
                <TableRow key={u.id} hover>
                  <TableCell>{u.nome}</TableCell>
                  <TableCell>{u.idade}</TableCell>
                  <TableCell>
                    {u.cidade}/{u.uf}
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Editar Usuário">
                      <IconButton
                        color="primary"
                        onClick={() =>
                          dispatch(routeActions.redirectTo(routes.USER, { id: u.id }))
                        }
                        sx={{ marginRight: 1 }}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Excluir Usuário">
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(u.id)}
                      >
                        <DeleteOutline />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>

      {/* Snackbar para Feedback de Ações */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default HomePage;