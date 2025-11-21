const form = document.getElementById("loginForm");
const msg = document.getElementById("msg");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    email: form.email.value,
    password: form.password.value
  };

  try {
    const res = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // necessário para cookies da sessão
      body: JSON.stringify(data)
    });
    const json = await res.json();

    if (!res.ok) {
      msg.style.color = "red";
      msg.textContent = json.error || "Credenciais inválidas.";
      return;
    }

    msg.style.color = "green";
    msg.textContent = "Login realizado com sucesso! Redirecionando...";

    // redirecionar conforme papel do usuário
    setTimeout(() => {
      if (json.role === "admin") {
        sessionStorage.setItem("token", json.token);
        window.location.href = "/public/HTML/admin.html";
      } else {
        sessionStorage.setItem("token", json.token);
        window.location.href = "/public/HTML/index.html";
      }
    }, 1200);

  } catch (error) {
    msg.style.color = "red";
    msg.textContent = "Erro de conexão com o servidor.";
  }
});
