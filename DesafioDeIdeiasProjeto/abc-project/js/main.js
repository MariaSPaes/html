// JavaScript principal do SKYNET - ABC Paulista
document.addEventListener('DOMContentLoaded', function() {
    
    // Navegação entre páginas
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');
    
    // Navegação entre páginas com controle de acesso
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetPage = this.getAttribute('data-page');
            
            // Verificar se o usuário tem perfil criado para acessar certas páginas
            const userProfile = JSON.parse(localStorage.getItem('skynet-user-profile') || '{}');
            const restrictedPages = ['vagas'];
            
            if (restrictedPages.includes(targetPage) && (!userProfile.nome || !userProfile.estado)) {
                // Mostrar notificação de que precisa criar perfil
                showProfileRequiredNotification();
                return;
            }
            
            // Remover classe active de todos os links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Adicionar classe active ao link clicado
            this.classList.add('active');
            
            // Esconder todas as páginas
            pages.forEach(page => page.classList.remove('active'));
            
            // Mostrar página alvo
            const targetElement = document.getElementById(targetPage);
            if (targetElement) {
                targetElement.classList.add('active');
            }
        });
    });
    
    // Função para mostrar notificação de perfil obrigatório
    function showProfileRequiredNotification() {
        const notification = document.createElement('div');
        notification.className = 'profile-required-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-exclamation-triangle"></i>
                <h4>Perfil Obrigatório</h4>
                <p>Para acessar as vagas, você precisa criar seu perfil primeiro.</p>
                <button onclick="goToProfile()" class="btn-create-profile">Criar Perfil</button>
                <button onclick="closeNotification(this)" class="btn-close">×</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Remover automaticamente após 5 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
    }
    
    // Função para ir ao perfil
    window.goToProfile = function() {
        navLinks.forEach(l => l.classList.remove('active'));
        pages.forEach(page => page.classList.remove('active'));
        
        const perfilLink = document.querySelector('[data-page="meu-perfil"]');
        const perfilPage = document.getElementById('meu-perfil');
        
        if (perfilLink && perfilPage) {
            perfilLink.classList.add('active');
            perfilPage.classList.add('active');
        }
        
        // Fechar notificação
        const notification = document.querySelector('.profile-required-notification');
        if (notification) {
            notification.parentNode.removeChild(notification);
        }
    };
    
    // Função para fechar notificação
    window.closeNotification = function(button) {
        const notification = button.closest('.profile-required-notification');
        if (notification) {
            notification.parentNode.removeChild(notification);
        }
    };   
    // Menu de acessibilidade
    const accessibilityBtn = document.querySelector('.accessibility-btn');
    const accessibilityMenu = document.getElementById('accessibility-menu');
    
    if (accessibilityBtn && accessibilityMenu) {
        accessibilityBtn.addEventListener('click', function() {
            accessibilityMenu.classList.toggle('active');
        });
        
        // Fechar menu ao clicar fora
        document.addEventListener('click', function(e) {
            if (!accessibilityBtn.contains(e.target) && !accessibilityMenu.contains(e.target)) {
                accessibilityMenu.classList.remove('active');
            }
        });
    }
    
    // CORREÇÃO: Funcionalidades de acessibilidade
    
    // Alto contraste
    const highContrastToggle = document.getElementById('high-contrast-toggle');
    if (highContrastToggle) {
        highContrastToggle.addEventListener('click', function() {
            document.body.classList.toggle('high-contrast');
            localStorage.setItem('high-contrast', document.body.classList.contains('high-contrast'));
        });
        
        // Carregar preferência salva
        if (localStorage.getItem('high-contrast') === 'true') {
            document.body.classList.add('high-contrast');
        }
    }
    
    // Aumentar fonte
    const fontSizeIncrease = document.getElementById('font-size-increase');
    if (fontSizeIncrease) {
        fontSizeIncrease.addEventListener('click', function() {
            let currentSize = parseInt(getComputedStyle(document.documentElement).fontSize);
            if (currentSize < 20) { // Limite máximo
                document.documentElement.style.fontSize = (currentSize + 2) + 'px';
                localStorage.setItem('font-size', (currentSize + 2) + 'px');
            }
        });
    }
    
    // Diminuir fonte
    const fontSizeDecrease = document.getElementById('font-size-decrease');
    if (fontSizeDecrease) {
        fontSizeDecrease.addEventListener('click', function() {
            let currentSize = parseInt(getComputedStyle(document.documentElement).fontSize);
            if (currentSize > 12) { // Limite mínimo
                document.documentElement.style.fontSize = (currentSize - 2) + 'px';
                localStorage.setItem('font-size', (currentSize - 2) + 'px');
            }
        });
    }
    
    // Carregar tamanho de fonte salvo
    const savedFontSizeValue = localStorage.getItem('font-size');
    if (savedFontSizeValue) {
        document.documentElement.style.fontSize = savedFontSizeValue;
    }
    
    // CORREÇÃO: VLibras funcional
    const vlibrasToggle = document.getElementById('vlibras-toggle');
    if (vlibrasToggle) {
        vlibrasToggle.addEventListener('click', function() {
            // Ativar/desativar VLibras
            const vlibrasWidget = document.querySelector('[vw]');
            if (vlibrasWidget) {
                const isActive = vlibrasWidget.style.display !== 'none';
                vlibrasWidget.style.display = isActive ? 'none' : 'block';
                
                // Feedback visual
                this.style.background = isActive ? 'var(--light-gray)' : 'var(--primary-blue)';
                this.style.color = isActive ? 'var(--black)' : 'var(--white)';
            }
        });
    }
    
    // CORREÇÃO: Leitor de tela funcional
    const screenReaderToggle = document.getElementById('screen-reader-toggle');
    let speechSynthesis = window.speechSynthesis;
    let isReaderActive = false;
    
    if (screenReaderToggle) {
        screenReaderToggle.addEventListener('click', function() {
            isReaderActive = !isReaderActive;
            
            if (isReaderActive) {
                this.style.background = 'var(--primary-blue)';
                this.style.color = 'var(--white)';
                
                // Ativar leitor de tela
                document.addEventListener('mouseover', readElementOnHover);
                document.addEventListener('focus', readElementOnFocus, true);
                
                // Anunciar ativação
                speak('Leitor de tela ativado. Passe o mouse sobre os elementos para ouvi-los.');
            } else {
                this.style.background = 'var(--light-gray)';
                this.style.color = 'var(--black)';
                
                // Desativar leitor de tela
                document.removeEventListener('mouseover', readElementOnHover);
                document.removeEventListener('focus', readElementOnFocus, true);
                
                // Parar qualquer leitura em andamento
                speechSynthesis.cancel();
                
                speak('Leitor de tela desativado.');
            }
        });
    }
    
    function readElementOnHover(e) {
        if (!isReaderActive) return;
        
        const element = e.target;
        let textToRead = '';
        
        // Determinar o que ler baseado no tipo de elemento
        if (element.tagName === 'BUTTON') {
            textToRead = element.textContent || element.getAttribute('aria-label') || 'Botão';
        } else if (element.tagName === 'A') {
            textToRead = element.textContent || element.getAttribute('aria-label') || 'Link';
        } else if (element.tagName === 'INPUT') {
            const label = document.querySelector(`label[for="${element.id}"]`);
            textToRead = label ? label.textContent : element.placeholder || 'Campo de entrada';
        } else if (element.tagName === 'H1' || element.tagName === 'H2' || element.tagName === 'H3') {
            textToRead = 'Título: ' + element.textContent;
        } else if (element.classList.contains('nav-link')) {
            textToRead = 'Menu: ' + element.textContent;
        }
        
        if (textToRead.trim()) {
            speak(textToRead);
        }
    }
    
    function readElementOnFocus(e) {
        if (!isReaderActive) return;
        readElementOnHover(e);
    }
    
    function speak(text) {
        speechSynthesis.cancel(); // Parar leitura anterior
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'pt-BR';
        utterance.rate = 0.8;
        utterance.pitch = 1;
        
        speechSynthesis.speak(utterance);
    }
    
    // Carregar preferências de fonte salvas
    const savedFontSize = localStorage.getItem('font-size');
    if (savedFontSize === 'large') {
        document.body.classList.add('font-large');
    } else if (savedFontSize === 'small') {
        document.body.classList.add('font-small');
    }
    
    // Botões de ação
    const candidateBtn = document.querySelector('[data-action="candidate-flow"]');
    const employerBtn = document.querySelector('[data-action="employer-flow"]');
    const showPageBtns = document.querySelectorAll('[data-action="show-page"]');

    // Interação dos tutoriais com o chat
    document.addEventListener('click', function(e) {
        if (e.target.matches('[data-action="show-tutorial"]') || e.target.closest('[data-action="show-tutorial"]')) {
            const tutorialCard = e.target.closest('[data-action="show-tutorial"]');
            const tutorialId = tutorialCard.getAttribute('data-tutorial-id');
            const tutorialTitle = tutorialCard.querySelector('h3').innerText;
            
            // Mapear perguntas específicas para cada tutorial
            const tutorialQuestions = {
                'criar-perfil': 'Como criar meu perfil profissional na plataforma?',
                'encontrar-vagas': 'Como encontrar vagas compatíveis com meu perfil?',
                'mentor-ia': 'Como usar a BIA para me ajudar na minha carreira?',
                'compatibilidade': 'Como funciona o sistema de compatibilidade de vagas?',
                'cadastrar-vagas': 'Como cadastrar vagas na plataforma para empresários?',
                'dicas-carreira': 'Quais são as melhores dicas para crescer na carreira?',
                'vlibras': 'Como usar o VLibras para tradução em Libras?',
                'alto-contraste': 'Como ativar o modo de alto contraste?',
                'leitor-tela': 'Como usar o leitor de tela para navegação?'
            };
            
            const question = tutorialQuestions[tutorialId] || `Me explique sobre: ${tutorialTitle}`;
            
            // Abrir o chat e enviar a pergunta
            if (window.chatApp && window.chatApp.openChat) {
                window.chatApp.openChat();
                setTimeout(() => {
                    window.chatApp.sendMessage(question, true);
                }, 500);
            } else {
                // Fallback: mostrar o chat se não estiver visível
                const chatContainer = document.getElementById('chat-container');
                if (chatContainer) {
                    chatContainer.style.display = 'block';
                    const chatBody = document.getElementById('chat-body');
                    if (chatBody) {
                        const messageDiv = document.createElement('div');
                        messageDiv.className = 'chat-message bot-message';
                        messageDiv.innerHTML = `
                            <div class="message-content">
                                <p>Olá! Você clicou no tutorial "${tutorialTitle}". Como posso te ajudar com isso?</p>
                            </div>
                        `;
                        chatBody.appendChild(messageDiv);
                        chatBody.scrollTop = chatBody.scrollHeight;
                    }
                }
            }
        }
    });
    
    if (candidateBtn) {
        candidateBtn.addEventListener('click', function() {
            // Navegar para seleção de perfil
            navLinks.forEach(l => l.classList.remove('active'));
            pages.forEach(page => page.classList.remove('active'));
            
            const perfilLink = document.querySelector('[data-page="meu-perfil"]');
            const perfilPage = document.getElementById('meu-perfil');
            
            if (perfilLink && perfilPage) {
                perfilLink.classList.add('active');
                perfilPage.classList.add('active');
            }
        });
    }
    
    if (employerBtn) {
        employerBtn.addEventListener('click', function() {
            // Navegar para seleção de perfil
            navLinks.forEach(l => l.classList.remove('active'));
            pages.forEach(page => page.classList.remove('active'));
            
            const perfilLink = document.querySelector('[data-page="meu-perfil"]');
            const perfilPage = document.getElementById('meu-perfil');
            
            if (perfilLink && perfilPage) {
                perfilLink.classList.add('active');
                perfilPage.classList.add('active');
            }
        });
    }
    
    // Seleção de tipo de perfil
    const profileTypeCards = document.querySelectorAll('[data-action="select-profile-type"]');
    profileTypeCards.forEach(card => {
        card.addEventListener('click', function() {
            const profileType = this.getAttribute('data-type');
            
            pages.forEach(page => page.classList.remove('active'));
            
            if (profileType === 'funcionario') {
                const candidatoPage = document.getElementById('perfil-candidato');
                if (candidatoPage) {
                    candidatoPage.classList.add('active');
                }
            } else if (profileType === 'empregador') {
                const empresaPage = document.getElementById('informacoes-vaga');
                if (empresaPage) {
                    empresaPage.classList.add('active');
                }
            }
        });
    });
    
    showPageBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const pageId = this.getAttribute('data-page-id');
            
            navLinks.forEach(l => l.classList.remove('active'));
            pages.forEach(page => page.classList.remove('active'));
            
            const targetLink = document.querySelector(`[data-page="${pageId}"]`);
            const targetPage = document.getElementById(pageId);
            
            if (targetLink && targetPage) {
                targetLink.classList.add('active');
                targetPage.classList.add('active');
            }
        });
    });
    
    // Perfil do candidato - Progresso
    const formInputs = document.querySelectorAll('#perfil-candidato input, #perfil-candidato select');
    const checkboxes = document.querySelectorAll('#perfil-candidato input[type="checkbox"]');
    const progressFill = document.getElementById('progress-fill');
    
    function updateProgress() {
        let filledFields = 0;
        let totalFields = 4; // nome, estado, cidade, programa
        
        formInputs.forEach(input => {
            if (input.type !== 'checkbox' && input.value.trim() !== '') {
                filledFields++;
            }
        });
        
        const checkedBoxes = document.querySelectorAll('#perfil-candidato input[type="checkbox"]:checked').length;
        const competenciasProgress = Math.min(checkedBoxes / 5, 1); // Máximo 5 competências para 100%
        
        const totalProgress = ((filledFields / totalFields) * 80) + (competenciasProgress * 20);
        
        if (progressFill) {
            progressFill.style.width = totalProgress + '%';
        }
    }
    
    formInputs.forEach(input => {
        input.addEventListener('input', updateProgress);
        input.addEventListener('change', updateProgress);
    });
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateProgress);
    });
    
    // Salvar perfil
    const saveProfileBtn = document.querySelector('[data-action="save-profile"]');
    if (saveProfileBtn) {
        saveProfileBtn.addEventListener('click', function() {
            const profileData = {
                nome: document.getElementById('nome')?.value || '',
                estado: document.getElementById('estado')?.value || '',
                cidade: document.getElementById('cidade')?.value || '',
                programa: document.getElementById('programa')?.value || '',
                competencias: Array.from(document.querySelectorAll('#perfil-candidato input[type="checkbox"]:checked')).map(cb => cb.value)
            };
            
            // Verificar consentimentos
            const consentData = document.getElementById('consent-data')?.checked;
            const consentContact = document.getElementById('consent-contact')?.checked;
            
            // Validar campos obrigatórios
            if (!profileData.nome || !profileData.estado || !profileData.cidade || !profileData.programa) {
                showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
                return;
            }
            
            // Validar consentimentos
            if (!consentData || !consentContact) {
                showNotification('É necessário aceitar os termos de consentimento para continuar.', 'error');
                return;
            }
            
            // Adicionar dados de consentimento
            profileData.tipo = 'funcionario';
            profileData.consentimentos = {
                data: consentData,
                contact: consentContact,
                timestamp: new Date().toISOString()
            };
            profileData.dataCriacao = new Date().toISOString();
            
            localStorage.setItem('skynet-user-profile', JSON.stringify(profileData));
            
            // Feedback visual no botão
            this.innerHTML = '<i class="fas fa-check"></i> Perfil Salvo!';
            this.style.background = 'var(--green)';
            
            // Mostrar notificação de sucesso
            const successNotification = document.getElementById('profile-success');
            const recommendedJobs = document.getElementById('recommended-jobs');
            
            if (successNotification) {
                successNotification.style.display = 'block';
                successNotification.scrollIntoView({ behavior: 'smooth' });
            }
            
            // Mostrar vagas recomendadas após 2 segundos
            setTimeout(() => {
                if (recommendedJobs) {
                    recommendedJobs.style.display = 'block';
                }
            }, 2000);
            
            // Resetar botão após 3 segundos
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-check"></i> Atualizar Perfil';
                this.style.background = '';
            }, 3000);
        });
    }
    
    // CORREÇÃO: Botão de melhoria do perfil que abre o chat BIA
    const improvementBtn = document.querySelector('[data-action="open-chat-recommendation"]');
    if (improvementBtn) {
        improvementBtn.addEventListener('click', function() {
            // Abrir chat BIA
            const chatToggle = document.getElementById('chat-toggle');
            if (chatToggle) {
                chatToggle.click();
            }
            
            // Enviar mensagem automática após um delay
            setTimeout(() => {
                if (window.chatApp) {
                    window.chatApp.sendMessage('Gostaria de recomendações de cursos para aprimorar meu perfil profissional', true);
                }
            }, 1000);
        });
    }
    
    // FAQ Toggle
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', function() {
                const isActive = item.classList.contains('active');
                
                // Fechar todos os outros FAQs
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                });
                
                // Toggle do item atual
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });
    
    // Menu mobile
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Botão "Me interesso" nas vagas
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-interesse')) {
            e.preventDefault();
            
            // Ativar chat da BIA
            const chatContainer = document.getElementById('chat-container');
            const chatBody = document.getElementById('chat-body');
            
            if (chatContainer && chatBody) {
                chatContainer.classList.add('active');
                
                // Limpar chat anterior
                chatBody.innerHTML = '';
                
                // Mensagem da BIA sobre interesse na vaga
                setTimeout(() => {
                    addBotMessage('Que legal! Vejo que você tem interesse nesta vaga. Para que eu possa conectar você com a empresa, preciso de um meio de contato. Qual você prefere?');
                    
                    // Adicionar botões de opção
                    setTimeout(() => {
                        addContactOptions();
                    }, 1000);
                }, 500);
            }
        }
    });

    // Inicializar progresso
    updateProgress();
});

