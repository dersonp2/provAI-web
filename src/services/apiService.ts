import axios from 'axios';

const API_BASE_URL = 'localhost:8080'; // Substitua pela URL da sua API

export const gerarProva = async (prova: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/gerar`, {
      prova: prova,
    });
    return response.data.provaGerada;
  } catch (error) {
    console.error('Erro ao gerar prova:', error);
    throw error;
  }
};
