export default async function handler(req, res) {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_KEY;

  if (req.method === "POST") {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/transacoes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_KEY,
          "Authorization": `Bearer ${SUPABASE_KEY}`
        },
        body: JSON.stringify(req.body)
      });

      const data = await response.json();

      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ erro: "Erro ao salvar" });
    }
  }

  return res.status(405).json({ erro: "Método não permitido" });
}