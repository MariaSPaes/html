let perguntas = [
  {
    pergunta: "Qual filme do Studio Ghibli tem a personagem Chihiro?",
    respostas: ["Meu Amigo Totoro", "A Viagem de Chihiro", "Ponyo", "O Castelo Animado"],
    correta: 1
  },
  {
    pergunta: "Qual criatura grande aparece em Meu Amigo Totoro?",
    respostas: ["Totoro", "Ponyo", "Calcifer", "Jiji"],
    correta: 0
  },
  {
    pergunta: "Em O Castelo Animado, qual é o nome do mago?",
    respostas: ["Haku", "Howl", "Ashitaka", "Porco Rosso"],
    correta: 1
  },
  {
    pergunta: "Qual filme tem uma peixinha mágica que quer virar humana?",
    respostas: ["Ponyo", "Princesa Mononoke", "Sussurros do Coração", "Vidas ao Vento"],
    correta: 0
  },
  {
    pergunta: "Qual personagem é uma bruxinha aprendiz que trabalha fazendo entregas?",
    respostas: ["Sophie", "Kiki", "San", "Chihiro"],
    correta: 1
  },
  {
    pergunta: "Em A Viagem de Chihiro, qual é o nome do dragão que ajuda Chihiro?",
    respostas: ["Haku", "Totoro", "Howl", "Jiji"],
    correta: 0
  },
  {
    pergunta: "Qual filme do Studio Ghibli mostra uma princesa criada por lobos?",
    respostas: ["Ponyo", "Princesa Mononoke", "O Reino dos Gatos", "O Castelo no Céu"],
    correta: 1
  },
  {
    pergunta: "Qual é o nome do gato preto de Kiki?",
    respostas: ["Jiji", "Calcifer", "Baron", "Muta"],
    correta: 0
  },
  {
    pergunta: "Qual personagem é uma chama mágica em O Castelo Animado?",
    respostas: ["Haku", "Calcifer", "Totoro", "No-Face"],
    correta: 1
  },
  {
    pergunta: "Qual filme tem a personagem Sophie?",
    respostas: ["O Castelo Animado", "A Viagem de Chihiro", "Meu Amigo Totoro", "Ponyo"],
    correta: 0
  }
];

let perguntaAtual = 0;
let pontuacao = 0
let respondeu = false

function mostrarPergunta() {
  respondeu = false

  let pergunta = perguntas[perguntaAtual];

  document.getElementById("pergunta").innerText = pergunta.pergunta;
  document.getElementById("resultado").innerText = ""
  document.getElementById("proxima").style.display = "none"

  let respostasDiv = document.getElementById("respostas")
  respostasDiv.innerHTML = ""

  pergunta.respostas.forEach(function(resposta, index) {
    respostasDiv.innerHTML += `
      <button class="resposta" onclick="verificarResposta(${index})">
        ${resposta}
      </button>
    `
  })
}

function verificarResposta(index) {
  if (respondeu === true) {
    return
  }

  respondeu = true

  let pergunta = perguntas[perguntaAtual]
  let resultado = document.getElementById("resultado")

  if (index === pergunta.correta) {
    pontuacao++;
    resultado.innerText = "Resposta correta!"
    resultado.style.color = "#59ff30"
  } else {
    resultado.innerText = "Resposta incorreta!"
    resultado.style.color = "#ff7272"
  }

  document.getElementById("proxima").style.display = "block"
}

function proximaPergunta() {
  perguntaAtual++

  if (perguntaAtual < perguntas.length) {
    mostrarPergunta()
  } else {
    mostrarResultadoFinal()
  }
}

function mostrarResultadoFinal() {
  document.getElementById("container").innerHTML = `
    <h1>Quiz Finalizado</h1>
    <p>Sua pontuação foi: ${pontuacao} de ${perguntas.length}</p>
    <button onclick="reiniciarQuiz()">Reiniciar Quiz</button>
  `
}

function reiniciarQuiz() {
  perguntaAtual = 0
  pontuacao = 0
  mostrarPergunta()
}

mostrarPergunta()