import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#0088FE", "#FFBB28", "#FF8042", "#00C49F", "#A28BE7", "#FF6384"];

export default function PollResults() {
  const { pollId } = useParams();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://192.168.1.16:8000/polls/${pollId}/results`)
      .then((res) => res.json())
      .then((data) => {
        setResults(data);
        setLoading(false);
      });
  }, [pollId]);

  if (loading) return <div className="text-center mt-10">Carregando resultados...</div>;
  if (!results) return <div className="text-center mt-10">Resultados não encontrados.</div>;

  const totalVotes = results.results.reduce((sum, o) => sum + o.votes, 0);
  const data = results.results.map((option, idx) => ({
    name: option.text,
    value: option.votes,
    color: COLORS[idx % COLORS.length],
  }));

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow space-y-4">
      <h2 className="text-2xl font-bold mb-2">Resultados da Enquete</h2>
      <div className="mb-2 font-semibold">{results.title}</div>
      <div className="text-gray-500 mb-2">{results.description}</div>
      <div>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ percent }) =>
                `${(percent * 100).toFixed(1)}%`
              }
              isAnimationActive={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4">
        <Link to="/" className="text-blue-600 hover:underline">Voltar para enquetes</Link>
      </div>
      <div className="text-xs text-gray-400">
        Total de votos: {totalVotes}
      </div>
    </div>
  );
}
