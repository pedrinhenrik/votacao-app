import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // hook para redirecionar

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://192.168.1.16:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ username: email, password }),
      });
      if (!res.ok) {
        setError("Credenciais inválidas.");
        return;
      }
      const data = await res.json();
      localStorage.setItem("token", data.access_token);
      if (onLogin) onLogin();
      navigate("/admin"); // redireciona após login
    } catch {
      setError("Erro ao conectar.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xs mx-auto mt-12 p-6 bg-white rounded-xl shadow space-y-4">
      <h2 className="text-xl font-bold mb-2">Login Admin</h2>
      {error && <div className="text-red-600">{error}</div>}
      <input
        className="border p-2 w-full"
        placeholder="Email"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        className="border p-2 w-full"
        placeholder="Senha"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">
        Entrar
      </button>
    </form>
  );
}
