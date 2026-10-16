const input = document.getElementById("input")
const formulario = document.getElementById("busca-cidade")
const mensagem = document.getElementById("mensagem")

function traduzirClima(codigo) {
    if (codigo === 0) return { texto: "Céu limpo" }
    if (codigo === 1) return { texto: "Predominantemente limpo" }
    if (codigo === 2) return { texto: "Parcialmente nublado" }
    if (codigo === 3) return { texto: "Encoberto" }
    if (codigo === 45 || codigo === 48) return { texto: "Neblina" }
    if (codigo >= 51 && codigo <= 57) return { texto: "Garoa" }
    if ((codigo >= 61 && codigo <= 67) || (codigo >= 80 && codigo <= 82)) return { texto: "Chuva" }
    if ((codigo >= 71 && codigo <= 77) || codigo === 85 || codigo === 86) return { texto: "Neve" }
    if (codigo >= 95 && codigo <= 99) return { texto: "Trovoada" }
    return { texto: "Condição indisponível" }
}

function obterIconeClima(codigo) {
    const sol = '<circle cx="43" cy="20" r="8" fill="#f7c969"/><path d="M43 5v4m0 22v4M28 20h-4m38 0h-4M32.5 9.5l-3-3m27 27-3-3m0-21 3-3m-27 27 3-3" stroke="#f7c969" stroke-width="2.5" stroke-linecap="round"/>'
    const nuvem = '<path d="M17 43h31a9 9 0 0 0 0-18 13.5 13.5 0 0 0-25-3A10.5 10.5 0 0 0 17 43Z" fill="#dcecff" stroke="#f5f9ff" stroke-width="2.5" stroke-linejoin="round"/>'
    let detalhes = ""

    if (codigo === 0) {
        detalhes = '<circle cx="32" cy="32" r="12" fill="#f7c969"/><path d="M32 8v5m0 38v5M8 32h5m38 0h5M15 15l4 4m26 26 4 4m0-34-4 4m-26 26-4 4" stroke="#f7c969" stroke-width="3" stroke-linecap="round"/>'
    } else if (codigo === 1 || codigo === 2) {
        detalhes = sol + nuvem
    } else if (codigo === 45 || codigo === 48) {
        detalhes = nuvem + '<path d="M14 50h36m-32 7h28" stroke="#b7d3ef" stroke-width="3" stroke-linecap="round"/>'
    } else if (codigo >= 71 && codigo <= 77 || codigo === 85 || codigo === 86) {
        detalhes = nuvem + '<path d="M24 50v8m-4-4h8m7-4v8m-4-4h8m7-4v8m-4-4h8" stroke="#a9d9ff" stroke-width="2.5" stroke-linecap="round"/>'
    } else if (codigo >= 95 && codigo <= 99) {
        detalhes = nuvem + '<path d="m35 44-8 11h7l-2 8 11-13h-8l4-6" fill="#f7c969" stroke="#f7c969" stroke-linejoin="round" stroke-width="1.5"/>'
    } else if (codigo >= 51 && codigo <= 67 || codigo >= 80 && codigo <= 82) {
        detalhes = nuvem + '<path d="m24 49-3 7m15-7-3 7m15-7-3 7" stroke="#86c8f4" stroke-width="3" stroke-linecap="round"/>'
    } else {
        detalhes = nuvem
    }

    return `<svg viewBox="0 0 64 64" fill="none" aria-hidden="true" focusable="false">${detalhes}</svg>`
}

function renderizarIconeClima(elemento, codigo) {
    elemento.innerHTML = obterIconeClima(codigo)
}

function formatarTemperatura(valor) {
    return `${Math.round(valor)}°`
}

function renderizarHoras(dadosClima) {
    const lista = document.getElementById("previsao-horas")
    const { time, temperature_2m: temperaturas, weather_code: codigos } = dadosClima.hourly
    const horaAtual = dadosClima.current.time.slice(0, 13)
    const indiceAtual = Math.max(0, time.findIndex((hora) => hora.startsWith(horaAtual)))
    const fragmento = document.createDocumentFragment()

    for (let deslocamento = 0; deslocamento < 5; deslocamento += 1) {
        const indice = indiceAtual + deslocamento
        if (indice >= time.length) break

        const item = document.createElement("div")
        item.className = "hour-item"
        const hora = document.createElement("span")
        const icone = document.createElement("span")
        icone.className = "weather-mark"
        const temperatura = document.createElement("strong")
        hora.textContent = deslocamento === 0 ? "Agora" : `${time[indice].slice(11, 13)}h`
        renderizarIconeClima(icone, codigos[indice])
        icone.setAttribute("aria-hidden", "true")
        temperatura.textContent = formatarTemperatura(temperaturas[indice])
        item.append(hora, icone, temperatura)
        fragmento.appendChild(item)
    }

    lista.replaceChildren(fragmento)
}