// Função para adicionar opções de contato
function addContactOptions() {
    const chatBody = document.getElementById('chat-body');
    if (!chatBody) return;
    
    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'contact-options';
    optionsDiv.innerHTML = `
        <div class="bot-message">
            <div class="message-content">
                <div class="contact-buttons">
                    <button class="contact-option-btn" data-contact="email">
                        <i class="fas fa-envelope"></i>
                        E-mail
                    </button>
                    <button class="contact-option-btn" data-contact="phone">
                        <i class="fas fa-phone"></i>
                        Telefone
                    </button>
                </div>
            </div>
        </div>
    `;
    
    chatBody.appendChild(optionsDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
    
    // Event listeners para as opções
    optionsDiv.addEventListener('click', function(e) {
        if (e.target.closest('.contact-option-btn')) {
            const contactType = e.target.closest('.contact-option-btn').getAttribute('data-contact');
            handleContactChoice(contactType);
        }
    });
}

// Função para lidar com a escolha do meio de contato
function handleContactChoice(contactType) {
    const chatBody = document.getElementById('chat-body');
    if (!chatBody) return;
    
    // Remover botões de opção
    const contactOptions = chatBody.querySelector('.contact-options');
    if (contactOptions) {
        contactOptions.remove();
    }
    
    // Mostrar escolha do usuário
    const userChoice = contactType === 'email' ? 'E-mail' : 'Telefone';
    addUserMessage(`Prefiro ser contatado por: ${userChoice}`);
    
    // Resposta da BIA solicitando o contato
    setTimeout(() => {
        const contactLabel = contactType === 'email' ? 'seu e-mail' : 'seu telefone';
        addBotMessage(`Perfeito! Agora me informe ${contactLabel}:`);
        
        // Adicionar campo de input
        setTimeout(() => {
            addContactInput(contactType);
        }, 500);
    }, 1000);
}

// Função para adicionar campo de input de contato
function addContactInput(contactType) {
    const chatBody = document.getElementById('chat-body');
    if (!chatBody) return;
    
    const inputDiv = document.createElement('div');
    inputDiv.className = 'contact-input-container';
    inputDiv.innerHTML = `
        <div class="bot-message">
            <div class="message-content">
                <div class="contact-input-form">
                    <input type="${contactType === 'email' ? 'email' : 'tel'}" 
                           id="contact-input" 
                           placeholder="${contactType === 'email' ? 'seu@email.com' : '(11) 99999-9999'}" 
                           class="contact-input">
                    <button class="submit-contact-btn" onclick="submitContact('${contactType}')">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    chatBody.appendChild(inputDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
    
    // Focar no input
    const input = inputDiv.querySelector('#contact-input');
    input.focus();
    
    // Enter para enviar
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            submitContact(contactType);
        }
    });
}

// Função global para submeter contato
window.submitContact = function(contactType) {
    const input = document.getElementById('contact-input');
    if (!input || !input.value.trim()) return;
    
    const contactValue = input.value.trim();
    
    // Validação básica
    if (contactType === 'email' && !contactValue.includes('@')) {
        addBotMessage('Por favor, insira um e-mail válido.');
        return;
    }
    
    if (contactType === 'phone' && contactValue.length < 10) {
        addBotMessage('Por favor, insira um telefone válido.');
        return;
    }
    
    // Remover input
    const inputContainer = document.querySelector('.contact-input-container');
    if (inputContainer) {
        inputContainer.remove();
    }
    
    // Mostrar contato do usuário
    addUserMessage(contactValue);
    
    // Mostrar termos de consentimento
    setTimeout(() => {
        showConsentTerms(contactType, contactValue);
    }, 1000);
};

// Função para mostrar termos de consentimento
function showConsentTerms(contactType, contactValue) {
    addBotMessage('Antes de prosseguir, preciso que você aceite nossos termos de comprometimento e segurança de dados:');
    
    setTimeout(() => {
        const chatBody = document.getElementById('chat-body');
        if (!chatBody) return;
        
        const termsDiv = document.createElement('div');
        termsDiv.className = 'consent-terms';
        termsDiv.innerHTML = `
            <div class="bot-message">
                <div class="message-content">
                    <div class="terms-container">
                        <div class="terms-text">
                            <h4>Termos de Consentimento</h4>
                            <p>• Autorizo o compartilhamento dos meus dados de contato com a empresa para fins de recrutamento</p>
                            <p>• Concordo com o tratamento dos meus dados pessoais conforme a LGPD</p>
                            <p>• Estou ciente de que posso revogar este consentimento a qualquer momento</p>
                        </div>
                        <div class="terms-buttons">
                            <button class="accept-terms-btn" onclick="acceptTerms('${contactType}', '${contactValue}')">
                                <i class="fas fa-check"></i>
                                Aceito os Termos
                            </button>
                            <button class="decline-terms-btn" onclick="declineTerms()">
                                <i class="fas fa-times"></i>
                                Não Aceito
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        chatBody.appendChild(termsDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    }, 1000);
}

