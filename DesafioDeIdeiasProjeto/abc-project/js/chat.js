// BIA - Chat de IA para orientação profissional no ABC Paulista
class BIAChatApp {
    constructor() {
        this.isOpen = false;
        this.conversationHistory = [];
        this.userProfile = null;
        this.isTyping = false;
        this.knowledgeBase = this.initializeKnowledgeBase();
        this.init();
    }

    initializeKnowledgeBase() {
        return {
            empresasABC: [
                'Braskem', 'Mercedes-Benz', 'Scania', 'Volkswagen', 'Ford', 
                'General Motors', 'Pirelli', 'Rhodia', 'Petrobras', 'Oxiteno',
                'Mahle', 'Continental', 'Bosch', 'ZF', 'Thyssenkrupp'
            ],
            cursosRecomendados: {
                'operador-producao': [
                    {
                        nome: 'Operação de Processos Petroquímicos',
                        instituicao: 'SENAI Santo André',
                        duracao: '160 horas',
                        preco: 'Gratuito',
                        descricao: 'Curso específico para operação em plantas petroquímicas'
                    },
                    {
                        nome: 'Segurança em Processos Industriais',
                        instituicao: 'SENAI São Bernardo',
                        duracao: '80 horas',
                        preco: 'R$ 320,00',
                        descricao: 'Normas de segurança para ambiente industrial'
                    }
                ],
                'manutencao-industrial': [
                    {
                        nome: 'Manutenção Preditiva e Preventiva',
                        instituicao: 'SENAI Diadema',
                        duracao: '120 horas',
                        preco: 'R$ 450,00',
                        descricao: 'Técnicas modernas de manutenção industrial'
                    },
                    {
                        nome: 'Soldagem MIG/MAG',
                        instituicao: 'SENAI São Caetano',
                        duracao: '200 horas',
                        preco: 'R$ 680,00',
                        descricao: 'Soldagem para manutenção industrial'
                    }
                ],
                'logistica': [
                    {
                        nome: 'Gestão de Estoque e Armazenagem',
                        instituicao: 'SENAI Mauá',
                        duracao: '60 horas',
                        preco: 'R$ 280,00',
                        descricao: 'Controle de estoque e organização de almoxarifado'
                    },
                    {
                        nome: 'Operação de Empilhadeira',
                        instituicao: 'SENAI Santo André',
                        duracao: '40 horas',
                        preco: 'R$ 350,00',
                        descricao: 'Habilitação para operar empilhadeiras'
                    }
                ]
            },
            dicasEntrevista: [
                'Chegue 15 minutos antes do horário marcado',
                'Vista roupas adequadas para o ambiente industrial',
                'Leve currículo atualizado e documentos organizados',
                'Pesquise sobre a empresa antes da entrevista',
                'Demonstre interesse genuíno pela vaga',
                'Seja honesto sobre suas experiências',
                'Faça perguntas sobre a função e a empresa',
                'Mantenha postura profissional e educada'
            ],
            salariosMediosABC: {
                'operador-producao': 'R$ 2.800 - R$ 3.500',
                'tecnico-manutencao': 'R$ 3.200 - R$ 4.800',
                'auxiliar-logistica': 'R$ 2.200 - R$ 2.800',
                'assistente-administrativo': 'R$ 2.000 - R$ 2.600',
                'tecnico-qualidade': 'R$ 2.900 - R$ 3.800'
            }
        };
    }

    init() {
        this.setupEventListeners();
        this.loadConversationHistory();
        this.initializeGreeting();
    }

