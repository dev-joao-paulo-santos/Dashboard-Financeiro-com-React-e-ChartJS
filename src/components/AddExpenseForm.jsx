import React, { useEffect, useState } from "react";
import Aos from "aos";

const AddExpenseForm = ({ onAddExpense, expenseToEdit, onClearEdit }) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    if (expenseToEdit) {
      setName(expenseToEdit.name);
      setCategory(expenseToEdit.category);
      setAmount(expenseToEdit.amount);
      setDate(expenseToEdit.date);
    }
  }, [expenseToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !amount || !date) return alert("Preencha todos os campos!");

    const expense = {
      name,
      category,
      amount: parseFloat(amount),
      date,
      id: expenseToEdit ? expenseToEdit.id : Date.now(),
    };
    onAddExpense(expense);
    setName("");
    setAmount("");
    setDate("");
    if (expenseToEdit) onClearEdit();
  };

  useEffect(() => {
    Aos.init({ duration: 600 });
  }, []);

  return (
    <div
      data-aos="fade-left"
      className="bg-emerald-500 pt-4 rounded-3xl my-7 w-full md:w-2/4 flex flex-col items-center justify-center"
    >
      <h1 className="text-2xl font-bold">Insira a sua despesa aqui</h1>
      <form
        onSubmit={handleSubmit}
        className="w-full h-full  p-4 rounded-3xl flex flex-col items-center"
      >
        <div className="mb-4 w-5/6">
          <label className="block font-bold mb-1">Nome da despesa</label>
          <input
            type="text"
            value={name}
            className="border w-full p-2"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-4 w-5/6">
          <label className="block font-bold mb-1">Categoria de despesa</label>
          <select
            className="border w-full p-2"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option></option>
            <option>Transporte</option>
            <option>Alimentação</option>
            <option>Contas</option>
            <option>Outros</option>
            <option>Investimentos</option>
          </select>
        </div>
        <div className="mb-4 w-5/6">
          <label className="block font-bold mb-1">Valor</label>
          <input
            type="number"
            value={amount}
            className="border w-full p-2"
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className="mb-4 w-5/6">
          <label className="block font-bold mb-1">Data</label>
          <input
            type="date"
            value={date}
            className="border w-full p-2"
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="w-2/6 bg-emerald-300 px-4 py-2 rounded-3xl duration-500 hover:bg-cyan-500"
        >
          {expenseToEdit ? "Atualizar" : "Adicionar"}
        </button>
        {expenseToEdit && (
          <button
            type="button"
            className="w-2/6 mt-4 px-4 py-2 rounded-3xl bg-red-300 duration-500 hover:bg-red-600"
          >
            Cancelar
          </button>
        )}
      </form>
    </div>
  );
};

export default AddExpenseForm;
