// Simulação de dados dos produtos
const produtos = {
    feminino: [
        { nome: "Pijama Sonho Lilás", preco: "R$ 129,90", imagem: "Placeholder Feminino 1" },
        { nome: "Camisola Estrelada", preco: "R$ 99,50", imagem: "Placeholder Feminino 2" },
        { nome: "Short Doll Conforto", preco: "R$ 85,00", imagem: "Placeholder Feminino 3" },
    ],
    masculino: [
        { nome: "Pijama Clássico Grafite", preco: "R$ 149,90", imagem: "Placeholder Masculino 1" },
        { nome: "Calça Moletom Noite", preco: "R$ 110,00", imagem: "Placeholder Masculino 2" },
        { nome: "Camiseta Sono Leve", preco: "R$ 75,00", imagem: "Placeholder Masculino 3" },
    ]
};

const navLinks = document.querySelectorAll('.nav-link');
const produtosContainer = document.getElementById('produtos-container');

// Função para renderizar os produtos
function renderizarProdutos(categoria) {
    produtosContainer.innerHTML = ''; // Limpa o conteúdo atual

    const listaProdutos = produtos[categoria];

    listaProdutos.forEach(produto => {
        const card = document.createElement('div');
        card.className = 'produto-card';

        // Usamos um <div> simples para simular a imagem, conforme o CSS.
        card.innerHTML = `
            <div class="produto-card-img">
                <img src="#" alt="Imagem do Pijama ${produto.nome}" style="object-fit: contain; background-color: var(--lilas-suave); display: flex; align-items: center; justify-content: center; font-weight: bold;">
                <span style="display: block; padding: 100px 0; color: var(--texto-escuro);">${produto.imagem}</span>
            </div>
            <h3>${produto.nome}</h3>
            <p>${produto.preco}</p>
        `;
        
        // Substituir o innerHTML para funcionar com a simulação de imagem
        card.querySelector('.produto-card-img').innerHTML = `<img alt="Imagem do Pijama ${produto.nome}">`;
        card.querySelector('img').style.cssText = "width: 100%; height: 250px; object-fit: cover; background-color: var(--lilas-suave); display: flex; align-items: center; justify-content: center; font-weight: bold; color: var(--texto-escuro);";
        card.querySelector('img').setAttribute('src', `https://via.placeholder.com/300x250/d8bfd8/3b103a?text=${produto.imagem.replace(/ /g, '+')}`);
        
        produtosContainer.appendChild(card);
    });
}

// Lógica para alternar as guias
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove a classe 'active' de todos os links
        navLinks.forEach(l => l.classList.remove('active'));
        
        // Adiciona 'active' ao link clicado
        e.target.classList.add('active');
        
        // Renderiza os produtos da categoria selecionada
        const categoria = e.target.getAttribute('data-categoria');
        renderizarProdutos(categoria);
    });
});

// Carrega a categoria Feminino por padrão ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    renderizarProdutos('feminino');
});

// Ação para o botão CTA
document.getElementById('ver-pijamas').addEventListener('click', () => {
    // Rola a tela até a seção de produtos
    document.getElementById('produtos-container').scrollIntoView({ behavior: 'smooth' });
});