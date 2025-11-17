// Pega o ID da URL
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");
const token = sessionStorage.getItem("token")

const form = document.querySelector("#editProductForm");
const msg = document.querySelector("#msg");

// Carrega o produto existente
async function loadProduct() {
    if (!productId) {
        msg.textContent = "ID inválido.";
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/products/${productId}`);
        if (!response.ok) throw new Error("Erro ao carregar produto.");

        const product = await response.json();

        form.name.value = product.name;
        form.imgUrl.value = product.imgUrl;
        form.description.value = product.description;
        form.price.value = product.price;
        form.sku.value = product.sku;
        form.stock.value = product.stock;

    } catch (error) {
        msg.textContent = "Não foi possível carregar o produto.";
    }
}

loadProduct();

// Enviar alterações
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const body = {
        name: form.name.value,
        imgUrl: form.imgUrl.value,
        description: form.description.value,
        price: Number(form.price.value),
        sku: form.sku.value,
        stock: Number(form.stock.value)
    };

    try {
        const response = await fetch(`http://localhost:3000/api/admin/editProduct/${productId}`, {
            method: "PUT",
            headers: {  "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
             },
            body: JSON.stringify(body)
        });

        if (!response.ok) throw new Error();

        msg.style.color = "green";
        msg.textContent = "Produto atualizado com sucesso!";

    } catch (error) {
        msg.style.color = "red";
        msg.textContent = "Erro ao atualizar produto.";
    }
});
