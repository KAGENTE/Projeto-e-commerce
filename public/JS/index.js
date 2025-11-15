
async function carregarProdutos() {
    try {
        const resposta = await fetch("http://localhost:3000/api/products");
        const produtos = await resposta.json();

        const container = document.querySelector(".produtos");

        container.innerHTML = ""; // limpar antes de renderizar

        produtos.forEach(produto => {
            const card = document.createElement("div");
            card.classList.add("produto-card");

            card.innerHTML = `
                <img src="${produto.imgUrl}" alt="${produto.name}">
                <h3>${produto.name}</h3>
                <p>R$ ${produto.price.toFixed(2)}</p>
            `;

            // Ao clicar, ir para página do produto
            card.addEventListener("click", () => {
                window.location.href = `product.html?id=${produto.id}`;
            });

            container.appendChild(card);
        });

    } catch (erro) {
        console.error("Erro ao carregar produtos:", erro);
    }
}

// Executa ao carregar a página
document.addEventListener("DOMContentLoaded", carregarProdutos);

