// Seletores
const produtosContainer = document.querySelector(".produtos");
const finalizarBtn = document.getElementById("finalizar-compra");

// Função para carregar o carrinho
function carregarCarrinho() {
    const cartContainer = document.querySelector(".produtos");
    cartContainer.innerHTML = "";

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    let total = 0;

    cart.forEach((item, index) => {
        const subtotal = item.price * item.quantity;
        total += subtotal;

        const produtoCard = document.createElement("div");
        produtoCard.classList.add("produto-card");

        produtoCard.innerHTML = `
            <img src="${item.imgUrl}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p>R$ ${item.price.toFixed(2)}</p>
            <p>Quantidade: ${item.quantity}</p>
            <p>Subtotal: R$ ${subtotal.toFixed(2)}</p>
            <button class="cta-button remover">Remover</button>
        `;

        produtoCard.querySelector(".remover").addEventListener("click", () => {
            cart.splice(index, 1);
            localStorage.setItem("cart", JSON.stringify(cart));
            carregarCarrinho();
        });

        cartContainer.appendChild(produtoCard);
    });

    const totalEl = document.querySelector("#totalCarrinho");
    if (totalEl) {
        totalEl.textContent = `Total: R$ ${total.toFixed(2)}`;
    }
}

// Finalizar compra
finalizarBtn.addEventListener("click", async () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    if (cart.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    const token = sessionStorage.getItem("token"); // ou localStorage se estiver salvo lá
    if (!token) {
        alert("Você precisa estar logado para finalizar a compra!");
        return;
    }

    const itens = cart.map(item => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity
    }));

    const total = itens.reduce((acc, item) => acc + item.price * item.quantity, 0);

    try {
        const res = await fetch("http://localhost:3000/api/orders/order", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ itens, total })
        });

        if (!res.ok) {
            const error = await res.json();
            alert("Erro ao finalizar pedido: " + (error.error || "Desconhecido"));
            return;
        }

        alert("Compra finalizada com sucesso!");
        localStorage.removeItem("cart");
        carregarCarrinho();
    } catch (err) {
        console.error("Erro de conexão:", err);
        alert("Erro de conexão com o servidor.");
    }
});

// Inicializa
carregarCarrinho();
