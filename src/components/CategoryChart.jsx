import { div } from "@tensorflow/tfjs";
import React, { useState } from "react";
import { Line } from "react-chartjs-2";

const CategoryChart = ({ expenses }) => {
  const [selectedCategory, setSelectCategory] = useState(null);

  const categories = Array.from(new Set(expenses.map((exp) => exp.category)));

  const filteredExpenses = expenses
    .filter((exp) => exp.category === selectedCategory)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const data = {
    labels: filteredExpenses.map((exp) => exp.date),
    datasets: [
      {
        label: `Gastos em ${selectedCategory || "Selecione uma categoria!"}`,
        data: filteredExpenses.map((exp) => exp.amount),
        borderColor: "rgba(17, 75, 95, 1)",
        backgroundColor: "rgba(17, 75, 95)",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: "top",
      },
      tooltip: { enabled: true, callbacks: {
        label: (context) => {
            const value = context.raw;
            return `Total gasto de R$ ${value.toFixed(2)}`
        },
        title: (context) => {
            return `Dia ${context[0].label}`
        }
    } },
    },
    scales: {
      x: {
        title: { display: true, text: "Datas" },
      },
      y: {
        title: { display: true, text: "Valores (R$)" },
      },
    },
  };

  return (
    <div className="bg-white mx-auto my-7 p-4 w-full md:w-3/4">
      <h2 className="text-2xl text-center font-bold text-black mb-8">
        Despesas por categoria
      </h2>
      <div className="flex flex-wrap justify-center gap-4 my-6">
        {categories.map((category) => (
          <button
            key={category}
            className={`duration-500 px-4 py-2 rounded-lg bg-emerald-800
            text-white hover:bg-emerald-300 hover:text-black ${
              selectedCategory === category ? "bg-blue-800" : ""
            }`}
            onClick={() => setSelectCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
      {selectedCategory && filteredExpenses.length > 0 ? (
        <div className="">
        <Line data={data} options={options} />
        </div>
      ) : (
        <p className="text-gray-200">
          {selectedCategory
            ? "Nenhum gasto registrado para essa categoria."
            : "Escolha uma categoria para visualizar seu gráfico."}
        </p>
      )}
    </div>
    
  );
};

export default CategoryChart;