// Função global para aceitar termos
window.acceptTerms = function(contactType, contactValue) {
    // Remover termos
    const termsContainer = document.querySelector('.consent-terms');
    if (termsContainer) {
        termsContainer.remove();
    }
    
    addUserMessage('Aceito os termos de consentimento');
    
    // Salvar dados no localStorage
    const applicationData = {
        contactType: contactType,
        contactValue: contactValue,
        timestamp: new Date().toISOString(),
        status: 'pending'
    };
    
    localStorage.setItem('skynet-job-application', JSON.stringify(applicationData));
    
    // Mensagem de confirmação
    setTimeout(() => {
        addBotMessage('Perfeito! Seus dados foram registrados com segurança. Aguarde que em até 24 horas o sistema da empresa entrará em contato com você. Boa sorte! 🍀');
        
        // Fechar chat após alguns segundos
        setTimeout(() => {
            const chatContainer = document.getElementById('chat-container');
            if (chatContainer) {
                chatContainer.classList.remove('active');
            }
        }, 3000);
    }, 1000);
};

// Função global para recusar termos
window.declineTerms = function() {
    const termsContainer = document.querySelector('.consent-terms');
    if (termsContainer) {
        termsContainer.remove();
    }
    
    addUserMessage('Não aceito os termos');
    
    setTimeout(() => {
        addBotMessage('Entendo. Sem o consentimento, não posso prosseguir com sua candidatura. Se mudar de ideia, estarei aqui para ajudar!');
        
        setTimeout(() => {
            const chatContainer = document.getElementById('chat-container');
            if (chatContainer) {
                chatContainer.classList.remove('active');
            }
        }, 2000);
    }, 1000);
};

