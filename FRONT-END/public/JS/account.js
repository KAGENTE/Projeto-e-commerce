const API_URL = "http://localhost:3000/api";
token = sessionStorage.getItem("token")
if(!token){
    window.location.href = "login.html"
}
// Carregar perfil do usuário
async function carregarPerfil() {
    try {
        const res = await fetch(`${API_URL}/auth/profile`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const user = await res.json();

        if (!res.ok) {
            console.error("Erro ao carregar perfil:", user);
            return;
        }
        

        document.getElementById("userId").textContent = user.id;
        document.getElementById("userName").textContent = user.name;
        document.getElementById("userEmail").textContent = user.email;

        carregarPedidos(user.id);

    } catch (err) {
        console.error("Erro de conexão:", err);
    }
}

// Carregar pedidos do usuário
async function carregarPedidos(userId) {
    try {
        const res = await fetch(`${API_URL}/orders/my-orders/`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const orders = await res.json();
        const tbody = document.getElementById("ordersBody");
        tbody.innerHTML = "";

        orders.forEach(order => {
            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td style="padding:10px;">${order.id}</td>
                <td>${new Date(order.data).toLocaleDateString()}</td>
                <td>${order.status || "Pendente"}</td>
                <td>R$ ${order.total?.toFixed(2) || "0.00"}</td>
            `;

            tbody.appendChild(tr);
        });

    } catch (err) {
        console.error("Erro ao carregar pedidos:", err);
    }
}

carregarPerfil();
