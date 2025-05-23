import { useState } from 'react';
import { toast } from 'react-hot-toast';


export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validação simples do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Por favor, insira um email válido.');
      return;
    }

    setLoading(true);

    // Simula envio (substitua pela sua API)
    setTimeout(() => {
      setLoading(false);
      toast.success('Inscrição realizada com sucesso!');
      setEmail('');
    }, 1500);
  };

  return (
    <section className="bg-pink-50 py-10 px-4 mt-12 rounded-lg max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-center text-pink-700">Receba as novidades!</h2>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <input
          type="email"
          placeholder="Seu melhor email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-grow px-4 py-2 border border-pink-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-400"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-pink-600 text-white px-6 py-2 rounded hover:bg-pink-700 transition disabled:opacity-50"
        >
          {loading ? 'Enviando...' : 'Assinar'}
        </button>
      </form>
    </section>
  );
}
