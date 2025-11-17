const API_URL = "http://localhost:3000/api";
const lista = document.getElementById("lista-produtos");
const token = sessionStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

async function carregarProdutos() {
    try {
        const res = await fetch(`${API_URL}/products`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const produtos = await res.json();
        lista.innerHTML = "";

        produtos.forEach(prod => {
            const card = document.createElement("div");
            card.classList.add("produto-admin-card");

            card.innerHTML = `
                <img src="${prod.imgUrl}" alt="${prod.name}">
                
                <div class="produto-info">
                    <h3>${prod.name}</h3>
                    <p>Preço: R$ ${prod.price.toFixed(2)}</p>
                    <p>Estoque: ${prod.stock}</p>
                    <p>SKU: ${prod.sku}</p>
                </div>

                <div class="admin-btns">
                    <button class="btn-edit" onclick="editarProduto(${prod.id})">Editar</button>
                    <button class="btn-delete" onclick="excluirProduto(${prod.id})">Excluir</button>
                </div>
            `;

            lista.appendChild(card);
        });

    } catch (err) {
        console.error("Erro ao carregar produtos:", err);
    }
}

function editarProduto(id) {
    sessionStorage.setItem("editProductId", id);
    window.location.href = "editProduct.html";
}

async function excluirProduto(id) {
    if (!confirm("Deseja realmente excluir este produto?")) return;

    try {
        await fetch(`${API_URL}/products/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        carregarProdutos();

    } catch (err) {
        console.error("Erro ao excluir:", err);
    }
}

carregarProdutos();
