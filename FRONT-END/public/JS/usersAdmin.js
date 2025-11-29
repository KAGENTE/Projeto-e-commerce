const API_URL = "http://localhost:3000/api";

async function carregarUsuarios() {
    const tabela = document.getElementById("usersTableBody");
    token = sessionStorage.getItem("token")

    try {
        // Buscar usuários
        const usersRes = await fetch(`${API_URL}/admin/users`, {
            headers: {
                    "Authorization": `Bearer ${token}`
                }
        });
        const users = await usersRes.json();

        // Buscar pedidos
        const ordersRes = await fetch(`${API_URL}/admin/orders`, {
            headers: {
                    "Authorization": `Bearer ${token}`
                }
        });
        const orders = await ordersRes.json();

        // Relacionar userId → total de pedidos
        const pedidosPorUsuario = {};
        orders.forEach(order => {
            pedidosPorUsuario[order.userId] =
                (pedidosPorUsuario[order.userId] || 0) + 1;
        });

        tabela.innerHTML = "";

        users.forEach(user => {
            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td style="padding: 10px;">${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td>${user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}</td>
                <td>${pedidosPorUsuario[user.id] || 0}</td>
            `;

            tabela.appendChild(tr);
        });

    } catch (err) {
        console.error("Erro ao carregar usuários:", err);
    }
}

carregarUsuarios();
