import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
import PollForm from "./PollForm";
import PollList from "./PollList";
import PollResults from "./PollResults";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <header className="py-6 bg-blue-600 text-white text-center text-3xl font-bold">
        Votação em tempo real
      </header>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <PollForm />
            </ProtectedRoute>
          }
        />

        {/* Rota de resultados */}
        <Route path="/results/:pollId" element={<PollResults />} />

        {/* Página principal com enquetes + votação */}
        <Route path="/" element={<PollList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
