'use client'

import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const cards = [
  { title: 'Total Trainings', count: 24 },
  { title: 'Active Employees', count: 87 },
  { title: 'Pending Tasks', count: 13 },
  { title: 'Completed Sessions', count: 45 },
]

const chartData = [
  { name: 'Jan', trainings: 10 },
  { name: 'Feb', trainings: 15 },
  { name: 'Mar', trainings: 8 },
  { name: 'Apr', trainings: 18 },
  { name: 'May', trainings: 12 },
]

export default function DashboardPage() {
  return (
    <>
      <h2 className="text-2xl font-bold mb-6">Welcome, Admin!</h2>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {cards.map((card) => (
          <motion.div
            whileHover={{ scale: 1.05 }}
            key={card.title}
            className="bg-white p-5 rounded-2xl shadow transition"
          >
            <p className="text-sm text-gray-500">{card.title}</p>
            <p className="text-2xl font-bold text-green-600">{card.count}</p>
          </motion.div>
        ))}
      </div>

      {/* Graph */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Monthly Trainings Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="trainings" fill="#10B981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  )
}
