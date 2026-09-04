function contarDias() {

    let hoje = new Date()

    let fimSemestre = new Date(2026, 10, 27)

    let diferenca = fimSemestre - hoje


    if (diferenca <= 0) {

        document.getElementById("fimsemestre").innerText =
            "O semestre terminou!"

        return
    }


    // Converter a diferença

    let meses = Math.floor(
        diferenca / 1000 / 60 / 60 / 24 / 30
    )

    let dias = Math.floor(
        diferenca / 1000 / 60 / 60 / 24
    ) % 30

    let horas = Math.floor(
        diferenca / 1000 / 60 / 60
    ) % 24

    let minutos = Math.floor(
        diferenca / 1000 / 60
    ) % 60

    let segundos = Math.floor(
        diferenca / 1000
    ) % 60


    let fimsemestre =
        document.getElementById("fimsemestre")


    fimsemestre.innerText =
        meses + " meses " +
        dias + " dias " +
        horas + " horas " +
        minutos + " minutos e " +
        segundos + " segundos"
}



contarDias()


setInterval(contarDias, 1000)