export class Questao {
  tipo: string;
  estilo: string;
  dificuldade: string;
  incluiResposta: boolean;
  assunto: string;
  quantidade: number;

  constructor(
    tipo = 'objetiva',
    estilo = 'Múltipla Escolha',
    dificuldade = 'Fácil',
    incluiResposta = false,
    assunto = '',
    quantidade = 3
  ) {
    this.tipo = tipo;
    this.estilo = estilo;
    this.dificuldade = dificuldade;
    this.incluiResposta = incluiResposta;
    this.assunto = assunto;
    this.quantidade = quantidade;
  }
}

export class Prova {
  professor: string;
  escola: string | null;
  nivel: string | null;
  disciplina: string | null;
  assunto: string | null;
  observacao: string | null;
  questoes: Questao[];

  constructor(prova: Partial<Prova> = {}) {
    this.professor = prova.professor || '';
    this.escola = prova.escola || '';
    this.nivel = prova.nivel || null;
    this.disciplina = prova.disciplina || null;
    this.assunto = prova.assunto || '';
    this.observacao = prova.observacao || '';
    this.questoes = prova.questoes || [];
  }
}
