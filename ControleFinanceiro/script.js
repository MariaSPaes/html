let formulario = document.getElementById("formulario")
let descricao = document.getElementById("descricao")
let valor = document.getElementById("valor")
let listagem = document.getElementById("listagem")
let tipo = document.getElementById("tipo")
let totalEntrada = document.getElementById("totalEntrada")
let totalSaida = document.getElementById("totalSaida")
let totalSaldo = document.getElementById("totalSaldo")
let totalMovimentacoes = document.getElementById("totalMovimentacoes")
let contEntradas = document.getElementById("contEntradas")
let contSaidas = document.getElementById("contSaidas")

let movimentacoes = [] // Array para guardar os dados

formulario.addEventListener("submit", function(event) {
    event.preventDefault()
    
    let texto = descricao.value.trim() // o que o usuário digitou
    let numero = Number(valor.value)  // o que o usuario digitou
    let categoria = tipo.value // entrada ou saida

    if (!texto || !valor.value) {
        alert("Preencha todos os campos antes de adicionar.")
        return
    }

    movimentacoes.push({
        descricao: texto,
        valor: numero,
        tipo: categoria
    })

    mostrar()
    formulario.reset() // Limpar o formulário
})

function formatarDinheiro(valor) {
    return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    })
}

function mostrar() {
    listagem.innerHTML = ""

    let entradas = 0
    let saidas = 0
    let qtdEntradas = 0
    let qtdSaidas = 0

    for (let i = 0; i < movimentacoes.length; i++) {
        let item = movimentacoes[i]

        let li = document.createElement("li")
        li.className = item.tipo === "entrada" ? "item-entrada" : "item-saida"
        li.innerHTML = `<strong>${item.descricao}</strong> <span>${formatarDinheiro(item.valor)}</span>`
        listagem.appendChild(li)

        if (item.tipo === "entrada") {
            entradas += item.valor
            qtdEntradas++
        } else {
            saidas += item.valor
            qtdSaidas++
        }
    }

    totalEntrada.innerHTML = formatarDinheiro(entradas)
    totalSaida.innerHTML = formatarDinheiro(saidas)
    let saldo = entradas - saidas
    totalSaldo.innerHTML = formatarDinheiro(saldo)
    totalSaldo.className = saldo >= 0 ? "saldo-positivo" : "saldo-negativo"

    totalMovimentacoes.innerHTML = movimentacoes.length
    contEntradas.innerHTML = qtdEntradas
    contSaidas.innerHTML = qtdSaidas
}