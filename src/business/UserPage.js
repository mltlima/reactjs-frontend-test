import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { actions } from "../reducers/user.actions";
import { ControlledTextField } from "../components/inputs";
import ZipCodeTextField from "../components/inputs/ZipCodeTextField";
import { fetchAddressFromCep } from "../utils/fetchZip";
import {
  Container,
  Typography,
  Button,
  Paper,
  Box,
  Grid,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import Header from "./Header";
import { types as routes } from "../reducers/routes.actions";

const UserPage = () => {
  const dispatch = useDispatch();
  const { loading, data, id } = useSelector((state) => state.user);
  const { type } = useSelector((state) => state.location);
  const isAdding = type === routes.ADD_USER;

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const rules = {};
  const initialValues = {
    nome: "",
    dataNascimento: "",
    cep: "",
    cidade: "",
    uf: "",
    ...data,
  };
  const formProps = {
    ...useForm({
      defaultValues: initialValues,
    }),
    rules,
    initialValues,
  };

  useEffect(() => {
    if (id && !isAdding) {
      dispatch(actions.loadUser.request(id));
    }
  }, [id, isAdding, dispatch]);

  const handleSubmit = (values) => {
    dispatch(actions.saveUser.request(isAdding ? values : { id, ...values }));
    setSnackbar({
      open: true,
      message: isAdding ? "Usuário adicionado com sucesso!" : "Usuário atualizado com sucesso!",
      severity: "success",
    });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const handleCepBlur = async (value) => {
    const cep = value.replace(/\D/g, "");

    if (cep.length !== 8) {
      setSnackbar({
        open: true,
        message: "CEP inválido. Deve conter 8 dígitos.",
        severity: "error",
      });
    } else {
      const address = await fetchAddressFromCep(cep);
      formProps.setValue("cidade", address.cidade);
      formProps.setValue("uf", address.uf);
      return;
    }
  };

  if (loading) {
    return (
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
          {isAdding ? "Preparando formulário..." : "Carregando usuário..."}
        </Typography>
      </Container>
    );
  }

  return (
    <>
    <Header />
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          {isAdding ? "Adicionar Novo Usuário" : `Editar Usuário #${id}`}
        </Typography>
        <form onSubmit={formProps.handleSubmit(handleSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <ControlledTextField
                label="Nome"
                name="nome"
                formProps={formProps}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <ControlledTextField
                label="Data de Nascimento"
                name="dataNascimento"
                formProps={formProps}
                fullWidth
                type="date"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <ControlledTextField 
                label="CEP" 
                name="cep" 
                formProps={formProps} 
                InputComponent={ZipCodeTextField}
                fullWidth
                onBlur={handleCepBlur}
              />
            </Grid>
            <Grid item xs={12} sm={8}>
              <ControlledTextField
                label="Cidade"
                name="cidade"
                formProps={formProps}
                fullWidth
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <ControlledTextField 
                label="UF" 
                name="uf" 
                formProps={formProps}
                fullWidth
                disabled
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              size="large"
            >
              {isAdding ? "Adicionar" : "Atualizar"}
            </Button>
          </Box>
        </form>
      </Paper>

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
    </Container>
    </>
  );
};

export default UserPage;