function renderizarSemana(dadosClima) {
    const lista = document.getElementById("previsao-semana")
    const { time, temperature_2m_max: maximas, temperature_2m_min: minimas, weather_code: codigos } = dadosClima.daily
    const fragmento = document.createDocumentFragment()
    const diasSemana = new Intl.DateTimeFormat("pt-BR", { weekday: "short" })

    for (let indice = 0; indice < time.length; indice += 1) {
        const item = document.createElement("div")
        item.className = "day-item"
        const dia = document.createElement("span")
        const icone = document.createElement("span")
        const maximaDia = document.createElement("strong")
        const minimaDia = document.createElement("small")
        dia.textContent = indice === 0 ? "Hoje" : diasSemana.format(new Date(`${time[indice]}T12:00:00`)).replace(".", "")
        icone.className = "weather-mark"
        renderizarIconeClima(icone, codigos[indice])
        icone.setAttribute("aria-hidden", "true")
        maximaDia.textContent = formatarTemperatura(maximas[indice])
        minimaDia.textContent = formatarTemperatura(minimas[indice])
        item.append(dia, icone, maximaDia, minimaDia)
        fragmento.appendChild(item)
    }

    lista.replaceChildren(fragmento)
}

function mostrarClima(dadosClima, cidade) {
    const atual = dadosClima.current
    const clima = traduzirClima(atual.weather_code)
    const regiao = [cidade.admin1, cidade.country].filter(Boolean).join(" · ")

    document.getElementById("cidade").textContent = cidade.name
    document.getElementById("localizacao").textContent = regiao
    document.querySelector(".weather-summary").textContent = clima.texto
    renderizarIconeClima(document.querySelector(".weather-icon"), atual.weather_code)
    document.querySelector(".temperature").textContent = formatarTemperatura(atual.temperature_2m)
    document.getElementById("umidade").textContent = `${Math.round(atual.relative_humidity_2m)}%`
    document.getElementById("sensacao").textContent = formatarTemperatura(atual.apparent_temperature)
    document.getElementById("vento").innerHTML = `${Math.round(atual.wind_speed_10m)} <small>km/h</small>`
    document.querySelector(".high-low").innerHTML = `Máx. ${formatarTemperatura(dadosClima.daily.temperature_2m_max[0])} <span>/</span> Mín. ${formatarTemperatura(dadosClima.daily.temperature_2m_min[0])}`
    renderizarHoras(dadosClima)
    renderizarSemana(dadosClima)
}

async function buscarClima(nomeCidade) {
    const nomePesquisado = nomeCidade.trim()
    if (!nomePesquisado) {
        mensagem.textContent = "Digite o nome de uma cidade."
        input.focus()
        return
    }

    mensagem.textContent = "Atualizando previsão..."

    try {
        const parametrosBusca = new URLSearchParams({ name: nomePesquisado, count: "1", language: "pt", format: "json" })
        const geolocalizacao = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${parametrosBusca}`)
        if (!geolocalizacao.ok) throw new Error("Falha ao buscar a cidade")

        const dados = await geolocalizacao.json()
        if (!dados.results || dados.results.length === 0) {
            mensagem.textContent = "Cidade não encontrada. Tente outra busca."
            return
        }

        const cidade = dados.results[0]
        const parametrosClima = new URLSearchParams({
            latitude: cidade.latitude,
            longitude: cidade.longitude,
            current: "temperature_2m,relative_humidity_2m,weather_code,apparent_temperature,wind_speed_10m",
            hourly: "temperature_2m,weather_code",
            daily: "weather_code,temperature_2m_max,temperature_2m_min",
            timezone: "auto",
            forecast_days: "7"
        })
        const resposta = await fetch(`https://api.open-meteo.com/v1/forecast?${parametrosClima}`)
        if (!resposta.ok) throw new Error("Falha ao buscar a previsão")

        mostrarClima(await resposta.json(), cidade)
        mensagem.textContent = ""
    } catch (erro) {
        mensagem.textContent = "Não foi possível atualizar. Confira a conexão e tente novamente."
        console.error(erro)
    }
}

formulario.addEventListener("submit", (evento) => {
    evento.preventDefault()
    buscarClima(input.value)
})

document.querySelectorAll("[data-weather-code]").forEach((icone) => {
    renderizarIconeClima(icone, Number(icone.dataset.weatherCode))
})

buscarClima("São Paulo")