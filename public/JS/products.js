const API_URL = "http://localhost:3000/api";

// Pega o token do sessionStorage
const token = sessionStorage.getItem("token");

// Pega o ID do produto da URL (ex: product.html?id=1)
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");

// Seletores
const imgEl = document.querySelector(".produto-imagem img");
const nomeEl = document.querySelector(".produto-info h2");
const priceEl = document.querySelector(".produto-info .price");
const descEl = document.querySelector(".produto-info p:nth-of-type(2)");
const skuEl = document.querySelector(".produto-info p:nth-of-type(3)");
const stockEl = document.querySelector(".produto-info p:nth-of-type(4)");
const addToCartBtn = document.querySelector(".produto-info .cta-button");
const comentariosContainer = document.querySelector(".comentarios-container");

// Função para carregar o produto
async function carregarProduto() {
    try {
        const res = await fetch(`${API_URL}/products/${productId}`);
        if (!res.ok) throw new Error("Erro ao carregar produto");

        const produto = await res.json();

        imgEl.src = produto.imgUrl || "https://via.placeholder.com/400x400";
        nomeEl.textContent = produto.name;
        priceEl.textContent = `R$ ${produto.price.toFixed(2)}`;
        descEl.textContent = produto.description || "-";
        skuEl.textContent = `SKU: ${produto.sku}`;
        stockEl.textContent = `Estoque disponível: ${produto.stock}`;

    } catch (err) {
        console.error(err);
        nomeEl.textContent = "Produto não encontrado.";
    }
}

// Função para carregar reviews
async function carregarReviews() {
    try {
        const res = await fetch(`${API_URL}/reviews/products/${productId}/reviews`);
        if (!res.ok) throw new Error("Erro ao carregar reviews");

        const reviews = await res.json();

        // Limpa comentários antigos
        const comentariosExistentes = comentariosContainer.querySelectorAll(".comentario");
        comentariosExistentes.forEach(c => c.remove());

        // Adiciona cada review
        reviews.forEach(r => {
            const div = document.createElement("div");
            div.classList.add("comentario");
            div.innerHTML = `
                <strong>${r.user.name}</strong> <span class="avaliacao">${"★".repeat(r.rating)}${"☆".repeat(5-r.rating)}</span>
                <p>${r.comment}</p>
            `;
            comentariosContainer.insertBefore(div, comentariosContainer.querySelector(".nova-avaliacao"));
        });

    } catch (err) {
        console.error(err);
    }
}

// Função para adicionar ao carrinho
addToCartBtn.addEventListener("click", () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const productIdNum = Number(productId);
    const priceNum = Number(priceEl.textContent.replace("R$ ", "").replace(",", "."));

    // Verifica se o produto já está no carrinho
    const existingIndex = cart.findIndex(item => item.productId === productIdNum);

    if (existingIndex > -1) {
        // Incrementa a quantidade
        cart[existingIndex].quantity += 1;
    } else {
        // Adiciona novo produto
        cart.push({
            productId: productIdNum,
            name: nomeEl.textContent,
            price: priceNum,
            imgUrl: imgEl.src,
            quantity: 1
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Produto adicionado ao carrinho!");
});

// Função para enviar nova review
const novaAvaliacaoBtn = document.querySelector(".nova-avaliacao button");
const novaAvaliacaoTextarea = document.querySelector(".nova-avaliacao textarea");

novaAvaliacaoBtn.addEventListener("click", async () => {
    const comment = novaAvaliacaoTextarea.value.trim();
    const rating = parseInt(prompt("Avaliação de 0 a 5 estrelas:"));

    if (!comment || isNaN(rating) || rating < 0 || rating > 5) {
        alert("Comentário ou avaliação inválidos.");
        return;
    }

    try {
        const res = await fetch(`${API_URL}/reviews/reviews`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                productId: Number(productId),
                rating,
                comment
            })
        });

        const json = await res.json();

        if (!res.ok) {
            alert(json.error || "Erro ao enviar review.");
            return;
        }

        novaAvaliacaoTextarea.value = "";
        carregarReviews(); // Recarrega reviews após adicionar

    } catch (err) {
        console.error(err);
        alert("Erro ao enviar review.");
    }
});
const reviewSummaryEl = document.getElementById("review-summary");

async function carregarResumoIA() {
    try {
        const res = await fetch(`${API_URL}/reviews/products/${productId}/IA`, {
            method : "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!res.ok) throw new Error("Erro ao carregar resumo da IA");

        const data = await res.json();

        // O seu back-end deve retornar algo como { summary: "texto do resumo" }
        reviewSummaryEl.textContent = data.summary || "Não foi possível gerar resumo.";

    } catch (err) {
        console.error(err);
        reviewSummaryEl.textContent = "Erro ao carregar resumo da IA.";
    }
}
// Inicializa
carregarProduto();
carregarReviews();
carregarResumoIA();
