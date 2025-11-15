const API_URL = "http://localhost:3000/api";

const produtosPage = document.getElementById("productsAdmin")
produtosPage.addEventListener("click",()=> window.location.href="/public/HTML/productsAdmin.html")
// Seletores dos cards
const totalProdutosEl = document.querySelectorAll(".produto-card p")[0];
const totalPedidosEl = document.querySelectorAll(".produto-card p")[1];
const totalUsuariosEl = document.querySelectorAll(".produto-card p")[2];

// Pegar o token do sessionStorage
const token = sessionStorage.getItem("token");
console.log(JSON.parse(atob(token.split('.')[1])));


async function carregarEstatisticas() {
    if (!token) {
        console.error("Usuário não autenticado. Token não encontrado.");
        return;
    }

    try {
        const [produtosRes, pedidosRes, usuariosRes] = await Promise.all([
            fetch(`${API_URL}/products/`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }),
            fetch(`${API_URL}/admin/orders`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }),
            fetch(`${API_URL}/admin/users`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
        ]);

        const produtos = await produtosRes.json();
        const pedidos = await pedidosRes.json();
        const usuarios = await usuariosRes.json();

        totalProdutosEl.textContent = produtos.length;
        totalPedidosEl.textContent = pedidos.length;
        totalUsuariosEl.textContent = usuarios.length;

    } catch (error) {
        console.error("Erro ao carregar estatísticas:", error);
    }
}

carregarEstatisticas();