    setupEventListeners() {
        const chatToggle = document.getElementById('chat-toggle');
        const chatClose = document.getElementById('chat-close');
        const chatSend = document.getElementById('chat-send');
        const chatInput = document.getElementById('chat-input');

        if (chatToggle) {
            chatToggle.addEventListener('click', () => this.toggleChat());
        }

        if (chatClose) {
            chatClose.addEventListener('click', () => this.closeChat());
        }

        if (chatSend) {
            chatSend.addEventListener('click', () => this.sendUserMessage());
        }

        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendUserMessage();
                }
            });
        }

        // Quick buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-btn')) {
                const message = e.target.textContent.trim();
                this.sendMessage(message, true);
            }
        });
    }

    toggleChat() {
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }

    openChat() {
        const chatWindow = document.getElementById('chat-window');
        if (chatWindow) {
            chatWindow.classList.add('active');
            this.isOpen = true;
            this.loadUserProfile();
            this.updateQuickQuestions();
            
            // Focus no input
            setTimeout(() => {
                const chatInput = document.getElementById('chat-input');
                if (chatInput) chatInput.focus();
            }, 300);
        }
    }

    closeChat() {
        const chatWindow = document.getElementById('chat-window');
        if (chatWindow) {
            chatWindow.classList.remove('active');
            this.isOpen = false;
        }
    }

    sendUserMessage() {
        const chatInput = document.getElementById('chat-input');
        if (chatInput && chatInput.value.trim()) {
            this.sendMessage(chatInput.value.trim(), true);
            chatInput.value = '';
        }
    }

    async sendMessage(message, isUser = false) {
        this.addMessageToChat(message, isUser);
        
        if (isUser) {
            this.conversationHistory.push({ role: 'user', content: message });
            this.showTypingIndicator();
            
            try {
                // Tentar usar Gemini primeiro
                const geminiResponse = await this.getGeminiResponse(message);
                this.hideTypingIndicator();
                this.addMessageToChat(geminiResponse, false);
                this.conversationHistory.push({ role: 'assistant', content: geminiResponse });
                
                // Adicionar quick questions após resposta
                setTimeout(() => {
                    this.addQuickQuestions();
                }, 1000);
                
            } catch (error) {
                console.error('Erro ao usar Gemini, usando resposta local:', error);
                this.hideTypingIndicator();
                
                // Fallback para resposta local
                setTimeout(() => {
                    this.generateResponse(message);
                }, 500);
            }
        } else {
            this.conversationHistory.push({ role: 'assistant', content: message });
        }
        
        this.saveConversationHistory();
    }

    // Função para chamar o Gemini
    async getGeminiResponse(userMessage) {
        const apiKey = 'AIzaSyBH7Wi_kvEOFQMQYleeDpGBSUzXgHJQE98'; // Chave de exemplo
        
        const prompt = `Você é a BIA, uma assistente de IA especializada em carreiras e emprego do ABC Paulista (Santo André, São Bernardo do Campo e São Caetano do Sul). 

        Seu papel é ajudar trabalhadores e empresários com:
        - Orientação de carreira e desenvolvimento profissional
        - Explicação de termos técnicos do mercado de trabalho
        - Recomendações de cursos e qualificação profissional
        - Dicas para entrevistas, currículos e processos seletivos
        - Informações sobre o mercado de trabalho da região do ABC
        - Como usar a plataforma SKYNET
        - Apoio emocional para candidatos nervosos ou inseguros
        - Informações sobre direitos trabalhistas
        - Orientações para pessoas com deficiência (PCD)
        
        Contexto da região:
        - ABC Paulista é um polo industrial importante
        - Principais empresas: Braskem, Mercedes-Benz, Scania, Volkswagen, Ford, GM, Pirelli
        - Setores principais: petroquímico, automotivo, metalúrgico
        - SENAI é uma instituição importante para cursos técnicos
        
        Responda de forma:
        - Amigável e acolhedora
        - Profissional e útil
        - Concisa mas informativa (máximo 300 palavras)
        - Com informações práticas e acionáveis
        - Use formatação com **negrito** para destacar pontos importantes
        - Use listas com • quando apropriado
        
        Pergunta do usuário: ${userMessage}`;

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY || apiKey}`
                },
                body: JSON.stringify({
                    model: 'gemini-2.5-flash',
                    messages: [
                        {
                            role: 'system',
                            content: prompt
                        },
                        {
                            role: 'user',
                            content: userMessage
                        }
                    ],
                    max_tokens: 400,
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.choices && data.choices[0] && data.choices[0].message) {
                return data.choices[0].message.content;
            } else {
                throw new Error('Resposta inválida da API');
            }
        } catch (error) {
            console.error('Erro na chamada do Gemini:', error);
            throw error;
        }
    }

    addMessageToChat(message, isUser = false) {
        const chatBody = document.getElementById('chat-body');
        if (!chatBody) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${isUser ? 'user-message' : 'bot-message'}`;
        
        messageDiv.innerHTML = `
            <div class="message-content">
                ${this.formatMessage(message)}
            </div>
        `;

        // Remover quick questions se existirem
        const quickQuestions = chatBody.querySelector('.quick-questions');
        if (quickQuestions && isUser) {
            quickQuestions.remove();
        }

        chatBody.appendChild(messageDiv);
        this.scrollToBottom();
    }

    formatMessage(message) {
        // Substituir **texto** por <strong>texto</strong>
        let html = message.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        // Substituir *texto* por <em>texto</em>
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

        // Tratar listas
        const blocks = html.split('\n\n').filter(p => p.trim());
        
        let finalHtml = blocks.map(block => {
            if (block.trim().startsWith('•') || block.trim().startsWith('-')) {
                const listItems = block.split('\n').filter(line => line.trim().startsWith('•') || line.trim().startsWith('-'));
                
                if (listItems.length > 0) {
                    const ulContent = listItems.map(item => {
                        const content = item.trim().substring(1).trim();
                        return `<li>${content}</li>`;
                    }).join('');
                    
                    const preListText = block.split('\n').filter(line => !line.trim().startsWith('•') && !line.trim().startsWith('-')).join('\n').trim();
                    
                    let listBlock = '';
                    if (preListText) {
                        listBlock += `<p><strong>${preListText}</strong></p>`;
                    }
                    listBlock += `<ul>${ulContent}</ul>`;
                    
                    return listBlock;
                }
            }
            
            if (block.includes('<strong>') && block.length < 100) {
                return `<p class="section-title">${block}</p>`;
            }

            return `<p>${block}</p>`;
        }).join('');

        finalHtml = finalHtml.replace(/\n/g, '<br>');

        return finalHtml;
    }

    showTypingIndicator() {
        const chatBody = document.getElementById('chat-body');
        if (!chatBody) return;

        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat-message bot-message typing-indicator';
        typingDiv.innerHTML = `
            <div class="message-content">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <span class="typing-text">BIA está analisando...</span>
            </div>
        `;

        chatBody.appendChild(typingDiv);
        this.scrollToBottom();
        this.isTyping = true;
    }

    hideTypingIndicator() {
        const typingIndicator = document.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
        this.isTyping = false;
    }

    generateResponse(userMessage) {
        const message = userMessage.toLowerCase();
        let response = '';

        // Análise de intenção baseada em palavras-chave expandida
        if (this.containsKeywords(message, ['curso', 'cursos', 'aprimorar', 'estudar', 'capacitação', 'qualificação'])) {
            response = this.generateCourseRecommendation();
        } else if (this.containsKeywords(message, ['vaga', 'vagas', 'emprego', 'trabalho', 'oportunidade'])) {
            response = this.generateJobRecommendation();
        } else if (this.containsKeywords(message, ['entrevista', 'dicas', 'preparar', 'processo seletivo'])) {
            response = this.generateInterviewTips();
        } else if (this.containsKeywords(message, ['salário', 'salario', 'quanto ganha', 'remuneração'])) {
            response = this.generateSalaryInfo();
        } else if (this.containsKeywords(message, ['currículo', 'curriculo', 'cv', 'melhorar perfil'])) {
            response = this.generateCurriculumTips();
        } else if (this.containsKeywords(message, ['empresa', 'empresas', 'abc', 'região'])) {
            response = this.generateCompanyInfo();
        } else if (this.containsKeywords(message, ['dúvida', 'duvida', 'não entendi', 'explique', 'o que é', 'o que significa'])) {
            response = this.generateTermExplanation(message);
        } else if (this.containsKeywords(message, ['ansiedade', 'nervoso', 'medo', 'inseguro', 'confiança'])) {
            response = this.generateEmotionalSupport();
        } else if (this.containsKeywords(message, ['deficiência', 'acessibilidade', 'inclusão', 'pcd', 'pessoa com deficiência'])) {
            response = this.generateInclusionSupport();
        } else if (this.containsKeywords(message, ['direitos', 'trabalhista', 'clt', 'férias', 'rescisão'])) {
            response = this.generateLaborRights();
        } else if (this.containsKeywords(message, ['transporte', 'como chegar', 'ônibus', 'trem', 'metrô'])) {
            response = this.generateTransportInfo();
        } else if (this.containsKeywords(message, ['idade', 'jovem', 'primeiro emprego', 'experiência'])) {
            response = this.generateFirstJobSupport();
        } else {
            response = this.generateGeneralResponse();
        }

        this.sendMessage(response, false);
        this.updateQuickQuestions();
    }

    containsKeywords(text, keywords) {
        return keywords.some(keyword => text.includes(keyword));
    }

    generateCourseRecommendation() {
        this.loadUserProfile();
        
        let response = `**Recomendações de Cursos Personalizadas**\n\n`;
        
        if (this.userProfile && this.userProfile.programa) {
            const cursos = this.knowledgeBase.cursosRecomendados[this.userProfile.programa] || [];
            
            if (cursos.length > 0) {
                response += `**Para sua área (${this.userProfile.programa}):**\n\n`;
                cursos.forEach(curso => {
                    response += `**${curso.nome}**\n`;
                    response += `• Instituição: ${curso.instituicao}\n`;
                    response += `• Duração: ${curso.duracao}\n`;
                    response += `• Investimento: ${curso.preco}\n`;
                    response += `• Descrição: ${curso.descricao}\n\n`;
                });
            }
        } else {
            response += `**Cursos Gerais Recomendados:**\n\n`;
            response += `• **NR10** - Segurança em Instalações Elétricas\n`;
            response += `• **NR35** - Trabalho em Altura\n`;
            response += `• **Primeiros Socorros** - Essencial para qualquer área\n`;
            response += `• **Excel Avançado** - Ferramenta fundamental\n\n`;
        }
        
        response += `**Dica:** Complete seu perfil para recomendações mais específicas!`;
        
        return response;
    }

    generateJobRecommendation() {
        let response = `**Vagas em Destaque no ABC Paulista**\n\n`;
        
        response += `**Operador de Produção - Braskem**\n`;
        response += `• Salário: R$ 3.200 + benefícios\n`;
        response += `• Local: Santo André\n`;
        response += `• Requisito: Ensino médio completo\n\n`;
        
        response += `**Técnico de Manutenção - Mercedes-Benz**\n`;
        response += `• Salário: R$ 4.500 + benefícios\n`;
        response += `• Local: São Bernardo do Campo\n`;
        response += `• Requisito: Curso técnico\n\n`;
        
        response += `**Auxiliar de Logística - Continental**\n`;
        response += `• Salário: R$ 2.600 + benefícios\n`;
        response += `• Local: Diadema\n`;
        response += `• Requisito: Curso de Metrologia\n\n`;
        
        response += `**Dica:** Clique em "VAGAS" no menu superior para ver todas as oportunidades.`;
        
        return response;
    }

    generateInterviewTips() {
        let response = `**Dicas Essenciais para Entrevistas**\n\n`;
        
        response += `**Antes da Entrevista**\n`;
        this.knowledgeBase.dicasEntrevista.slice(0, 4).forEach(dica => {
            response += `• ${dica}\n`;
        });
        response += `\n`;
        
        response += `**Durante a Entrevista**\n`;
        this.knowledgeBase.dicasEntrevista.slice(4, 8).forEach(dica => {
            response += `• ${dica}\n`;
        });
        
        return response;
    }

    generateSalaryInfo() {
        let response = `**Salários Médios no ABC Paulista**\n\n`;
        
        response += `• Operador de Produção: ${this.knowledgeBase.salariosMediosABC['operador-producao']}\n`;
        response += `• Técnico de Manutenção: ${this.knowledgeBase.salariosMediosABC['tecnico-manutencao']}\n`;
        response += `• Auxiliar de Logística: ${this.knowledgeBase.salariosMediosABC['auxiliar-logistica']}\n`;
        response += `• Assistente Administrativo: ${this.knowledgeBase.salariosMediosABC['assistente-administrativo']}\n`;
        response += `• Técnico de Qualidade: ${this.knowledgeBase.salariosMediosABC['tecnico-qualidade']}\n\n`;
        
        response += `**Dica:** Nunca revele sua pretensão salarial antes de saber a faixa da empresa.`;
        
        return response;
    }

    generateCurriculumTips() {
        let response = `**Dicas para um Currículo Vencedor**\n\n`;
        
        response += `**Estrutura básica**\n`;
        response += `• Dados pessoais (nome, contato, cidade)\n`;
        response += `• Objetivo profissional claro\n`;
        response += `• Experiência profissional\n`;
        response += `• Formação acadêmica e cursos\n`;
        response += `• Competências e idiomas\n\n`;
        
        response += `**Diferenciais para o ABC**\n`;
        response += `• Certificações de segurança (NR10, NR35)\n`;
        response += `• Experiência com trabalho em turnos\n`;
        response += `• Conhecimento em processos industriais\n`;
        
        return response;
    }

    generateCompanyInfo() {
        let response = `**Principais Empresas do ABC Paulista**\n\n`;
        
        response += `**Setor Petroquímico**\n`;
        response += `• **Braskem** - Líder em petroquímicos\n`;
        response += `• **Oxiteno** - Especialidades químicas\n`;
        response += `• **Rhodia** - Química avançada\n\n`;
        
        response += `**Setor Automotivo**\n`;
        response += `• **Mercedes-Benz** - Veículos comerciais\n`;
        response += `• **Scania** - Caminhões e ônibus\n`;
        response += `• **Volkswagen** - Automóveis\n\n`;
        
        response += `**Dica:** Pesquise sobre a cultura da empresa antes de se candidatar.`;
        
        return response;
    }

    generateTermExplanation(message) {
        let response = `**Explicação de Termos Técnicos**\n\n`;
        
        // Detectar termos específicos na mensagem
        if (message.includes('clt')) {
            response += `**CLT (Consolidação das Leis do Trabalho)**\n`;
            response += `É o conjunto de leis que regula as relações de trabalho no Brasil. Garante direitos como:\n`;
            response += `• Carteira assinada\n• Férias remuneradas\n• 13º salário\n• FGTS\n• Seguro-desemprego\n\n`;
        } else if (message.includes('pcd') || message.includes('pessoa com deficiência')) {
            response += `**PCD (Pessoa com Deficiência)**\n`;
            response += `Termo usado para pessoas que têm limitações físicas, mentais, intelectuais ou sensoriais. No mercado de trabalho, empresas com mais de 100 funcionários devem reservar de 2% a 5% das vagas para PCDs.\n\n`;
        } else if (message.includes('competência')) {
            response += `**Competências Profissionais**\n`;
            response += `São conhecimentos, habilidades e atitudes necessárias para exercer uma função. Dividem-se em:\n`;
            response += `• **Técnicas**: conhecimentos específicos da área\n• **Comportamentais**: habilidades pessoais (comunicação, liderança)\n\n`;
        } else {
            response += `Não identifiquei um termo específico na sua pergunta. Posso explicar sobre:\n\n`;
            response += `• **CLT** - Leis trabalhistas\n• **PCD** - Pessoa com Deficiência\n• **Competências** - Habilidades profissionais\n• **Processo seletivo** - Etapas de contratação\n\n`;
            response += `Digite o termo que gostaria de entender melhor!`;
        }
        
        return response;
    }

    generateEmotionalSupport() {
        let response = `**Apoio Emocional para sua Carreira**\n\n`;
        
        response += `É normal sentir ansiedade na busca por emprego. Aqui estão algumas dicas:\n\n`;
        response += `**Para reduzir a ansiedade:**\n`;
        response += `• Prepare-se bem para entrevistas\n`;
        response += `• Pratique suas respostas em voz alta\n`;
        response += `• Respire fundo antes de falar\n`;
        response += `• Lembre-se: você tem valor!\n\n`;
        response += `**Construindo confiança:**\n`;
        response += `• Liste suas conquistas e qualidades\n`;
        response += `• Busque feedback de pessoas próximas\n`;
        response += `• Invista em cursos para se sentir mais preparado\n\n`;
        response += `**Lembre-se:** Cada "não" te aproxima do "sim" certo!`;
        
        return response;
    }

    generateInclusionSupport() {
        let response = `**Apoio à Inclusão no Mercado de Trabalho**\n\n`;
        
        response += `**Direitos das Pessoas com Deficiência:**\n`;
        response += `• Lei de Cotas (8.213/91): empresas com 100+ funcionários devem contratar PCDs\n`;
        response += `• Adaptações no ambiente de trabalho\n`;
        response += `• Jornada flexível quando necessário\n`;
        response += `• Não discriminação no processo seletivo\n\n`;
        
        response += `**Empresas inclusivas no ABC:**\n`;
        response += `• **Braskem** - Programa de Diversidade\n`;
        response += `• **Mercedes-Benz** - Vagas adaptadas\n`;
        response += `• **Scania** - Ambiente inclusivo\n\n`;
        
        response += `**Dica:** Destaque suas competências e não se limite pela deficiência. Você tem muito a contribuir!`;
        
        return response;
    }

    generateLaborRights() {
        let response = `**Seus Direitos Trabalhistas**\n\n`;
        
        response += `**Direitos básicos CLT:**\n`;
        response += `• Salário mínimo ou piso da categoria\n`;
        response += `• Jornada máxima de 8h/dia e 44h/semana\n`;
        response += `• Intervalo de 1h para almoço\n`;
        response += `• Descanso semanal remunerado\n`;
        response += `• Férias de 30 dias + 1/3 do salário\n`;
        response += `• 13º salário\n`;
        response += `• FGTS (8% do salário)\n`;
        response += `• Vale-transporte\n\n`;
        
        response += `**Em caso de demissão:**\n`;
        response += `• Aviso prévio (30 dias)\n`;
        response += `• Saldo de salário\n`;
        response += `• Férias proporcionais\n`;
        response += `• 13º proporcional\n`;
        response += `• Multa de 40% do FGTS (demissão sem justa causa)\n\n`;
        
        response += `**Dúvidas?** Procure o sindicato da sua categoria ou a Superintendência Regional do Trabalho.`;
        
        return response;
    }

    generateTransportInfo() {
        let response = `**Transporte no ABC Paulista**\n\n`;
        
        response += `**Principais linhas de trem:**\n`;
        response += `• **Linha 10-Turquesa** (CPTM): São Paulo ↔ Rio Grande da Serra\n`;
        response += `• **Linha 7-Rubi** (CPTM): Luz ↔ Jundiaí\n\n`;
        
        response += `**Estações importantes:**\n`;
        response += `• **Santo André** - Centro da cidade\n`;
        response += `• **São Bernardo** - Próximo às montadoras\n`;
        response += `• **Diadema** - Acesso a empresas químicas\n`;
        response += `• **Mauá** - Zona industrial\n\n`;
        
        response += `**Dicas de transporte:**\n`;
        response += `• Use o app Citymapper para rotas\n`;
        response += `• Bilhete Único vale para trem, metrô e ônibus\n`;
        response += `• Empresas costumam oferecer vale-transporte\n`;
        response += `• Considere morar próximo ao trabalho para economizar tempo\n\n`;
        
        response += `**Importante:** Sempre chegue 15 minutos antes do horário!`;
        
        return response;
    }

    generateFirstJobSupport() {
        let response = `**Apoio para Primeiro Emprego**\n\n`;
        
        response += `**Não se preocupe com a falta de experiência!**\n`;
        response += `Muitas empresas valorizam:\n`;
        response += `• Vontade de aprender\n`;
        response += `• Pontualidade e responsabilidade\n`;
        response += `• Boa comunicação\n`;
        response += `• Cursos e certificações\n\n`;
        
        response += `**Programas para jovens no ABC:**\n`;
        response += `• **Jovem Aprendiz** - Braskem, Mercedes, Scania\n`;
        response += `• **Estágio** - Diversas empresas\n`;
        response += `• **Trainee** - Para recém-formados\n\n`;
        
        response += `**Como se destacar:**\n`;
        response += `• Faça cursos gratuitos do SENAI\n`;
        response += `• Participe de trabalhos voluntários\n`;
        response += `• Desenvolva projetos pessoais\n`;
        response += `• Mostre suas soft skills\n\n`;
        
        response += `**Lembre-se:** Todo profissional experiente já foi iniciante um dia!`;
        
        return response;
    }

    generateGeneralResponse() {
        this.loadUserProfile();
        
        if (!this.userProfile || !this.userProfile.nome) {
            return `Olá! Sou a BIA, sua mentora de carreira do ABC Paulista.\n\n**Complete seu perfil** na seção "MEU PERFIL" para que eu possa te dar as melhores recomendações!\n\nComo posso te ajudar hoje?`;
        } else {
            return `Olá ${this.userProfile.nome}! Estou aqui para te ajudar com:\n\n• **Busca de vagas** na região\n• **Recomendações de cursos**\n• **Dicas de entrevista**\n• **Orientações de carreira**\n• **Explicação de termos técnicos**\n• **Apoio emocional**\n• **Direitos trabalhistas**\n• **Inclusão e acessibilidade**\n\nComo posso te ajudar hoje?`;
        }
    }

    updateQuickQuestions() {
        const chatBody = document.getElementById('chat-body');
        if (!chatBody) return;

        // Remover quick questions existentes
        const existingQuestions = chatBody.querySelector('.quick-questions');
        if (existingQuestions) {
            existingQuestions.remove();
        }

        // Adicionar novas quick questions
        const quickQuestions = document.createElement('div');
        quickQuestions.className = 'quick-questions';
        
        const questions = this.getContextualQuestions();
        
        quickQuestions.innerHTML = questions.map(q => 
            `<button class="quick-btn">${q}</button>`
        ).join('');

        chatBody.appendChild(quickQuestions);
        this.scrollToBottom();
    }

    getContextualQuestions() {
        this.loadUserProfile();
        
        if (!this.userProfile || !this.userProfile.nome) {
            return [
                'Como criar meu perfil?',
                'Empresas do ABC Paulista',
                'Salários na região',
                'Tenho dúvidas sobre termos técnicos'
            ];
        }

        const questions = [
            'Vagas disponíveis no ABC',
            'Cursos recomendados',
            'Dicas de entrevista',
            'Como melhorar meu currículo',
            'Estou nervoso para entrevista',
            'Quais são meus direitos trabalhistas?',
            'Como funciona o transporte no ABC?',
            'Sou PCD, como me candidatar?'
        ];

        // Retornar 4 perguntas aleatórias
        const shuffled = questions.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 4);
    }

    initializeGreeting() {
        // Adicionar mensagem de boas-vindas apenas se não houver histórico
        if (this.conversationHistory.length === 0) {
            const greeting = `Olá! Sou a BIA, sua mentora de carreira do ABC Paulista.\n\nEstou aqui para te ajudar a encontrar emprego na região.\n\nComo posso te ajudar hoje?`;
            
            setTimeout(() => {
                this.sendMessage(greeting, false);
            }, 1000);
        }
    }

    loadUserProfile() {
        const saved = localStorage.getItem('skynet-user-profile');
        this.userProfile = saved ? JSON.parse(saved) : null;
    }

    loadConversationHistory() {
        const saved = localStorage.getItem('skynet-chat-history');
        this.conversationHistory = saved ? JSON.parse(saved) : [];
        
        // Recriar mensagens no chat
        this.conversationHistory.forEach(msg => {
            this.addMessageToChat(msg.content, msg.role === 'user');
        });
    }

    saveConversationHistory() {
        localStorage.setItem('skynet-chat-history', JSON.stringify(this.conversationHistory));
    }

    scrollToBottom() {
        const chatBody = document.getElementById('chat-body');
        if (chatBody) {
            setTimeout(() => {
                chatBody.scrollTop = chatBody.scrollHeight;
            }, 100);
        }
    }
}

