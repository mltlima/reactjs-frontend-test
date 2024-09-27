export const fetchAddressFromCep = async (cep) => {
    console.log('fetchAddressFromCep', cep);
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) {
      throw new Error('CEP inválido');
    }
  
    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    if (!response.ok) {
      throw new Error('Falha ao buscar CEP');
    }
  
    const data = await response.json();
    if (data.erro) {
      throw new Error('CEP não encontrado');
    }
  
    return {
      cidade: data.localidade,
      uf: data.uf,
    };
  };