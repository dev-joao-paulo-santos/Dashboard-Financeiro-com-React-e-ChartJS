import React, { useEffect } from 'react'
import Aos from 'aos';

const ExpenseList = ({expenses, onEditExpense}) => {
    useEffect(()=>{Aos.init({duration:750})},[])
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  return (
    <div className="bg-white rounded-3xl my-7 pt-4 w-full md:w-3/4" data-aos='fade-right'>
        <h2 className="text-2xl font-bold text-black mb-4 text-center">Gastos mensais</h2>
        <ul className="w-full p-4 shadow rounded-t-2xl">
            {expenses.map((expense) => (
                <li key={expense.id} className="flex justify-evenly items-center border-b py-2">
                    <div className='flex flex-col items-center'>
                    <span className='block'>{expense.name}</span>
                    <span className="text-gray-500 text-center">{expense.category}</span>
                    </div>
                    <div className="w-2/6 flex items-center justify-between gap-4">
                    <span className="text-rose-600 font-bold">R$ {expense.amount.toFixed(2)}</span>
                    <button onClick={()=>onEditExpense(expense)} className='rounded-3xl px-5 py-1 text-white font-bold bg-blue-700 cursor-pointer'>Editar</button>
                    </div>
                </li>
            ))}
        </ul>
        <div className="bg-gray-300 flex items-center justify-center flex-row h-12 rounded-b-2xl">
            <strong>Total de despesas: </strong><strong className='ml-2 text-rose-600'>R$ {total.toFixed(2)}</strong>
        </div>
    </div>
  )
}

export default ExpenseList;