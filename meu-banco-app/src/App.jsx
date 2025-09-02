import { useState } from 'react';
import { useForm } from 'react-hook-form';
import './App.css';

function App() {
  const { register, handleSubmit, reset } = useForm();
  const [resultado, setResultado] = useState(null);

  const onSubmit = (data) => {
    const { nomeCliente, dividaAtiva, salario, tempoCliente, bens } = data;

    // Regra 1: Empréstimo Não Autorizado [cite: 77]
    if (dividaAtiva === 'Sim' && tempoCliente === 'Menos de 5 anos' && !bens.includes('Casa/Apto') && !bens.includes('Veiculo')) {
      setResultado({
        status: 'nao_autorizado',
        titulo: `Ops, ${nomeCliente}!`,
        mensagem: 'Empréstimo Não Autorizado',
        subMensagem: 'Converse com o seu gerente',
      });
      return;
    }

    // Regra 2: Empréstimo Pré-Aprovado [cite: 78]
    if (dividaAtiva === 'Nao' && tempoCliente === 'Acima de 10 anos' && bens.includes('Casa/Apto') && bens.includes('Veiculo')) {
      const salarioFloat = parseFloat(salario);
      const valorEmprestimo = salarioFloat * 6;
      const valorTotal = valorEmprestimo * 1.2;
      const valorParcela = valorTotal / 12;
      setResultado({
        status: 'aprovado',
        titulo: `Parabéns, ${nomeCliente}!`,
        mensagem: `Empréstimo Pré-Aprovado de R$ ${valorEmprestimo.toFixed(2)}`,
        subMensagem: `Para pagto em 12x de ${valorParcela.toFixed(2)}`,
      });
      return;
    }

    // Regra 3: Demais Clientes [cite: 79]
    const salarioFloat = parseFloat(salario);
    const valorEmprestimoPossivel = salarioFloat * 3;
    setResultado({
      status: 'gerente',
      titulo: `Estimado(a), ${nomeCliente}!`,
      mensagem: `Venha conversar com nosso gerente!`,
      subMensagem: `Empréstimo possível de R$ ${valorEmprestimoPossivel.toFixed(2)}`,
    });
  };

  const handleLimpar = () => {
    reset();
    setResultado(null);
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Banco Avenida</h1>
        <h2>App: Controle de Empréstimos</h2>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>
          Nome do Cliente:
          <input type="text" {...register('nomeCliente', { required: true })} />
        </label>
        <label className="radio-group">
          Possui dívida ativa:
          <div>
            <input type="radio" value="Sim" {...register('dividaAtiva', { required: true })} /> Sim
            <input type="radio" value="Nao" {...register('dividaAtiva', { required: true })} /> Não
          </div>
        </label>
        <label>
          Salário R$:
          <input type="number" step="0.01" {...register('salario', { required: true, valueAsNumber: true })} />
        </label>
        <label>
          Cliente do Banco:
          <select {...register('tempoCliente', { required: true })}>
            <option value="">Selecione...</option>
            <option value="Menos de 5 anos">Menos de 5 anos</option>
            <option value="Acima de 10 anos">Acima de 10 anos</option>
          </select>
        </label>
        <label className="checkbox-group">
          Bens em seu nome:
          <div>
            <input type="checkbox" value="Casa/Apto" {...register('bens')} /> Casa/Apto
            <input type="checkbox" value="Veiculo" {...register('bens')} /> Veículo
          </div>
        </label>
        <div className="botoes">
          <button type="submit" className="verificar">Verificar Empréstimo</button>
          <button type="button" onClick={handleLimpar} className="limpar">Limpar Dados</button>
        </div>
      </form>
      {resultado && (
        <div className={`resultado ${resultado.status}`}>
          <div className={`icone icone-${resultado.status}`}></div>
          <h3>{resultado.titulo}</h3>
          <p className="mensagem">{resultado.mensagem}</p>
          <p className="submensagem">{resultado.subMensagem}</p>
        </div>
      )}
    </div>
  );
}

export default App;