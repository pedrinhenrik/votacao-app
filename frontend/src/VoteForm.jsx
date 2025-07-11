import { useState, useEffect } from "react";

export default function VoteForm({ poll, onVoteSuccess }) {
  const [name, setName] = useState(localStorage.getItem("voter_name") || "");
  const [selected, setSelected] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Debug se quiser, pode tirar depois:
    // console.log("Poll recebido em VoteForm:", poll);
  }, [poll]);

  const handleVote = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!name || !selected) return;
    localStorage.setItem("voter_name", name);

    const res = await fetch("http://192.168.1.16:8000/votes/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ option_id: selected, voter_name: name }),
    });

    if (res.ok) {
      setMessage("Voto computado! Obrigado.");
      if (onVoteSuccess) {
        setTimeout(() => onVoteSuccess(), 1000);
      }
    } else {
      const data = await res.json();
      setMessage(data.detail || "Erro ao votar.");
    }
  };

  const options = poll?.options || [];

  return (
    <form
      onSubmit={handleVote}
      className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow space-y-4"
    >
      <div>
        <label className="block mb-2 font-semibold">Digite seu nome para votar:</label>
        <input
          className="border p-2 w-full mb-4"
          placeholder="Seu nome"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
      </div>

      <h2 className="text-2xl font-bold mb-2">{poll.title}</h2>
      <div className="mb-4 text-gray-600">{poll.description}</div>

      <div className="space-y-2">
        {options.length > 0 ? (
          options.map(opt => (
            <label key={opt.id} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="option"
                value={opt.id}
                checked={String(selected) === String(opt.id)}
                onChange={() => setSelected(opt.id)}
                className="mr-2"
                required
              />
              {opt.text}
            </label>
          ))
        ) : (
          <div className="text-red-500">Nenhuma opção disponível para votar.</div>
        )}
      </div>

      <button
        className={`bg-blue-600 text-white px-4 py-2 rounded mt-4 ${(!name || !selected) ? "opacity-50 cursor-not-allowed" : ""}`}
        type="submit"
        disabled={!name || !selected}
      >
        Votar
      </button>

      {message && (
        <div className={message.includes("Obrigado") ? "text-green-600" : "text-red-600"}>
          {message}
        </div>
      )}
    </form>
  );
}
