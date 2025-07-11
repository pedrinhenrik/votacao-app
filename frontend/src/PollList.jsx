import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PollList() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState(localStorage.getItem("voter_name") || "");
  const [selected, setSelected] = useState({});
  const [message, setMessage] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://192.168.1.16:8000/polls/")
      .then((res) => res.json())
      .then((data) => {
        setPolls(data);
        setLoading(false);
      });
  }, []);

  const handleVote = async (e, pollId) => {
    e.preventDefault();
    setMessage({});
    if (!name || !selected[pollId]) return;
    localStorage.setItem("voter_name", name);

    const res = await fetch("http://192.168.1.16:8000/votes/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ option_id: selected[pollId], voter_name: name }),
    });

    if (res.ok) {
      setMessage({ ...message, [pollId]: "Voto computado! Redirecionando..." });
      setTimeout(() => {
        setMessage({ ...message, [pollId]: "" });
        navigate(`/results/${pollId}`);
      }, 1000);
    } else {
      const data = await res.json();
      setMessage({ ...message, [pollId]: data.detail || "Erro ao votar." });
    }
  };

  if (loading) return <div className="text-center mt-10">Carregando...</div>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">Enquetes Ativas</h2>
      {polls.length === 0 && (
        <div className="text-center text-gray-500">Nenhuma enquete ativa no momento.</div>
      )}
      <ul className="space-y-6">
        {polls.map((poll) => (
          <li key={poll.id} className="border-b pb-4">
            {/* Título */}
            <div className="font-semibold text-xl mb-1">{poll.title}</div>
            {/* Descrição */}
            <div className="text-gray-500 text-sm mb-2">{poll.description}</div>
            <form onSubmit={(e) => handleVote(e, poll.id)}>
              {/* Opções */}
              <div className="mb-2">
                <span className="font-medium">Opções:</span>
                <div className="flex flex-col ml-2">
                  {poll.options.map((opt) => (
                    <label key={opt.id} className="flex items-center cursor-pointer mb-1">
                      <input
                        type="radio"
                        name={`option_${poll.id}`}
                        value={opt.id}
                        checked={String(selected[poll.id]) === String(opt.id)}
                        onChange={() =>
                          setSelected((prev) => ({ ...prev, [poll.id]: opt.id }))
                        }
                        className="mr-2"
                        required
                      />
                      {opt.text}
                    </label>
                  ))}
                </div>
              </div>
              {/* Nome */}
              <div className="mb-2">
                <label className="block mb-1 font-semibold">Seu nome:</label>
                <input
                  className="border p-2 w-full mb-2"
                  placeholder="Digite seu nome"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>
              {/* Botão */}
              <button
                className={`bg-blue-600 text-white px-4 py-2 rounded mt-2 ${(!name || !selected[poll.id]) ? "opacity-50 cursor-not-allowed" : ""}`}
                type="submit"
                disabled={!name || !selected[poll.id]}
              >
                Votar
              </button>
              {/* Mensagem */}
              {message[poll.id] && (
                <div className={message[poll.id].includes("Redirecionando") ? "text-green-600" : "text-red-600"}>
                  {message[poll.id]}
                </div>
              )}
              {/* Data de expiração */}
              <div className="text-xs text-gray-400 mt-3">
                Expira em: {new Date(poll.expiration).toLocaleString()}
              </div>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
