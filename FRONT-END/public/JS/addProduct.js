const API_URL = "http://localhost:3000/api";

const form = document.getElementById("addProductForm");
const msg = document.getElementById("msg");

const token = sessionStorage.getItem("token");

// Se não estiver logado → redireciona
if (!token) {
  window.location.href = "login.html";
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    name: form.name.value,
    imgUrl: form.imgUrl.value,
    description: form.description.value,
    price: Number(form.price.value),
    sku: form.sku.value,
    stock: Number(form.stock.value)
  };

  try {
    const res = await fetch(`${API_URL}/admin/product`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    const json = await res.json();

    if (!res.ok) {
      msg.style.color = "red";
      msg.textContent = json.error || "Erro ao criar produto.";
      return;
    }

    msg.style.color = "green";
    msg.textContent = "Produto criado com sucesso!";
    form.reset();

  } catch (err) {
    msg.style.color = "red";
    msg.textContent = "Erro de conexão com o servidor.";
  }
});
