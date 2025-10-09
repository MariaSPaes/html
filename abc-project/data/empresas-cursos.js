// Dados atualizados para substituir Braskem e incluir cursos online gratuitos

// Empresas do ABC Paulista que contratam (substituindo Braskem)
const empresasABC = [
    {
        nome: "Volkswagen",
        area: "Automotiva",
        cidade: "São Bernardo do Campo",
        vagas: [
            {
                cargo: "Operador de Produção",
                salario: "R$ 2.800 - R$ 3.500",
                tipo: "Tempo integral",
                candidatos: 15,
                compatibilidade: 92,
                requisitos: ["Experiência em Produção", "Ensino Médio Completo", "Disponibilidade para turnos"],
                cursos_recomendados: ["NR-12 - Segurança no Trabalho em Máquinas", "Lean Manufacturing", "Qualidade Total"]
            },
            {
                cargo: "Técnico de Manutenção",
                salario: "R$ 3.200 - R$ 4.000",
                tipo: "Tempo integral",
                candidatos: 8,
                compatibilidade: 88,
                requisitos: ["Curso Técnico em Mecânica", "Experiência com manutenção preventiva", "Conhecimento em hidráulica"],
                cursos_recomendados: ["Manutenção Industrial", "Hidráulica e Pneumática", "Soldagem MIG/MAG"]
            }
        ]
    },
    {
        nome: "Mercedes-Benz",
        area: "Automotiva",
        cidade: "São Bernardo do Campo",
        vagas: [
            {
                cargo: "Auxiliar de Logística",
                salario: "R$ 2.200 - R$ 2.800",
                tipo: "Tempo integral",
                candidatos: 12,
                compatibilidade: 85,
                requisitos: ["Ensino Médio Completo", "Conhecimento em Excel", "Experiência em estoque"],
                cursos_recomendados: ["Logística e Supply Chain", "Excel Avançado", "Gestão de Estoque"]
            }
        ]
    },
    {
        nome: "Scania",
        area: "Automotiva",
        cidade: "São Bernardo do Campo",
        vagas: [
            {
                cargo: "Soldador",
                salario: "R$ 3.000 - R$ 3.800",
                tipo: "Tempo integral",
                candidatos: 6,
                compatibilidade: 90,
                requisitos: ["Curso de Soldagem", "Experiência mínima 2 anos", "Conhecimento em soldagem MIG/MAG"],
                cursos_recomendados: ["Soldagem Avançada", "Leitura e Interpretação de Desenho", "Metalurgia Básica"]
            }
        ]
    },
    {
        nome: "Mahle",
        area: "Autopeças",
        cidade: "Santo André",
        vagas: [
            {
                cargo: "Operador de Máquinas CNC",
                salario: "R$ 3.500 - R$ 4.200",
                tipo: "Tempo integral",
                candidatos: 10,
                compatibilidade: 87,
                requisitos: ["Curso Técnico em Mecânica", "Experiência com CNC", "Conhecimento em programação"],
                cursos_recomendados: ["Programação CNC", "Metrologia", "CAD/CAM"]
            }
        ]
    },
    {
        nome: "Tigre",
        area: "Construção Civil",
        cidade: "Santo André",
        vagas: [
            {
                cargo: "Auxiliar de Produção",
                salario: "R$ 2.400 - R$ 2.900",
                tipo: "Tempo integral",
                candidatos: 18,
                compatibilidade: 83,
                requisitos: ["Ensino Médio Completo", "Disponibilidade para turnos", "Experiência em produção"],
                cursos_recomendados: ["Processos de Produção", "Controle de Qualidade", "Segurança do Trabalho"]
            }
        ]
    },
    {
        nome: "Petroquímica União",
        area: "Petroquímica",
        cidade: "Mauá",
        vagas: [
            {
                cargo: "Técnico de Processo",
                salario: "R$ 4.000 - R$ 5.200",
                tipo: "Tempo integral",
                candidatos: 5,
                compatibilidade: 94,
                requisitos: ["Curso Técnico em Química", "NR-10", "Experiência em processos industriais"],
                cursos_recomendados: ["Processos Petroquímicos", "Instrumentação Industrial", "Análises Químicas"]
            }
        ]
    }
];

