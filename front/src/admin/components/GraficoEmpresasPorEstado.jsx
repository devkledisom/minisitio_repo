import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const GraficoEmpresasPorEstado = ({ data }) => (
  <BarChart
    width={1200}
    height={400}
    data={data}
    margin={{
      top: 20,
      right: 30,
      left: 20,
      bottom: 5,
    }}
  >
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="estado" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Bar dataKey="empresas" fill="#8884d8" />
  </BarChart>
);

export default GraficoEmpresasPorEstado;
