const API_URL = "http://localhost:3000/api";

const pedidosLista = document.getElementById("pedidosLista");

const token = sessionStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

async function carregarPedidos() {
    try {
        const res = await fetch(`${API_URL}/admin/orders`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!res.ok) {
            pedidosLista.innerHTML = "<p>Erro ao carregar pedidos.</p>";
            return;
        }

        const pedidos = await res.json();
        pedidosLista.innerHTML = "";

        pedidos.forEach(p => {
            const card = document.createElement("div");
            card.classList.add("pedido-card");

            card.innerHTML = `
                <div class="pedido-info">
                    <h3>Pedido #${p.id}</h3>
                    <p><strong>Usuário:</strong> ${p.user?.name ?? "Desconhecido"}</p>
                    <p><strong>Total:</strong> R$ ${p.total.toFixed(2)}</p>
                    <p><strong>Status:</strong> ${p.status}</p>
                    <p><strong>Data:</strong> ${new Date(p.createdAt).toLocaleString()}</p>
                </div>

                <div class="pedido-btns">
                    <button class="btn-status" onclick="atualizarStatus(${p.id})">Atualizar Status</button>
                    <button class="btn-delete-order" onclick="deletarPedido(${p.id})">Excluir</button>
                </div>
            `;

            pedidosLista.appendChild(card);
        });

    } catch (error) {
        pedidosLista.innerHTML = "<p>Erro de conexão com o servidor.</p>";
    }
}

async function atualizarStatus(id) {
    const novoStatus = prompt("Novo status (ex: PROCESSANDO, ENVIADO, ENTREGUE):");

    if (!novoStatus) return;

    try {
        const res = await fetch(`${API_URL}/admin/orders/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ status: novoStatus })
        });

        if (!res.ok) {
            alert("Erro ao atualizar status.");
            return;
        }

        carregarPedidos();

    } catch (_) {
        alert("Erro de conexão.");
    }
}

async function deletarPedido(id) {
    if (!confirm("Deseja realmente excluir este pedido?")) return;

    try {
        const res = await fetch(`${API_URL}/admin/orders/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!res.ok) {
            alert("Erro ao excluir pedido.");
            return;
        }

        carregarPedidos();

    } catch (_) {
        alert("Erro de conexão.");
    }
}

carregarPedidos();
