import { useEffect, useState } from "react";
import AddExpenseForm from "./components/AddExpenseForm";
import ExpenseList from "./components/ExpenseList";
import ExpenseBarChart from "./components/ExpenseBarChart";
import Aos from "aos";
import * as XLSX from "xlsx";
import "aos/dist/aos.css";
import ExpenseLineChart from "./components/ExpenseLineChart";
import CategoryChart from "./components/CategoryChart";
import Welcome from "./components/Welcome";

function App() {
  useEffect(() => {
    Aos.init({ duration: 600 });
  }, []);
  const [expenses, setExpenses] = useState([]);
  const [expenseToEdit, setExpenseToEdit] = useState(null);
  const [initialBalance, setInitialBalance] = useState(0);
  const [tempBalance, setTempBalance] = useState("");
  const [warningMessage, setWarningMessage] = useState("");
  const [warningClass, setWarningClass] = useState("");
  const [showWelcome, setShowWelcome] = useState(true);
  useEffect(() => {
    try {
      const storedExpenses = JSON.parse(
        localStorage.getItem("expenses") || "[]"
      );
      const updatedExpenses = storedExpenses.map((expense) => {
        if (!expense.date) {
          expense.date = new Date().toISOString().split("T")[0];
        }
        return expense;
      });

      setExpenses(updatedExpenses);
      localStorage.setItem("expenses", JSON.stringify(updatedExpenses));

      const storedBalance =
        parseFloat(localStorage.getItem("initialBalance")) || 0;
      setInitialBalance(storedBalance);
    } catch (error) {
      console.error("Erro ao carregar dados do localStorage:", error);
      localStorage.removeItem("expenses");
      localStorage.removeItem("initialBalance");
      setExpenses([]);
      setInitialBalance(0);
    }
  }, []);

  useEffect(() => {
    checkRules();
  }, [expenses, initialBalance]);

  const addExpense = (expense) => {
    let updatedExpenses;

    if (expenseToEdit) {
      updatedExpenses = expenses.map((exp) =>
        exp.id === expense.id ? expense : exp
      );
    } else {
      updatedExpenses = [...expenses, expense];
    }

    setExpenses(updatedExpenses);
    localStorage.setItem("expenses", JSON.stringify(updatedExpenses));
    setExpenseToEdit(null);
  };

  const editExpense = (expense) => {
    setExpenseToEdit(expense);
  };

  const clearEdit = () => {
    setExpenseToEdit(null);
  };

  const handleBalanceChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setInitialBalance(value);
    localStorage.setItem("initialBalance", value);
  };

  const handleBalanceInputChange = (e) => {
    setTempBalance(e.target.value);
  };

  const updateBalance = () => {
    const value = parseFloat(tempBalance) || 0;
    setInitialBalance(value);
    localStorage.setItem("initialBalance", value);
  };

  const currentBalance =
    initialBalance - expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const checkRules = () => {
    if (initialBalance === 0) return;

    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const spendingPercent = (totalExpenses / initialBalance) * 100;

    if (spendingPercent >= 60) {
      setWarningMessage(
        "Você ultrapassou o limite de 60% do seu saldo inicial! Reveja suas despesas!"
      );
      setWarningClass("text-red-800, bg-red-400");
    } else if (spendingPercent >= 50) {
      setWarningMessage(
        "Cuidado! Você está gastando mais da metade do seu saldo inicial!"
      );
      setWarningClass("text-yellow-800, bg-yellow-400");
    } else {
      setWarningMessage("");
      setWarningClass("");
    }
  };

  const exportToExcel = (expenses, initialBalance) => {
    // Transformando os dados em um formato adequado
    const formattedExpenses = expenses.map((expense) => ({
      Data: expense.date,
      Categoria: expense.category,
      Descrição: expense.description,
      Valor: expense.amount,
    }));

    // Criando as planilhas
    const wsData = [
      [
        {
          v: "Saldo inicial",
          s: { font: { bold: true }, alignment: { horizontal: "center" } },
        },
        initialBalance,
      ],
      [],
      ["Data", "Categoria", "Descrição", "Valor"].map((header) => ({
        v: header,
        s: {
          font: { bold: true },
          fill: { fgColor: { rgb: "FFD700" } }, // Fundo amarelo
          alignment: { horizontal: "center" },
        },
      })),
      ...formattedExpenses.map((expense) => [
        expense.Data,
        expense.Categoria,
        expense.Descrição,
        { v: expense.Valor, t: "n", z: '"R$"#,##0.00' }, // Estilo contábil para valores numéricos
      ]),
    ];

    // Criando uma worksheet com os dados
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    ws["B1"].z = '"R$"#,##0.00'; // Formatação contábil para a initialBalance
    // Ajustando largura das colunas
    ws["!cols"] = [
      { wch: 15 }, // Largura para "Data"
      { wch: 20 }, // Largura para "Categoria"
      { wch: 30 }, // Largura para "Descrição"
      { wch: 12 }, // Largura para "Valor"
    ];

    // Criando o workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Despesas");

    // Exportando o arquivo
    XLSX.writeFile(wb, "dashboard_despesas.xlsx");
  };

  return (
    <div className="min-h-screen overflow-y-hidden bg-gradient-to-r from-emerald-950 font-[Poppins] to-neutral-950 flex flex-col items-center">
      {showWelcome && (
        <Welcome
          onClose={() => {
            setShowWelcome(false);
          }}
        />
      )}
      <div
        data-aos="fade-down"
        className="h-screen mx-auto mb-7 pt-4 w-full md:w-3/4 flex flex-col justify-center"
      >
        <h1 className="text-5xl text-white font-bold text-center mb-10">
          Bem vindo ao seu Dashboard financeiro!
        </h1>
        <div className="my-6 flex flex-col items-center">
          <label className="block text-gray-100 font-bold mb-2">
            Insira seu saldo inicial (em reais)
          </label>
          <input
            type="number"
            className="border p-2 w-1/6 rounded-3xl text-center"
            value={tempBalance}
            onChange={handleBalanceInputChange}
          />
          <button
            onClick={updateBalance}
            className="duration-300 bg-green-600 w-1/6 text-white px-4 py-2 rounded-full my-12 hover:bg-green-800"
          >
            Atualizar Saldo
          </button>
          <div className="w-2/6 mt-20 flex text-lg justify-between">
            <p className="text-gray-200 text-center">
              Saldo inicial: <strong>R$ {initialBalance.toFixed(2)}</strong>
            </p>
            <p className="text-gray-200 text-center">
              Saldo atual: <strong>R$ {currentBalance.toFixed(2)}</strong>
            </p>
          </div>
        </div>
      </div>

      <AddExpenseForm
        onAddExpense={addExpense}
        expenseToEdit={expenseToEdit}
        onClearEdit={clearEdit}
      />
      <ExpenseList
        expenses={expenses}
        onEditExpense={editExpense}
        data-aos="fade-up"
      />
      {warningMessage && (
        <div className={`px-4 py-2 rounded-full mb-4 ${warningClass}`}>
          {warningMessage}
        </div>
      )}
      <ExpenseBarChart expenses={expenses} />
      <ExpenseLineChart expenses={expenses} />
      <CategoryChart expenses={expenses} />

      <button
        onClick={() => exportToExcel(expenses, initialBalance)}
        className="px-4 py-3 text-xl bg-lime-700 rounded-full text-white my-14"
      >
        Exportar para Excel
      </button>
    </div>
  );
}

export default App;
