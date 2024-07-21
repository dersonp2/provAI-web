export const niveis = [
  'Ensino Fundamental',
  'Ensino Médio',
  'Graduação',
  'Pós-Graduação',
];

export const quantidade = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export const alternativas = [1, 2, 3, 4, 5];

export const columns = [
  { name: 'questao', label: 'Questão', field: 'questao', align: 'center' },
  { name: 'tipo', label: 'Tipo', field: 'tipo', align: 'left' },
  { name: 'estilo', label: 'Estilo', field: 'estilo', align: 'left' },
  {
    name: 'quantidade',
    label: 'Alternativas/linhas',
    field: 'quantidade',
    align: 'left',
  },
  {
    name: 'dificuldade',
    label: 'Dificuldade',
    field: 'dificuldade',
    align: 'left',
  },
  {
    name: 'incluiResposta',
    label: 'Incluir Resposta',
    field: 'incluiResposta',
    align: 'center',
  },
  { name: 'assunto', label: 'Assunto', field: 'assunto', align: 'left' },
];

export const tipoOpcoes = [
  { label: 'Objetiva', value: 'objetiva' },
  { label: 'Dissertativa', value: 'dissertativa' },
];

export const tiposQuestoes = {
  objetiva: [
    { label: 'Múltipla Escolha', value: 'Múltipla Escolha' },
    { label: 'Verdadeiro/Falso', value: 'Verdadeiro/Falso' },
    { label: 'Associação', value: 'Associação' },
    { label: 'Ordenação', value: 'Ordenação' },
    {
      label: 'Escolha múltipla com justificação',
      value: 'Escolha múltipla com campo para justificação',
    },
  ],
  dissertativa: [
    { label: 'Questões Abertas', value: 'Questões Abertas' },
    { label: 'Estudo de Caso', value: 'Estudo de Caso' },
    { label: 'Questões de Discussão', value: 'Questões de Discussão' },
  ],
};

export const dificultadeOpcoes = [
  { label: 'Fácil', value: 'Fácil' },
  { label: 'Médio', value: 'Médio' },
  { label: 'Difícil', value: 'Difícil' },
];

export const provaGerada = {
  professor: 'Professor X',
  disciplina: 'Matemática',
  nivelEnsino: 'Ensino Médio',
  escola: 'Escola Y',
  dataGeracao: new Date(),
  questoes: [
    {
      questao: 'O que é 2 + 2?',
      alternativas: [
        { alternativa: '3', resposta: 'errado' },
        { alternativa: '4', resposta: 'correto' },
        { alternativa: '5', resposta: 'errado' },
      ],
    },
    {
      questao: 'Qual a capital da França?',
      alternativas: [
        { alternativa: 'Berlim', resposta: 'errado' },
        { alternativa: 'Madrid', resposta: 'errado' },
        { alternativa: 'Paris', resposta: 'correto' },
      ],
    },
  ],
};
