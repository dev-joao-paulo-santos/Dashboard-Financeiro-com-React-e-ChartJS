import React, { useEffect } from "react";
import Aos from "aos";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend } from "chart.js";
import { callback } from "chart.js/helpers";

ChartJS.register(LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend);

const ExpenseLineChart = ({ expenses }) => {
  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);

  // Agrupar gastos por data
  const dailyTotals = expenses.reduce((totals, expense) => {
    const date = expense.date || new Date().toISOString().split("T")[0]; // Garantir que a data é válida
    totals[date] = (totals[date] || 0) + expense.amount; // Somar os valores por data
    return totals;
  }, {});

  // Ordenar datas e preparar dados do gráfico
  const sortedDates = Object.keys(dailyTotals).sort(); // Ordenar as datas (ISO)
  const dataPoints = sortedDates.map((date) => dailyTotals[date]);

  // Formatar datas para exibição no gráfico
  const formattedDates = sortedDates.map((date) =>
    new Date(date).toLocaleDateString("pt-br", { day: "2-digit", month: "2-digit", year: "numeric" })
  );

  const data = {
    labels: formattedDates, // Datas formatadas
    datasets: [
      {
        label: "Total de gastos diários: R$",
        data: dataPoints, // Totais diários ordenados
        borderColor: "#14248A",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 2,
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
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
      x: { title: { display: true, text: "Datas" } },
      y: { title: { display: true, text: "Total de Gastos (R$)" } },
    },
  };

  return (
    <div className="w-full md:w-3/4 p-4 bg-white px-4 mx-auto my-12" data-aos="flip-down">
      <h2 className="text-2xl font-bold text-center mb-4">Gastos Diários</h2>
      <Line data={data} options={options} />
    </div>
  );
};

export default ExpenseLineChart;
