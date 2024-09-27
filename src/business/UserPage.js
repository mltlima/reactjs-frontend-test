import React, { useState } from "react";
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

const UserPage = () => {
  const dispatch = useDispatch();
  const { loading, data, id } = useSelector((state) => state.user);
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

  const handleSubmit = (values) => {
    dispatch(actions.saveUser.request(values));
    setSnackbar({
      open: true,
      message: "Usuário salvo com sucesso!",
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
      console.log(address);
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
          Carregando usuário...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          {id ? `Editar Usuário #${id}` : "Adicionar Novo Usuário"}
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
              {id ? "Atualizar" : "Adicionar"}
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
  );
};

export default UserPage;