// Cursos online gratuitos do SENAI (substituindo cursos presenciais)
const cursosOnlineGratuitos = [
    {
        nome: "Segurança do Trabalho",
        categoria: "Segurança",
        modalidade: "EAD",
        carga_horaria: "14 horas",
        custo: "Gratuito",
        instituicao: "SENAI",
        descricao: "Conceitos fundamentais de segurança no trabalho e prevenção de acidentes",
        link: "https://www.sp.senai.br/cursos-gratuitos",
        areas_aplicacao: ["Produção", "Manutenção", "Logística", "Qualidade"]
    },
    {
        nome: "Lean Manufacturing",
        categoria: "Gestão",
        modalidade: "EAD",
        carga_horaria: "20 horas",
        custo: "Gratuito",
        instituicao: "SENAI",
        descricao: "Princípios e ferramentas do sistema de produção enxuta",
        link: "https://www.sp.senai.br/cursos-gratuitos",
        areas_aplicacao: ["Produção", "Qualidade", "Gestão"]
    },
    {
        nome: "Metrologia",
        categoria: "Qualidade",
        modalidade: "EAD",
        carga_horaria: "30 horas",
        custo: "Gratuito",
        instituicao: "SENAI",
        descricao: "Fundamentos de medição e controle dimensional",
        link: "https://www.sp.senai.br/cursos-gratuitos",
        areas_aplicacao: ["Qualidade", "Produção", "Manutenção"]
    },
    {
        nome: "Logística",
        categoria: "Logística",
        modalidade: "EAD",
        carga_horaria: "40 horas",
        custo: "Gratuito",
        instituicao: "SENAI",
        descricao: "Conceitos básicos de logística e supply chain",
        link: "https://www.sp.senai.br/cursos-gratuitos",
        areas_aplicacao: ["Logística", "Gestão"]
    },
    {
        nome: "Desenho Técnico Mecânico",
        categoria: "Técnico",
        modalidade: "EAD",
        carga_horaria: "60 horas",
        custo: "Gratuito",
        instituicao: "SENAI",
        descricao: "Leitura e interpretação de desenhos técnicos",
        link: "https://www.sp.senai.br/cursos-gratuitos",
        areas_aplicacao: ["Manutenção", "Produção", "Qualidade"]
    },
    {
        nome: "Tecnologia da Informação",
        categoria: "TI",
        modalidade: "EAD",
        carga_horaria: "25 horas",
        custo: "Gratuito",
        instituicao: "SENAI",
        descricao: "Fundamentos de informática e sistemas",
        link: "https://www.sp.senai.br/cursos-gratuitos",
        areas_aplicacao: ["Administrativa", "Gestão", "Todas"]
    },
    {
        nome: "Empreendedorismo",
        categoria: "Gestão",
        modalidade: "EAD",
        carga_horaria: "30 horas",
        custo: "Gratuito",
        instituicao: "SENAI",
        descricao: "Desenvolvimento de competências empreendedoras",
        link: "https://www.sp.senai.br/cursos-gratuitos",
        areas_aplicacao: ["Gestão", "Todas"]
    },
    {
        nome: "Educação Ambiental",
        categoria: "Meio Ambiente",
        modalidade: "EAD",
        carga_horaria: "20 horas",
        custo: "Gratuito",
        instituicao: "SENAI",
        descricao: "Consciência ambiental e sustentabilidade",
        link: "https://www.sp.senai.br/cursos-gratuitos",
        areas_aplicacao: ["Todas"]
    },
    {
        nome: "Consumo Consciente de Energia",
        categoria: "Sustentabilidade",
        modalidade: "EAD",
        carga_horaria: "14 horas",
        custo: "Gratuito",
        instituicao: "SENAI",
        descricao: "Uso eficiente de energia e sustentabilidade",
        link: "https://www.sp.senai.br/cursos-gratuitos",
        areas_aplicacao: ["Todas"]
    },
    {
        nome: "Propriedade Intelectual",
        categoria: "Gestão",
        modalidade: "EAD",
        carga_horaria: "20 horas",
        custo: "Gratuito",
        instituicao: "SENAI",
        descricao: "Conceitos de propriedade intelectual e inovação",
        link: "https://www.sp.senai.br/cursos-gratuitos",
        areas_aplicacao: ["Gestão", "Administrativa"]
    }
];

