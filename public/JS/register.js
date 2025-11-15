const form = document.getElementById("registerForm");
const msg = document.getElementById("msg");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    name: form.name.value,
    email: form.email.value,
    password: form.password.value
  };

  try {
    const res = await fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const json = await res.json();

    if (!res.ok) {
      msg.style.color = "red";
      msg.textContent = json.error || "Erro ao cadastrar.";
      return;
    }

    msg.style.color = "green";
    msg.textContent = "Cadastro realizado! Redirecionando para Login...";

    setTimeout(() => {
      window.location.href = "/login.html";
    }, 1500);

  } catch (error) {
    msg.style.color = "red";
    msg.textContent = "Erro ao conectar com o servidor.";
  }
});
