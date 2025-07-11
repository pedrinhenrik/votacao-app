import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import VoteForm from "./VoteForm";

export default function VoteFormWrapper() {
  const { pollId } = useParams();
  const [poll, setPoll] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://192.168.1.16:8000/polls/${pollId}`)
      .then(res => {
        if (!res.ok) throw new Error("Erro ao carregar enquete");
        return res.json();
      })
      .then(data => setPoll(data))
      .catch(() => setPoll(null));
  }, [pollId]);

  const handleVoteSuccess = () => {
    navigate(`/results/${pollId}`);
  };

  if (poll === null) return <div className="text-center mt-10">Enquete não encontrada.</div>;
  if (!poll) return <div className="text-center mt-10">Carregando enquete...</div>;
  if (!poll.options || poll.options.length === 0)
    return <div className="text-center mt-10">Essa enquete não possui opções para votar.</div>;

  return <VoteForm poll={poll} onVoteSuccess={handleVoteSuccess} />;
}
