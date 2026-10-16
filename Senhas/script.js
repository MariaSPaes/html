console.log(Math.random());
let letras = "abcdefghijklmnopqrstuvwxyz"
let aleatorio = Math.floor(Math.random() * letras.length)

console.log(letras[aleatorio])

let maiusculas = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
let minusculas = "abcdefghijklmnopqrstuvwxyz"
let numeros = "0123456789"
let simbolos = "!@#$%&*()_+-="
function gerarSenha(tamanho, banco) {
    let senha = ""
    for(let i = 0; i < tamanho; i++) {
let indice = Math.floor(Math.floor(Math.random() * banco.length))
senha += banco[indice]
    }
    return senha
}
console.log(gerarSenha(8, maiusculas + minusculas + numeros + simbolos))

let tamanhoInput = document.getElementById("tamanho")
let gerar = document.getElementById("gerar")
let resultado = document.getElementById("resultado")

gerar.addEventListener("click", function() {
let tamanho = tamanhoInput.value
let banco = montarBanco()
if(banco == "") {
   resultado.innerText = "Selecione pelo menos uma opção"
    return
}
let senha = gerarSenha(tamanho, banco)
resultado.innerText = senha
})

let checkmaiusculas = document.getElementById("maiusculas")
let checkminusculas = document.getElementById("minusculas")
let checknumeros = document.getElementById("numeros")
let checksimbolos = document.getElementById("simbolos")

function montarBanco() {
    let banco = ""
    if(checkmaiusculas.checked) {
        banco += maiusculas
    }
    if(checkminusculas.checked) {
        banco += minusculas
    }
    if(checknumeros.checked) {
        banco += numeros
    }
    if(checksimbolos.checked) {
        banco += simbolos
    }
    return banco
}

let copiar = document.getElementById("copiar")
copiar.addEventListener("click", async function() {
    let senhaAtual = resultado.textContent

    if(senhaAtual == "") {
        alert("Nenhuma senha gerada")
        return
    }
    await navigator.clipboard.writeText(senhaAtual)

    copiar.innerText = "Senha copiada!"
    setTimeout(function() {
        copiar.innerText = "Copiar senha"
    }, 2000)
}) 
