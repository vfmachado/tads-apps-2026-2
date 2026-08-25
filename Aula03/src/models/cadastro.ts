// Modelo do formulário de cadastro, compartilhado pelas telas 2 e 3.
// A ideia é deixar claro que as REGRAS são as mesmas — o que muda entre
// as duas telas é quem cuida do estado: nós (useState) ou o Formik.

export interface Cadastro {
  nome: string;
  email: string;
  senha: string;
  confirmacaoSenha: string;
  cidade: string;
  aceitaTermos: boolean;
}

// Estado inicial do formulário. É uma constante fora do componente para que
// seja sempre o mesmo objeto e possa ser reaproveitada no "limpar".
export const CADASTRO_VAZIO: Cadastro = {
  nome: '',
  email: '',
  senha: '',
  confirmacaoSenha: '',
  cidade: '',
  aceitaTermos: false,
};

// Partial<Record<...>> = objeto onde cada campo do Cadastro pode ter (ou não)
// uma mensagem de erro. Ex.: { email: 'E-mail inválido.' }
export type ErrosCadastro = Partial<Record<keyof Cadastro, string>>;

export function validarCadastro(cadastro: Cadastro): ErrosCadastro {
  const erros: ErrosCadastro = {};

  if (cadastro.nome.trim().length < 3) {
    erros.nome = 'Informe pelo menos 3 caracteres.';
  }
  if (!cadastro.email.includes('@') || !cadastro.email.includes('.')) {
    erros.email = 'Informe um e-mail válido.';
  }
  if (cadastro.senha.length < 6) {
    erros.senha = 'A senha precisa ter no mínimo 6 caracteres.';
  }
  if (cadastro.confirmacaoSenha !== cadastro.senha) {
    erros.confirmacaoSenha = 'As senhas não conferem.';
  }
  if (cadastro.cidade.trim() === '') {
    erros.cidade = 'Informe a cidade.';
  }
  if (!cadastro.aceitaTermos) {
    erros.aceitaTermos = 'É preciso aceitar os termos de uso.';
  }

  return erros;
}
