function adicionar() {
    //Trazer o input e a lista
    let tarefa = document.getElementById("tarefa").value
   let lista = document.getElementById("lista")
   let tarefaInput = document.getElementById("tarefa")


   //Não aceitar tarefa vazia
   if (tarefa == "") {
    alert("Digite uma tarefa!")
    return //interromper a execução
   }

   //Criar o li
   let novaTarefa = document.createElement("li")
   novaTarefa.innerText = tarefa

   //Adicionar o li no site
   lista.appendChild(novaTarefa)

   //Limpar o input
   tarefaInput.value = ""

   //Apagar a tarefa
   novaTarefa.onclick = function() {
    lista.removeChild(novaTarefa)
   }
}
