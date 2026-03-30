const input = document.getElementById("fileInput");
const tabela = document.getElementById("tabela");

let transacoes = [];

input.addEventListener("change", (e) => {
  const file = e.target.files[0];

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: (result) => {
      transacoes = normalizar(result.data);
      render();
    }
  });
});

function normalizar(dados) {
  return dados.map(item => {
    const valor = parseFloat(item.valor || item.amount || 0);

    return {
      descricao: item.descricao || item.description || "Sem descrição",
      valor: valor,
      categoria: item.categoria || "outros",
      tipo: valor >= 0 ? "entrada" : "saida",
      data: item.data || item.date || ""
    };
  });
}

function render() {
  tabela.innerHTML = "";

  let entrada = 0;
  let saida = 0;

  transacoes.forEach(t => {
    if (t.tipo === "entrada") entrada += t.valor;
    else saida += Math.abs(t.valor);

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${t.descricao}</td>
      <td>${t.valor}</td>
      <td>${t.categoria}</td>
      <td>${t.tipo}</td>
      <td>${t.data}</td>
    `;

    tabela.appendChild(tr);
  });

  document.getElementById("entrada").innerText = entrada.toFixed(2);
  document.getElementById("saida").innerText = saida.toFixed(2);
  document.getElementById("saldo").innerText = (entrada - saida).toFixed(2);
}

// envia pro backend
async function enviar() {
  await fetch("/api/transacoes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(transacoes)
  });

  alert("Dados enviados 🚀");
}