// Função para calcular compatibilidade inteligente
function calcularCompatibilidade(perfilUsuario, vaga) {
    let pontuacao = 0;
    let totalCriterios = 0;

    // Verificar área de atuação (peso 30%)
    if (perfilUsuario.area_interesse && vaga.area) {
        totalCriterios += 30;
        if (perfilUsuario.area_interesse.toLowerCase().includes(vaga.area.toLowerCase())) {
            pontuacao += 30;
        }
    }

    // Verificar localização (peso 25%)
    if (perfilUsuario.cidade && vaga.cidade) {
        totalCriterios += 25;
        if (perfilUsuario.cidade === vaga.cidade) {
            pontuacao += 25;
        } else if (perfilUsuario.regiao === "ABC Paulista") {
            pontuacao += 15; // Proximidade na região
        }
    }

    // Verificar experiência (peso 20%)
    if (perfilUsuario.experiencia && vaga.requisitos) {
        totalCriterios += 20;
        const experienciaMatch = vaga.requisitos.some(req => 
            perfilUsuario.experiencia.toLowerCase().includes(req.toLowerCase())
        );
        if (experienciaMatch) {
            pontuacao += 20;
        }
    }

    // Verificar cursos/certificações (peso 15%)
    if (perfilUsuario.cursos && vaga.cursos_recomendados) {
        totalCriterios += 15;
        const cursosMatch = vaga.cursos_recomendados.some(curso => 
            perfilUsuario.cursos.some(userCurso => 
                userCurso.toLowerCase().includes(curso.toLowerCase())
            )
        );
        if (cursosMatch) {
            pontuacao += 15;
        }
    }

    // Verificar escolaridade (peso 10%)
    if (perfilUsuario.escolaridade && vaga.requisitos) {
        totalCriterios += 10;
        const escolaridadeMatch = vaga.requisitos.some(req => 
            req.toLowerCase().includes("ensino") || req.toLowerCase().includes("técnico")
        );
        if (escolaridadeMatch) {
            pontuacao += 10;
        }
    }

    return totalCriterios > 0 ? Math.round((pontuacao / totalCriterios) * 100) : 0;
}

// Função para recomendar cursos baseado no perfil
function recomendarCursos(perfilUsuario) {
    const cursosRecomendados = [];
    
    if (perfilUsuario.area_interesse) {
        const area = perfilUsuario.area_interesse.toLowerCase();
        
        cursosOnlineGratuitos.forEach(curso => {
            if (curso.areas_aplicacao.some(aplicacao => 
                aplicacao.toLowerCase().includes(area) || aplicacao === "Todas"
            )) {
                cursosRecomendados.push(curso);
            }
        });
    }
    
    // Sempre incluir cursos básicos essenciais
    const cursosEssenciais = cursosOnlineGratuitos.filter(curso => 
        ["Segurança do Trabalho", "Tecnologia da Informação", "Empreendedorismo"].includes(curso.nome)
    );
    
    cursosEssenciais.forEach(curso => {
        if (!cursosRecomendados.find(c => c.nome === curso.nome)) {
            cursosRecomendados.push(curso);
        }
    });
    
    return cursosRecomendados.slice(0, 6); // Limitar a 6 cursos
}

// Exportar dados
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        empresasABC,
        cursosOnlineGratuitos,
        calcularCompatibilidade,
        recomendarCursos
    };
}
