import React, { useEffect } from 'react'
import {Bar} from 'react-chartjs-2'
import {Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip} from 'chart.js'
import Aos from 'aos'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip)

const ExpenseBarChart = ({expenses}) => {

    useEffect(()=>{Aos.init({duration: 1000})}, [])

    const categories = ["Transporte", "Alimentação", "Contas", "Outros", "Investimentos"];
    const dataByCategory = categories.map((category) => 
    expenses
    .filter((expense) => expense.category === category)
    .reduce((sum, expense) => sum + expense.amount, 0)
);

const data = {
    labels: categories,
    datasets: [
        {
            label: "Gastos por Categoria",
            data: dataByCategory,
            backgroundColor: ["#001011", "#59C9A5", "#3AAFB9", "#64E9EE", "#028090"]
        },
    ],
}

const options = {
    responsive: true,
    plugins: {
        legend: {
            display: false
        },
        tooltip: {
            enabled: true,
            callbacks: {
                label: (context) => {
                    const value = context.raw;
                    return `R$ ${value.toFixed(2)}`
                },
                title: (context) => {
                    return `em ${context[0].label}`
                }
            }
        }
    }
}

  return (
    <div className="w-full md:w-3/4 bg-white p-4 mx-auto mt-8" data-aos='flip-down'>
        <h2 className="text-2xl text-center font-bold mb-4">Gráfico Geral de Despesas</h2>
        <Bar data={data} options={options}/>
    </div>
  )
}

export default ExpenseBarChart
