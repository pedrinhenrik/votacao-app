import { useState } from "react";

export default function PollForm({ onCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [expiration, setExpiration] = useState("");
  const [message, setMessage] = useState("");

  const handleOptionChange = (i, value) => {
    const newOptions = [...options];
    newOptions[i] = value;
    setOptions(newOptions);
  };

  const addOption = () => setOptions([...options, ""]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const pollData = {
      title,
      description,
      expiration,
      options: options.filter((opt) => opt.trim() !== ""),
    };

    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://192.168.1.16:8000/polls/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token,
        },
        body: JSON.stringify(pollData),
      });
      if (res.ok) {
        setMessage("Enquete criada com sucesso!");
        setTitle("");
        setDescription("");
        setOptions(["", ""]);
        setExpiration("");
        if (onCreated) onCreated();
      } else if (res.status === 401) {
        setMessage("Não autorizado. Faça login novamente.");
      } else {
        setMessage("Erro ao criar enquete.");
      }
    } catch {
      setMessage("Erro de conexão.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto mt-6 p-6 bg-white rounded-xl shadow space-y-4">
      <h2 className="text-xl font-bold">Criar nova enquete</h2>
      {message && <div className={message.includes("sucesso") ? "text-green-600" : "text-red-600"}>{message}</div>}
      <input
        className="border p-2 w-full"
        placeholder="Título"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />
      <textarea
        className="border p-2 w-full"
        placeholder="Descrição"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />
      <input
      type="datetime-local"
      value={expiration}
      onChange={e => setExpiration(e.target.value)}
      required
      />
      <div>
        <div className="font-semibold mb-1">Opções</div>
        {options.map((opt, i) => (
          <input
            key={i}
            className="border p-2 w-full mb-2"
            placeholder={`Opção ${i + 1}`}
            value={opt}
            onChange={e => handleOptionChange(i, e.target.value)}
            required
          />
        ))}
        <button type="button" className="mt-2 text-blue-500" onClick={addOption}>
          + Adicionar opção
        </button>
      </div>
      <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">
        Criar enquete
      </button>
    </form>
  );
}
