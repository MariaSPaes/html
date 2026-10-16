let input = document.getElementById("input")
let botao = document.getElementById("botao")
let resultado = document.getElementById("resultado")
    
    async function buscarPokemon(nome) {
        try{
            let resposta = await fetch("https://pokeapi.co/api/v2/pokemon/" + nome)

            if(!resposta.ok){
                resultado.innerText = "Pokemon não encontrado"
                return
            }

            let dados = await resposta.json()
            resultado.innerText = ""

            let nomePokemon = document.createElement("h2")
            nomePokemon.innerText = dados.name   
            let imagemPokemon = document.createElement("img")
            imagemPokemon.src = dados.sprites.front_default
            imagemPokemon.alt = dados.name

            resultado.appendChild (nomePokemon)
            resultado.appendChild(imagemPokemon)
            
        } catch (erro) {
            resultado.innerText = "Erro ao buscar Pokémon"
        }
    }
    botao.addEventListener("click", function(){
        buscarPokemon(input.value)
    })