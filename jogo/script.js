const nao = document.getElementById("nao");
const sim = document.getElementById("sim");
const mensagem = document.getElementById("mensagem");

function fugir() {
    const largura = window.innerWidth - nao.offsetWidth;
    const altura = window.innerHeight - nao.offsetHeight;

    const x = Math.random() * largura;
    const y = Math.random() * altura;

    nao.style.position = "fixed";
    nao.style.left = `${x}px`;
    nao.style.top = `${y}px`;
}

nao.addEventListener("mouseenter", fugir);

sim.addEventListener("click", () => {
    document.body.innerHTML = `
        <div style="
            height:100vh;
            display:flex;
            flex-direction:column;
            justify-content:center;
            align-items:center;
            background:linear-gradient(135deg,#fff5f7,#ffe3eb);
            font-family:Segoe UI,sans-serif;
            text-align:center;
        ">
            <h1 style="
                color:#7d1d4e;
                font-size:70px;
                margin-bottom:20px;
            ">
                ❤️ EBAAAA ❤️
            </h1>

            <h2 style="
                color:#7d1d4e;
                font-size:35px;
            ">
                Sabia que você ia deixar 😎
            </h2>
        </div>
    `;
});