// Função global para abrir chat com recomendação de cursos
window.sendQuickMessage = (message) => {
    if (window.chatApp) {
        window.chatApp.sendMessage(message, true);
    }
};

// Inicializar chat
document.addEventListener('DOMContentLoaded', () => {
    window.chatApp = new BIAChatApp();
});

// Estilos específicos do chat
const chatStyles = `
<style>
.typing-dots {
    display: inline-flex;
    gap: 4px;
    align-items: center;
}

.typing-dots span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--primary-blue);
    animation: typing 1.4s infinite ease-in-out;
}

.typing-dots span:nth-child(1) { animation-delay: -0.32s; }
.typing-dots span:nth-child(2) { animation-delay: -0.16s; }

@keyframes typing {
    0%, 80%, 100% { transform: scale(0); }
    40% { transform: scale(1); }
}

.typing-text {
    margin-left: 10px;
    font-style: italic;
    color: var(--gray);
}

.message-content ul {
    margin: 1rem 0;
    padding-left: 1.5rem;
}

.message-content li {
    margin: 0.6rem 0;
    line-height: 1.6;
}

.message-content strong {
    color: var(--primary-blue);
    font-weight: 600;
}

.section-title {
    color: var(--primary-blue) !important;
    font-weight: 600 !important;
    font-size: 1.1rem !important;
    margin: 1.5rem 0 0.8rem 0;
}
</style>
`;

// Inserir estilos no DOM
document.addEventListener('DOMContentLoaded', () => {
    const styleElement = document.createElement('style');
    styleElement.textContent = chatStyles;
    document.head.appendChild(styleElement);
});