// Função global para envio rápido de mensagens no chat
window.sendQuickMessage = function(message) {
    if (window.chatApp) {
        window.chatApp.sendMessage(message, true);
    }
};

    // Função para mostrar dashboard personalizado
    function showProfileDashboard(profileData) {
        const profileSelection = document.getElementById('profile-selection');
        const profileDashboard = document.getElementById('profile-dashboard');
        const funcionarioDashboard = document.getElementById('funcionario-dashboard');
        const empregadorDashboard = document.getElementById('empregador-dashboard');
        
        // Esconder seleção e mostrar dashboard
        profileSelection.style.display = 'none';
        profileDashboard.style.display = 'block';
        
        // Atualizar informações do perfil
        document.getElementById('profile-name').textContent = profileData.nome || 'Nome do Usuário';
        document.getElementById('profile-type-label').textContent = profileData.tipo === 'funcionario' ? 'Funcionário' : 'Empregador';
        document.getElementById('profile-location').textContent = `${profileData.cidade || 'Cidade'}, ${profileData.estado || 'Estado'}`;
        
        // Mostrar dashboard específico
        if (profileData.tipo === 'funcionario') {
            funcionarioDashboard.style.display = 'block';
            empregadorDashboard.style.display = 'none';
            
            // Carregar competências do funcionário
            loadUserSkills(profileData.competencias || []);
        } else {
            empregadorDashboard.style.display = 'block';
            funcionarioDashboard.style.display = 'none';
            
            // Carregar informações da empresa
            loadCompanyInfo(profileData);
        }
    }
    
    // Função para carregar competências do usuário
    function loadUserSkills(competencias) {
        const skillsContainer = document.getElementById('user-skills');
        skillsContainer.innerHTML = '';
        
        if (competencias.length === 0) {
            skillsContainer.innerHTML = '<p style="color: var(--gray); font-style: italic;">Nenhuma competência cadastrada ainda.</p>';
            return;
        }
        
        competencias.forEach(skill => {
            const skillTag = document.createElement('span');
            skillTag.className = 'skill-tag';
            skillTag.innerHTML = `<i class="fas fa-check"></i> ${skill}`;
            skillsContainer.appendChild(skillTag);
        });
    }
    
    // Função para carregar informações da empresa
    function loadCompanyInfo(profileData) {
        const companyContainer = document.getElementById('company-info');
        companyContainer.innerHTML = `
            <div class="company-info-item">
                <i class="fas fa-building"></i>
                <span><strong>Empresa:</strong> ${profileData.nomeEmpresa || 'Não informado'}</span>
            </div>
            <div class="company-info-item">
                <i class="fas fa-industry"></i>
                <span><strong>Setor:</strong> ${profileData.setor || 'Não informado'}</span>
            </div>
            <div class="company-info-item">
                <i class="fas fa-map-marker-alt"></i>
                <span><strong>Localização:</strong> ${profileData.cidade || 'Cidade'}, ${profileData.estado || 'Estado'}</span>
            </div>
            <div class="company-info-item">
                <i class="fas fa-users"></i>
                <span><strong>Porte:</strong> ${profileData.porte || 'Não informado'}</span>
            </div>
        `;
    }
    
    // Função para verificar se deve mostrar dashboard ou seleção
    function checkProfileStatus() {
        const userProfile = JSON.parse(localStorage.getItem('skynet-user-profile') || '{}');
        
        if (userProfile.nome && userProfile.tipo) {
            showProfileDashboard(userProfile);
        }
    }
    
    // Botão de logout/trocar perfil
    document.addEventListener('click', function(e) {
        if (e.target.matches('[data-action="logout-profile"]') || e.target.closest('[data-action="logout-profile"]')) {
            // Limpar dados do localStorage
            localStorage.removeItem('skynet-user-profile');
            
            // Voltar para seleção de perfil
            document.getElementById('profile-selection').style.display = 'block';
            document.getElementById('profile-dashboard').style.display = 'none';
            
            // Mostrar notificação
            showNotification('Perfil desconectado com sucesso! Você pode criar um novo perfil.', 'success');
        }
        
        if (e.target.matches('[data-action="edit-profile"]') || e.target.closest('[data-action="edit-profile"]')) {
            const userProfile = JSON.parse(localStorage.getItem('skynet-user-profile') || '{}');
            
            if (userProfile.tipo === 'funcionario') {
                // Ir para página de edição do funcionário
                document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
                document.getElementById('perfil-candidato').classList.add('active');
                
                // Preencher formulário com dados existentes
                fillCandidateForm(userProfile);
            } else {
                // Ir para página de edição do empregador
                document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
                document.getElementById('perfil-empregador').classList.add('active');
                
                // Preencher formulário com dados existentes
                fillEmployerForm(userProfile);
            }
        }
        
        if (e.target.matches('[data-action="go-to-vagas"]') || e.target.closest('[data-action="go-to-vagas"]')) {
            // Navegar para página de vagas
            document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
            document.querySelector('[data-page="vagas"]').classList.add('active');
            
            document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
            document.getElementById('vagas').classList.add('active');
        }
        
        if (e.target.matches('[data-action="go-to-candidates"]') || e.target.closest('[data-action="go-to-candidates"]')) {
            // Navegar para página de candidatos sugeridos
            document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
            document.querySelector('[data-page="vagas"]').classList.add('active');
            
            document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
            document.getElementById('vagas-empresario').classList.add('active');
        }
        
        if (e.target.matches('[data-action="open-chat-courses"]') || e.target.closest('[data-action="open-chat-courses"]')) {
            // Abrir chat com recomendações de cursos
            if (window.biaChat) {
                window.biaChat.openChat();
                window.biaChat.sendMessage('Quais cursos você recomenda para aprimorar meu perfil profissional?', true);
            }
        }
    });
    
    // Função para preencher formulário do candidato com dados existentes
    function fillCandidateForm(profileData) {
        if (profileData.nome) document.getElementById('nome').value = profileData.nome;
        if (profileData.estado) document.getElementById('estado').value = profileData.estado;
        if (profileData.cidade) document.getElementById('cidade').value = profileData.cidade;
        if (profileData.programa) document.getElementById('programa').value = profileData.programa;
        
        // Marcar competências selecionadas
        if (profileData.competencias) {
            profileData.competencias.forEach(comp => {
                const checkbox = document.querySelector(`input[value="${comp}"]`);
                if (checkbox) checkbox.checked = true;
            });
        }
    }
    
    // Função para preencher formulário do empregador com dados existentes
    function fillEmployerForm(profileData) {
        if (profileData.nomeEmpresa) document.getElementById('nome-empresa').value = profileData.nomeEmpresa;
        if (profileData.setor) document.getElementById('setor').value = profileData.setor;
        if (profileData.porte) document.getElementById('porte').value = profileData.porte;
        if (profileData.estado) document.getElementById('estado-empresa').value = profileData.estado;
        if (profileData.cidade) document.getElementById('cidade-empresa').value = profileData.cidade;
    }
    
    // Verificar status do perfil ao carregar a página
    checkProfileStatus();
