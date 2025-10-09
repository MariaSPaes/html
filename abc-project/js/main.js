// SKYNET - Sistema de Conexão de Talentos do ABC Paulista
// Arquivo principal com funcionalidades atualizadas

// Declarar variáveis globais para navegação
let navLinks, pages;

document.addEventListener('DOMContentLoaded', function() {
    
    // Inicializar LGPD
    initLGPD();
    
    // Carregar dados do usuário se existir
    loadUserProfile();
    
    // Navegação entre páginas
    navLinks = document.querySelectorAll('.nav-link');
    pages = document.querySelectorAll('.page');
    
    // Verificar se os elementos existem antes de usar forEach
    if (!navLinks || navLinks.length === 0) {
        console.warn('Elementos .nav-link não encontrados');
        return;
    }
    
    if (!pages || pages.length === 0) {
        console.warn('Elementos .page não encontrados');
        return;
    }
    
    // Navegação entre páginas com controle de acesso
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetPage = this.getAttribute('data-page');
            
            // Verificar se o usuário tem perfil criado para acessar certas páginas
            const userProfile = JSON.parse(localStorage.getItem('skynet-user-profile') || '{}');
            const restrictedPages = ['vagas'];
            
            if (restrictedPages.includes(targetPage) && (!userProfile.nome || !userProfile.estado)) {
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
                
                // Carregar conteúdo específico da página
                if (targetPage === 'vagas') {
                    loadVagasPage();
                } else if (targetPage === 'meu-perfil') {
                    loadProfilePage();
                }
            }
        });
    });
    
    // Event listeners para botões da página inicial
    document.addEventListener('click', function(e) {
        const action = e.target.closest('[data-action]')?.getAttribute('data-action');
        
        switch(action) {
            case 'create-candidate-profile':
            case 'candidate-flow':
                showPage('perfil-candidato');
                break;
                
            case 'create-employer-profile':
            case 'employer-flow':
                showPage('perfil-empregador');
                break;
                
            case 'select-profile-type':
                const type = e.target.closest('[data-type]')?.getAttribute('data-type');
                if (type === 'funcionario') {
                    showPage('perfil-candidato');
                } else if (type === 'empregador') {
                    showPage('perfil-empregador');
                }
                break;
                
            case 'save-candidate-profile':
                saveCandidateProfile();
                break;
                
            case 'save-employer-profile':
                saveEmployerProfile();
                break;
                
            case 'edit-profile':
                editProfile();
                break;
                
            case 'logout-profile':
                logoutProfile();
                break;
                
            case 'go-to-vagas':
                showPage('vagas');
                break;
                
            case 'open-chat-courses':
                openChatWithCourses();
                break;
                
            case 'open-chat-tutorial':
                const tutorialType = e.target.closest('[data-tutorial]')?.getAttribute('data-tutorial');
                openChatWithTutorial(tutorialType);
                break;
                
            case 'toggle-faq':
                toggleFAQ(e.target.closest('.faq-item'));
                break;
        }
    });
    
    // Função para mostrar página
    function showPage(pageId) {
        // Atualizar navegação
        navLinks.forEach(l => l.classList.remove('active'));
        pages.forEach(page => page.classList.remove('active'));
        
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
            
            // Atualizar link ativo se existir
            const correspondingLink = document.querySelector(`[data-page="${pageId}"]`);
            if (correspondingLink) {
                correspondingLink.classList.add('active');
            }
        }
    }
    
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
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
    }
    
    // Função para ir ao perfil
    window.goToProfile = function() {
        showPage('meu-perfil');
        
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
    
    // Função para salvar perfil do candidato
    function saveCandidateProfile() {
        console.log('Iniciando salvamento do perfil do candidato...');
        
        const nome = document.getElementById('nome')?.value;
        const email = document.getElementById('email')?.value;
        const telefone = document.getElementById('telefone')?.value;
        const estado = document.getElementById('estado')?.value;
        const cidade = document.getElementById('cidade')?.value;
        const escolaridade = document.getElementById('escolaridade')?.value;
        const areaInteresse = document.getElementById('area-interesse')?.value;
        const experiencia = document.getElementById('experiencia')?.value;
        const cursos = document.getElementById('cursos')?.value;
        const habilidades = document.getElementById('habilidades')?.value;
        const disponibilidade = document.getElementById('disponibilidade')?.value;
        const consentData = document.getElementById('consent-data')?.checked;
        const consentContact = document.getElementById('consent-contact')?.checked;
        
        console.log('Dados coletados:', { nome, email, telefone, cidade, estado, escolaridade, areaInteresse });
        
        // Validação básica
        if (!nome || !estado || !cidade || !escolaridade || !areaInteresse || !consentData) {
            showErrorNotification('Por favor, preencha todos os campos obrigatórios e aceite o uso dos dados.');
            return;
        }
        
        const profile = {
            tipo: 'funcionario',
            nome,
            email: email || '',
            telefone: telefone || '',
            estado,
            cidade,
            escolaridade,
            area_interesse: areaInteresse,
            experiencia: experiencia || '',
            cursos: cursos ? cursos.split(',').map(c => c.trim()) : [],
            habilidades: habilidades || '',
            disponibilidade: disponibilidade || '',
            consent_data: consentData,
            consent_contact: consentContact,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        
        try {
            localStorage.setItem('skynet-user-profile', JSON.stringify(profile));
            console.log('Perfil salvo no localStorage:', profile);
            
            // Verificar se foi salvo corretamente
            const savedProfile = localStorage.getItem('skynet-user-profile');
            if (savedProfile) {
                console.log('Verificação: perfil encontrado no localStorage');
                
                // Mostrar dashboard
                showProfileDashboard(profile);
                
                // Mostrar notificação de sucesso
                showSuccessNotification('✅ Perfil de funcionário salvo com sucesso! Agora você pode acessar vagas compatíveis.');
            } else {
                throw new Error('Falha ao salvar no localStorage');
            }
        } catch (error) {
            console.error('Erro ao salvar perfil:', error);
            showErrorNotification('❌ Erro ao salvar perfil. Tente novamente.');
        }
    }
    
    // Função para salvar perfil do empregador
    function saveEmployerProfile() {
        console.log('Iniciando salvamento do perfil do empregador...');
        
        const nomeEmpresa = document.getElementById('nome-empresa')?.value;
        const cnpj = document.getElementById('cnpj')?.value;
        const setor = document.getElementById('setor-empresa')?.value;
        const porte = document.getElementById('porte-empresa')?.value;
        const cidade = document.getElementById('cidade-empresa')?.value;
        const descricao = document.getElementById('descricao-empresa')?.value;
        const areasContratacao = document.getElementById('areas-contratacao')?.value;
        const beneficios = document.getElementById('beneficios')?.value;
        const consentData = document.getElementById('consent-empresa-data')?.checked;
        const consentContact = document.getElementById('consent-empresa-contact')?.checked;
        
        console.log('Dados coletados:', { nomeEmpresa, cnpj, setor, porte, cidade });
        
        // Validação básica
        if (!nomeEmpresa || !cnpj || !setor || !porte || !cidade || !consentData) {
            showErrorNotification('Por favor, preencha todos os campos obrigatórios e aceite o uso dos dados.');
            return;
        }
        
        const profile = {
            tipo: 'empregador',
            nome_empresa: nomeEmpresa,
            cnpj,
            setor,
            porte,
            cidade,
            descricao: descricao || '',
            areas_contratacao: areasContratacao ? areasContratacao.split(',').map(a => a.trim()) : [],
            beneficios: beneficios || '',
            consent_data: consentData,
            consent_contact: consentContact,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        
        try {
            localStorage.setItem('skynet-user-profile', JSON.stringify(profile));
            console.log('Perfil da empresa salvo no localStorage:', profile);
            
            // Verificar se foi salvo corretamente
            const savedProfile = localStorage.getItem('skynet-user-profile');
            if (savedProfile) {
                console.log('Verificação: perfil da empresa encontrado no localStorage');
                
                // Mostrar dashboard
                showProfileDashboard(profile);
                
                // Mostrar notificação de sucesso
                showSuccessNotification('✅ Perfil da empresa salvo com sucesso! Agora você pode encontrar candidatos compatíveis.');
            } else {
                throw new Error('Falha ao salvar no localStorage');
            }
        } catch (error) {
            console.error('Erro ao salvar perfil da empresa:', error);
            showErrorNotification('❌ Erro ao salvar perfil da empresa. Tente novamente.');
        }
    }
    
    // Função para mostrar dashboard do perfil
    function showProfileDashboard(profile) {
        const profileSelection = document.getElementById('profile-selection');
        const profileDashboard = document.getElementById('profile-dashboard');
        
        if (profileSelection && profileDashboard) {
            profileSelection.style.display = 'none';
            profileDashboard.style.display = 'block';
            
            // Atualizar informações do cabeçalho
            const profileName = document.getElementById('profile-name');
            const profileTypeLabel = document.getElementById('profile-type-label');
            const profileLocation = document.getElementById('profile-location');
            
            if (profile.tipo === 'funcionario') {
                profileName.textContent = profile.nome;
                profileTypeLabel.textContent = 'Funcionário';
                profileLocation.textContent = `${profile.cidade}, ${profile.estado}`;
                
                // Mostrar dashboard do funcionário
                document.getElementById('funcionario-dashboard').style.display = 'block';
                document.getElementById('empregador-dashboard').style.display = 'none';
                
                // Carregar dados do funcionário
                loadCandidateDashboard(profile);
                
            } else if (profile.tipo === 'empregador') {
                profileName.textContent = profile.nome_empresa;
                profileTypeLabel.textContent = 'Empregador';
                profileLocation.textContent = `${profile.cidade}, SP`;
                
                // Mostrar dashboard do empregador
                document.getElementById('funcionario-dashboard').style.display = 'none';
                document.getElementById('empregador-dashboard').style.display = 'block';
                
                // Carregar dados do empregador
                loadEmployerDashboard(profile);
            }
        }
        
        // Ir para página do perfil
        showPage('meu-perfil');
    }
    
    // Função para carregar dashboard do candidato
    function loadCandidateDashboard(profile) {
        if (typeof empresasABC === 'undefined') return;
        
        // Calcular vagas compatíveis
        let vagasCompativeis = [];
        let totalCompatibilidade = 0;
        
        empresasABC.forEach(empresa => {
            empresa.vagas.forEach(vaga => {
                const compatibilidade = calcularCompatibilidade(profile, {
                    ...vaga,
                    area: empresa.area,
                    cidade: empresa.cidade
                });
                
                if (compatibilidade > 70) { // Apenas vagas com alta compatibilidade
                    vagasCompativeis.push({
                        ...vaga,
                        empresa: empresa.nome,
                        area: empresa.area,
                        cidade: empresa.cidade,
                        compatibilidade
                    });
                    totalCompatibilidade += compatibilidade;
                }
            });
        });
        
        // Ordenar por compatibilidade
        vagasCompativeis.sort((a, b) => b.compatibilidade - a.compatibilidade);
        
        // Atualizar estatísticas
        document.getElementById('vagas-compativeis-count').textContent = vagasCompativeis.length;
        document.getElementById('compatibilidade-media').textContent = 
            vagasCompativeis.length > 0 ? Math.round(totalCompatibilidade / vagasCompativeis.length) + '%' : '0%';
        
        // Recomendar cursos
        const cursosRecomendados = recomendarCursos(profile);
        document.getElementById('cursos-recomendados-count').textContent = cursosRecomendados.length;
        
        // Mostrar competências
        const skillsDisplay = document.getElementById('user-skills');
        if (skillsDisplay && profile.habilidades) {
            const skills = profile.habilidades.split(',').map(s => s.trim()).filter(s => s);
            skillsDisplay.innerHTML = skills.map(skill => 
                `<span class="skill-tag">${skill}</span>`
            ).join('');
        }
        
        // Mostrar empresas compatíveis
        const empresasCompativeis = document.getElementById('empresas-compativeis');
        if (empresasCompativeis) {
            const empresasUnicas = [...new Set(vagasCompativeis.map(v => v.empresa))];
            empresasCompativeis.innerHTML = empresasUnicas.slice(0, 5).map(empresa => {
                const vagasEmpresa = vagasCompativeis.filter(v => v.empresa === empresa);
                const mediaCompatibilidade = Math.round(
                    vagasEmpresa.reduce((sum, v) => sum + v.compatibilidade, 0) / vagasEmpresa.length
                );
                
                return `
                    <div class="empresa-card">
                        <h4>${empresa}</h4>
                        <p>${vagasEmpresa.length} vaga(s) compatível(is)</p>
                        <div class="compatibilidade-badge">
                            <span>${mediaCompatibilidade}% compatível</span>
                        </div>
                    </div>
                `;
            }).join('');
        }
    }
    
    // Função para carregar dashboard do empregador
    function loadEmployerDashboard(profile) {
        // Simular dados para o empregador
        document.getElementById('candidatos-sugeridos-count').textContent = '24';
        document.getElementById('vagas-ativas-count').textContent = '3';
        document.getElementById('matches-realizados-count').textContent = '7';
        
        // Mostrar informações da empresa
        const companyInfo = document.getElementById('company-info');
        if (companyInfo) {
            companyInfo.innerHTML = `
                <div class="company-details">
                    <h4>${profile.nome_empresa}</h4>
                    <p><strong>Setor:</strong> ${profile.setor}</p>
                    <p><strong>Porte:</strong> ${profile.porte}</p>
                    <p><strong>Localização:</strong> ${profile.cidade}, SP</p>
                    ${profile.descricao ? `<p><strong>Descrição:</strong> ${profile.descricao}</p>` : ''}
                </div>
            `;
        }
        
        // Mostrar candidatos compatíveis (simulado)
        const candidatosCompativeis = document.getElementById('candidatos-compativeis');
        if (candidatosCompativeis) {
            candidatosCompativeis.innerHTML = `
                <div class="candidato-card">
                    <div class="candidato-header">
                        <div class="candidato-avatar">LC</div>
                        <div class="candidato-info">
                            <h4>Lucas Costa</h4>
                            <p>Operador de Produção</p>
                            <div class="match-score">
                                <span class="match-percentage">92%</span>
                                <span class="match-label">Compatibilidade</span>
                            </div>
                        </div>
                    </div>
                    <div class="candidato-skills">
                        <span class="skill-tag">Produção</span>
                        <span class="skill-tag">NR-12</span>
                        <span class="skill-tag">5 anos exp.</span>
                    </div>
                    <div class="candidato-location">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>Santo André, SP</span>
                    </div>
                    <button class="btn-contact-candidate">
                        <i class="fas fa-envelope"></i>
                        Entrar em Contato
                    </button>
                </div>
                
                <div class="candidato-card">
                    <div class="candidato-header">
                        <div class="candidato-avatar">MS</div>
                        <div class="candidato-info">
                            <h4>Mariana Silva</h4>
                            <p>Técnica de Manutenção</p>
                            <div class="match-score">
                                <span class="match-percentage">88%</span>
                                <span class="match-label">Compatibilidade</span>
                            </div>
                        </div>
                    </div>
                    <div class="candidato-skills">
                        <span class="skill-tag">Soldagem</span>
                        <span class="skill-tag">NR-35</span>
                        <span class="skill-tag">3 anos exp.</span>
                    </div>
                    <div class="candidato-location">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>São Bernardo, SP</span>
                    </div>
                    <button class="btn-contact-candidate">
                        <i class="fas fa-envelope"></i>
                        Entrar em Contato
                    </button>
                </div>
            `;
        }
    }
    
    // Função para carregar perfil do usuário
    function loadUserProfile() {
        const profile = JSON.parse(localStorage.getItem('skynet-user-profile') || '{}');
        
        if (profile.nome || profile.nome_empresa) {
            showProfileDashboard(profile);
        }
    }
    
    // Função para carregar página de perfil
    function loadProfilePage() {
        const profile = JSON.parse(localStorage.getItem('skynet-user-profile') || '{}');
        
        if (profile.nome || profile.nome_empresa) {
            showProfileDashboard(profile);
        } else {
            // Mostrar seleção de tipo de perfil
            const profileSelection = document.getElementById('profile-selection');
            const profileDashboard = document.getElementById('profile-dashboard');
            
            if (profileSelection && profileDashboard) {
                profileSelection.style.display = 'block';
                profileDashboard.style.display = 'none';
            }
        }
    }
    
    // Função para carregar página de vagas
    function loadVagasPage() {
        const profile = JSON.parse(localStorage.getItem('skynet-user-profile') || '{}');
        
        if (profile.tipo === 'funcionario' && typeof empresasABC !== 'undefined') {
            loadVagasForCandidate(profile);
        }
    }
    
    // Função para carregar vagas para candidato
    function loadVagasForCandidate(profile) {
        const vagasContainer = document.getElementById('vagas-compativeis');
        const userProfileSummary = document.getElementById('user-profile-summary');
        const recommendedCourses = document.getElementById('recommended-courses');
        
        if (!vagasContainer) return;
        
        // Calcular vagas compatíveis
        let vagasCompativeis = [];
        
        empresasABC.forEach(empresa => {
            empresa.vagas.forEach(vaga => {
                const compatibilidade = calcularCompatibilidade(profile, {
                    ...vaga,
                    area: empresa.area,
                    cidade: empresa.cidade
                });
                
                vagasCompativeis.push({
                    ...vaga,
                    empresa: empresa.nome,
                    area: empresa.area,
                    cidade: empresa.cidade,
                    compatibilidade
                });
            });
        });
        
        // Ordenar por compatibilidade
        vagasCompativeis.sort((a, b) => b.compatibilidade - a.compatibilidade);
        
        // Renderizar vagas
        vagasContainer.innerHTML = vagasCompativeis.map(vaga => `
            <div class="vaga-card">
                <div class="vaga-header">
                    <div class="vaga-info">
                        <h4>${vaga.cargo} - ${vaga.empresa} - ${vaga.cidade}</h4>
                        <div class="vaga-details">
                            <span><i class="fas fa-dollar-sign"></i> ${vaga.salario}</span>
                            <span><i class="fas fa-clock"></i> ${vaga.tipo}</span>
                            <span><i class="fas fa-users"></i> ${vaga.candidatos} candidatos</span>
                        </div>
                    </div>
                    <div class="compatibilidade-badge">
                        <span>Compatibilidade</span>
                        <span class="percentage">${vaga.compatibilidade}%</span>
                    </div>
                </div>
                <div class="match-reasons">
                    <h5>Por que você é compatível:</h5>
                    <div class="reasons-list">
                        ${vaga.requisitos.slice(0, 3).map(req => 
                            `<span class="reason-tag">✓ ${req}</span>`
                        ).join('')}
                    </div>
                </div>
                <div class="recommended-courses-vaga">
                    <h5>Cursos recomendados para esta vaga:</h5>
                    <div class="courses-list">
                        ${vaga.cursos_recomendados.slice(0, 2).map(curso => 
                            `<span class="course-tag">${curso}</span>`
                        ).join('')}
                    </div>
                </div>
                <div class="vaga-actions">
                    <button class="btn-apply" onclick="applyToJob('${vaga.empresa}', '${vaga.cargo}')">
                        <i class="fas fa-paper-plane"></i>
                        Candidatar-se
                    </button>
                    <button class="btn-save-job" onclick="saveJob('${vaga.empresa}', '${vaga.cargo}')">
                        <i class="fas fa-bookmark"></i>
                        Salvar Vaga
                    </button>
                </div>
            </div>
        `).join('');
        
        // Mostrar resumo do perfil
        if (userProfileSummary) {
            userProfileSummary.innerHTML = `
                <div class="profile-summary">
                    <h5>${profile.nome}</h5>
                    <p>${profile.area_interesse}</p>
                    <p>${profile.cidade}, ${profile.estado}</p>
                    <div class="profile-stats">
                        <span>${vagasCompativeis.length} vagas compatíveis</span>
                    </div>
                </div>
            `;
        }
        
        // Mostrar cursos recomendados
        if (recommendedCourses && typeof recomendarCursos !== 'undefined') {
            const cursos = recomendarCursos(profile);
            recommendedCourses.innerHTML = cursos.slice(0, 4).map(curso => `
                <div class="course-recommendation">
                    <h6>${curso.nome}</h6>
                    <p>${curso.carga_horaria} • ${curso.modalidade}</p>
                    <a href="${curso.link}" target="_blank" class="btn-course">
                        <i class="fas fa-external-link-alt"></i>
                        Acessar Curso
                    </a>
                </div>
            `).join('');
        }
    }
    
    // Função para editar perfil
    function editProfile() {
        const profile = JSON.parse(localStorage.getItem('skynet-user-profile') || '{}');
        
        if (profile.tipo === 'funcionario') {
            showPage('perfil-candidato');
            // Preencher formulário com dados existentes
            fillCandidateForm(profile);
        } else if (profile.tipo === 'empregador') {
            showPage('perfil-empregador');
            // Preencher formulário com dados existentes
            fillEmployerForm(profile);
        }
    }
    
    // Função para preencher formulário do candidato
    function fillCandidateForm(profile) {
        document.getElementById('nome').value = profile.nome || '';
        document.getElementById('estado').value = profile.estado || '';
        document.getElementById('cidade').value = profile.cidade || '';
        document.getElementById('escolaridade').value = profile.escolaridade || '';
        document.getElementById('area-interesse').value = profile.area_interesse || '';
        document.getElementById('experiencia').value = profile.experiencia || '';
        document.getElementById('cursos').value = profile.cursos ? profile.cursos.join(', ') : '';
        document.getElementById('habilidades').value = profile.habilidades || '';
        document.getElementById('disponibilidade').value = profile.disponibilidade || '';
        document.getElementById('consent-data').checked = profile.consent_data || false;
        document.getElementById('consent-contact').checked = profile.consent_contact || false;
    }
    
    // Função para preencher formulário do empregador
    function fillEmployerForm(profile) {
        document.getElementById('nome-empresa').value = profile.nome_empresa || '';
        document.getElementById('cnpj').value = profile.cnpj || '';
        document.getElementById('setor-empresa').value = profile.setor || '';
        document.getElementById('porte-empresa').value = profile.porte || '';
        document.getElementById('cidade-empresa').value = profile.cidade || '';
        document.getElementById('descricao-empresa').value = profile.descricao || '';
        document.getElementById('areas-contratacao').value = profile.areas_contratacao ? profile.areas_contratacao.join(', ') : '';
        document.getElementById('beneficios').value = profile.beneficios || '';
        document.getElementById('consent-empresa-data').checked = profile.consent_data || false;
        document.getElementById('consent-empresa-contact').checked = profile.consent_contact || false;
    }
    
    // Função para logout do perfil
    function logoutProfile() {
        if (confirm('Tem certeza que deseja sair? Seus dados serão mantidos para próximo acesso.')) {
            // Não remover dados, apenas voltar para seleção
            const profileSelection = document.getElementById('profile-selection');
            const profileDashboard = document.getElementById('profile-dashboard');
            
            if (profileSelection && profileDashboard) {
                profileSelection.style.display = 'block';
                profileDashboard.style.display = 'none';
            }
        }
    }
    
    // Função para abrir chat com cursos
    function openChatWithCourses() {
        const chatWindow = document.getElementById('chat-window');
        if (chatWindow) {
            chatWindow.classList.add('active');
            
            // Adicionar mensagem sobre cursos
            const chatBody = document.getElementById('chat-body');
            if (chatBody) {
                const message = document.createElement('div');
                message.className = 'chat-message bot-message';
                message.innerHTML = `
                    <div class="message-content">
                        <p>Aqui estão alguns cursos online gratuitos do SENAI recomendados para você:</p>
                        <ul>
                            <li>Segurança do Trabalho (14h) - EAD</li>
                            <li>Lean Manufacturing (20h) - EAD</li>
                            <li>Metrologia (30h) - EAD</li>
                            <li>Logística (40h) - EAD</li>
                        </ul>
                        <p>Todos são 100% online e gratuitos! Quer saber mais sobre algum deles?</p>
                    </div>
                `;
                chatBody.appendChild(message);
                chatBody.scrollTop = chatBody.scrollHeight;
            }
        }
    }
    
    // Função para abrir chat com tutorial específico
    function openChatWithTutorial(tutorialType) {
        const chatWindow = document.getElementById('chat-window');
        const chatBody = document.getElementById('chat-body');
        
        if (!chatWindow || !chatBody) return;
        
        // Abrir chat
        chatWindow.classList.add('active');
        
        // Limpar mensagens anteriores
        chatBody.innerHTML = '';
        
        // Obter perfil do usuário
        const userProfile = JSON.parse(localStorage.getItem('skynet-user-profile') || '{}');
        const userName = userProfile.nome || userProfile.nome_empresa || 'usuário';
        const userType = userProfile.tipo || 'visitante';
        
        // Mensagem inicial personalizada
        const welcomeMessage = document.createElement('div');
        welcomeMessage.className = 'chat-message bot-message';
        welcomeMessage.innerHTML = `
            <div class="message-content">
                <p>Olá ${userName}! 👋</p>
                <p>Sou a BIA, sua mentora de carreira do ABC Paulista. Vou te ajudar com este tutorial personalizado!</p>
            </div>
        `;
        chatBody.appendChild(welcomeMessage);
        
        // Mensagem específica do tutorial baseada no perfil
        const tutorialMessage = document.createElement('div');
        tutorialMessage.className = 'chat-message bot-message';
        
        let tutorialContent = '';
        
        switch(tutorialType) {
            case 'como-criar-perfil':
                tutorialContent = `
                    <div class="message-content">
                        <h4>📝 Tutorial: Como criar seu perfil</h4>
                        ${userType === 'funcionario' ? 
                            `<p>Vejo que você já tem um perfil de funcionário! Vou te ajudar a otimizá-lo:</p>
                            <ul>
                                <li><strong>✅ Já preenchido:</strong> Nome, localização</li>
                                <li><strong>💡 Dica:</strong> Complete suas habilidades específicas</li>
                                <li><strong>🎯 Recomendação:</strong> Atualize sua experiência regularmente</li>
                            </ul>` :
                            `<p>Vou te ensinar a criar um perfil completo passo a passo:</p>
                            <ul>
                                <li><strong>1.</strong> Clique em "Criar Perfil" na página inicial</li>
                                <li><strong>2.</strong> Preencha seus dados pessoais completos</li>
                                <li><strong>3.</strong> Descreva sua experiência profissional</li>
                                <li><strong>4.</strong> Liste suas habilidades técnicas</li>
                                <li><strong>5.</strong> Escolha sua área de interesse</li>
                            </ul>`
                        }
                        <p><strong>💼 Dica especial para o ABC:</strong> Empresas da região valorizam experiência em indústria, então destaque qualquer vivência nesse setor!</p>
                    </div>
                `;
                break;
                
            case 'como-usar-plataforma':
                tutorialContent = `
                    <div class="message-content">
                        <h4>🖥️ Tutorial: Como usar a plataforma SKYNET</h4>
                        <p>Deixe-me te mostrar todas as funcionalidades:</p>
                        <ul>
                            <li><strong>🏠 INÍCIO:</strong> Página principal com botões de cadastro</li>
                            <li><strong>👤 MEU PERFIL:</strong> Gerencie seus dados e veja compatibilidade</li>
                            <li><strong>💼 VAGAS:</strong> Veja oportunidades compatíveis com seu perfil</li>
                            <li><strong>🎓 TUTORIAIS:</strong> Aprenda comigo (onde estamos agora!)</li>
                        </ul>
                        ${userType === 'funcionario' ? 
                            `<p><strong>🎯 Para você ${userName}:</strong> Recomendo começar pela aba VAGAS para ver suas ${userProfile.area_interesse ? `oportunidades em ${userProfile.area_interesse}` : 'oportunidades compatíveis'}!</p>` :
                            `<p><strong>💡 Dica:</strong> Crie seu perfil primeiro para ter acesso a todas as funcionalidades!</p>`
                        }
                    </div>
                `;
                break;
                
            case 'dicas-entrevista':
                tutorialContent = `
                    <div class="message-content">
                        <h4>🤝 Tutorial: Dicas para entrevistas no ABC</h4>
                        ${userType === 'funcionario' && userProfile.area_interesse ? 
                            `<p>Com base no seu interesse em <strong>${userProfile.area_interesse}</strong>, aqui estão dicas específicas:</p>` :
                            `<p>Dicas gerais para entrevistas na região do ABC:</p>`
                        }
                        <ul>
                            <li><strong>🏭 Conheça a empresa:</strong> Pesquise sobre a história e produtos</li>
                            <li><strong>⚡ Pontualidade:</strong> Chegue 15 minutos antes</li>
                            <li><strong>👔 Vestimenta:</strong> Traje social ou casual elegante</li>
                            <li><strong>💬 Linguagem:</strong> Seja claro e objetivo</li>
                            <li><strong>❓ Perguntas:</strong> Prepare perguntas sobre a vaga</li>
                        </ul>
                        ${userProfile.experiencia ? 
                            `<p><strong>🌟 Destaque sua experiência:</strong> Fale sobre seus ${userProfile.experiencia} e como pode contribuir!</p>` :
                            `<p><strong>🌟 Sem experiência?</strong> Destaque sua vontade de aprender e crescer na empresa!</p>`
                        }
                    </div>
                `;
                break;
                
            case 'cursos-gratuitos':
                tutorialContent = `
                    <div class="message-content">
                        <h4>🎓 Tutorial: Cursos gratuitos SENAI</h4>
                        ${userType === 'funcionario' && userProfile.area_interesse ? 
                            `<p>Com base no seu interesse em <strong>${userProfile.area_interesse}</strong>, recomendo especialmente:</p>` :
                            `<p>Todos os cursos são 100% online e gratuitos:</p>`
                        }
                        <ul>
                            <li><strong>🔒 Segurança do Trabalho (14h)</strong> - Essencial para qualquer área</li>
                            <li><strong>⚙️ Lean Manufacturing (20h)</strong> - Otimização de processos</li>
                            <li><strong>📏 Metrologia (30h)</strong> - Medições e qualidade</li>
                            <li><strong>📦 Logística (40h)</strong> - Gestão de materiais</li>
                            <li><strong>💻 Tecnologia da Informação (80h)</strong> - Habilidades digitais</li>
                        </ul>
                        <p><strong>💡 Como acessar:</strong> Todos estão disponíveis no portal SENAI EAD. Basta se cadastrar gratuitamente!</p>
                        <p><strong>🏆 Certificado:</strong> Você recebe certificado reconhecido nacionalmente!</p>
                    </div>
                `;
                break;
                
            case 'encontrar-vagas':
                tutorialContent = `
                    <div class="message-content">
                        <h4>🔍 Tutorial: Como encontrar vagas compatíveis</h4>
                        ${userType === 'funcionario' ? 
                            `<p>Ótimo ${userName}! Você já tem perfil, então o sistema já calcula sua compatibilidade automaticamente:</p>
                            <ul>
                                <li><strong>🎯 Compatibilidade:</strong> Baseada em localização, experiência e área</li>
                                <li><strong>📍 Localização:</strong> Priorizamos ${userProfile.cidade || 'sua região'}</li>
                                <li><strong>💼 Área:</strong> Focamos em ${userProfile.area_interesse || 'suas preferências'}</li>
                                <li><strong>⭐ Ranking:</strong> Vagas ordenadas por % de compatibilidade</li>
                            </ul>` :
                            `<p>Para encontrar vagas compatíveis, você precisa:</p>
                            <ul>
                                <li><strong>1.</strong> Criar seu perfil completo</li>
                                <li><strong>2.</strong> Acessar a aba "VAGAS"</li>
                                <li><strong>3.</strong> Ver sua compatibilidade com cada vaga</li>
                                <li><strong>4.</strong> Candidatar-se às mais compatíveis</li>
                            </ul>`
                        }
                        <p><strong>🚀 Dica pro:</strong> Vagas com +80% de compatibilidade têm maior chance de sucesso!</p>
                    </div>
                `;
                break;
                
            case 'melhorar-perfil':
                tutorialContent = `
                    <div class="message-content">
                        <h4>📈 Tutorial: Como melhorar seu perfil</h4>
                        ${userType === 'funcionario' ? 
                            `<p>Analisando seu perfil ${userName}, aqui estão dicas personalizadas:</p>
                            <ul>
                                ${userProfile.habilidades ? 
                                    `<li><strong>✅ Habilidades:</strong> Você já tem! Continue atualizando</li>` :
                                    `<li><strong>🎯 Habilidades:</strong> Adicione suas competências técnicas</li>`
                                }
                                ${userProfile.cursos && userProfile.cursos.length > 0 ? 
                                    `<li><strong>✅ Cursos:</strong> Continue se capacitando!</li>` :
                                    `<li><strong>📚 Cursos:</strong> Faça cursos gratuitos do SENAI</li>`
                                }
                                <li><strong>🔄 Atualize regularmente:</strong> Mantenha dados sempre atuais</li>
                                <li><strong>📝 Seja específico:</strong> Detalhe sua experiência</li>
                            </ul>` :
                            `<p>Para ter um perfil atrativo para empresas:</p>
                            <ul>
                                <li><strong>📋 Complete 100%:</strong> Preencha todos os campos</li>
                                <li><strong>🎓 Adicione cursos:</strong> Mesmo que básicos</li>
                                <li><strong>💼 Detalhe experiência:</strong> Seja específico</li>
                                <li><strong>🏷️ Use palavras-chave:</strong> Termos que empresas buscam</li>
                            </ul>`
                        }
                        <p><strong>🌟 Meta:</strong> Perfis completos têm 3x mais visualizações!</p>
                    </div>
                `;
                break;
                
            default:
                tutorialContent = `
                    <div class="message-content">
                        <p>Tutorial não encontrado. Como posso te ajudar de outra forma?</p>
                    </div>
                `;
        }
        
        tutorialMessage.innerHTML = tutorialContent;
        chatBody.appendChild(tutorialMessage);
        
        // Adicionar botões de ação
        const actionMessage = document.createElement('div');
        actionMessage.className = 'chat-message bot-message';
        actionMessage.innerHTML = `
            <div class="message-content">
                <p><strong>🤔 Precisa de mais alguma coisa?</strong></p>
                <div class="quick-questions">
                    <button class="quick-btn" onclick="sendQuickMessage('Quero ver vagas compatíveis')">
                        Ver minhas vagas
                    </button>
                    <button class="quick-btn" onclick="sendQuickMessage('Recomendar cursos para mim')">
                        Cursos para mim
                    </button>
                    <button class="quick-btn" onclick="sendQuickMessage('Como melhorar meu perfil?')">
                        Melhorar perfil
                    </button>
                </div>
            </div>
        `;
        chatBody.appendChild(actionMessage);
        
        // Scroll para o final
        chatBody.scrollTop = chatBody.scrollHeight;
    }
    
    // Função para toggle FAQ
    function toggleFAQ(faqItem) {
        if (!faqItem) return;
        
        const answer = faqItem.querySelector('.faq-answer');
        const icon = faqItem.querySelector('.fa-chevron-down');
        
        if (answer && icon) {
            const isOpen = answer.style.display === 'block';
            
            // Fechar todas as outras FAQs
            document.querySelectorAll('.faq-answer').forEach(a => a.style.display = 'none');
            document.querySelectorAll('.fa-chevron-down').forEach(i => i.style.transform = 'rotate(0deg)');
            
            if (!isOpen) {
                answer.style.display = 'block';
                icon.style.transform = 'rotate(180deg)';
            }
        }
    }
    
    // Função para mostrar notificação de sucesso
    function showSuccessNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'success-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 4000);
    }
    
    // Função para mostrar notificação de erro
    function showErrorNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'error-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-exclamation-circle"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 4000);
    }
    
    // Função para mostrar notificação informativa
    function showInfoNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'info-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-info-circle"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 4000);
    }
    
    // Funções globais para ações de vagas
    window.applyToJob = function(empresa, cargo) {
        showSuccessNotification(`✅ Candidatura enviada para ${cargo} na ${empresa}! Em breve você receberá um retorno por e-mail.`);
        
        // Simular envio de dados
        console.log(`Candidatura enviada: ${cargo} - ${empresa}`);
    };
    
    window.saveJob = function(empresa, cargo) {
        showSuccessNotification(`💾 Vaga ${cargo} na ${empresa} salva nos seus favoritos! Acesse "Meu Perfil" para ver suas vagas salvas.`);
        
        // Salvar no localStorage
        const savedJobs = JSON.parse(localStorage.getItem('skynet-saved-jobs') || '[]');
        const newJob = {
            empresa,
            cargo,
            saved_at: new Date().toISOString()
        };
        
        // Verificar se já não está salva
        const alreadySaved = savedJobs.some(job => job.empresa === empresa && job.cargo === cargo);
        if (!alreadySaved) {
            savedJobs.push(newJob);
            localStorage.setItem('skynet-saved-jobs', JSON.stringify(savedJobs));
            console.log('Vaga salva:', newJob);
        }
    };
    
    // Função para entrar em contato com candidato
    window.contactCandidate = function(candidateName, candidateArea) {
        showSuccessNotification(`📧 Solicitação de contato enviada para ${candidateName}! O candidato receberá sua mensagem e poderá responder diretamente.`);
        
        console.log(`Contato solicitado: ${candidateName} - ${candidateArea}`);
    };
    
    // Função para salvar candidato
    window.saveCandidate = function(candidateName, candidateArea) {
        showSuccessNotification(`⭐ Candidato ${candidateName} salvo na sua lista de favoritos! Acesse "Meu Perfil" para gerenciar seus candidatos salvos.`);
        
        // Salvar no localStorage
        const savedCandidates = JSON.parse(localStorage.getItem('skynet-saved-candidates') || '[]');
        const newCandidate = {
            name: candidateName,
            area: candidateArea,
            saved_at: new Date().toISOString()
        };
        
        // Verificar se já não está salvo
        const alreadySaved = savedCandidates.some(candidate => candidate.name === candidateName);
        if (!alreadySaved) {
            savedCandidates.push(newCandidate);
            localStorage.setItem('skynet-saved-candidates', JSON.stringify(savedCandidates));
            console.log('Candidato salvo:', newCandidate);
        }
    };
    
    // Função para enviar mensagem no chat
    window.sendQuickMessage = function(message) {
        const chatInput = document.getElementById('chat-input');
        const chatBody = document.getElementById('chat-body');
        
        if (chatInput && chatBody) {
            // Mostrar mensagem do usuário
            const userMessage = document.createElement('div');
            userMessage.className = 'chat-message user-message';
            userMessage.innerHTML = `
                <div class="message-content">
                    <p>${message}</p>
                </div>
            `;
            chatBody.appendChild(userMessage);
            
            // Simular resposta da BIA
            setTimeout(() => {
                const botResponse = document.createElement('div');
                botResponse.className = 'chat-message bot-message';
                
                let responseText = '';
                if (message.includes('vagas')) {
                    responseText = 'Vou te mostrar as vagas mais compatíveis com seu perfil! Acesse a aba "VAGAS" para ver todas as oportunidades disponíveis.';
                } else if (message.includes('cursos')) {
                    responseText = 'Ótima escolha! Recomendo os cursos online gratuitos do SENAI. Todos são EAD e você recebe certificado reconhecido nacionalmente.';
                } else if (message.includes('perfil')) {
                    responseText = 'Vou te ajudar a melhorar seu perfil! Complete todas as informações, adicione suas habilidades e mantenha sempre atualizado.';
                } else {
                    responseText = 'Entendi sua pergunta! Como posso te ajudar especificamente? Posso orientar sobre vagas, cursos ou melhorias no seu perfil.';
                }
                
                botResponse.innerHTML = `
                    <div class="message-content">
                        <p>${responseText}</p>
                    </div>
                `;
                chatBody.appendChild(botResponse);
                chatBody.scrollTop = chatBody.scrollHeight;
            }, 1000);
            
            chatBody.scrollTop = chatBody.scrollHeight;
            chatInput.value = '';
        }
    };
    
    // Menu de acessibilidade
    const accessibilityBtn = document.querySelector('.accessibility-btn');
    const accessibilityMenu = document.getElementById('accessibility-menu');
    
    if (accessibilityBtn && accessibilityMenu) {
        accessibilityBtn.addEventListener('click', function() {
            accessibilityMenu.classList.toggle('active');
        });
        
        document.addEventListener('click', function(e) {
            if (!accessibilityBtn.contains(e.target) && !accessibilityMenu.contains(e.target)) {
                accessibilityMenu.classList.remove('active');
            }
        });
    }
    
    // Funcionalidades de acessibilidade
    initAccessibilityFeatures();
    
    function initAccessibilityFeatures() {
        // Alto contraste
        const highContrastToggle = document.getElementById('high-contrast-toggle');
        if (highContrastToggle) {
            highContrastToggle.addEventListener('click', function() {
                document.body.classList.toggle('high-contrast');
                localStorage.setItem('high-contrast', document.body.classList.contains('high-contrast'));
            });
            
            if (localStorage.getItem('high-contrast') === 'true') {
                document.body.classList.add('high-contrast');
            }
        }
        
        // Controle de fonte
        const fontSizeIncrease = document.getElementById('font-size-increase');
        const fontSizeDecrease = document.getElementById('font-size-decrease');
        
        if (fontSizeIncrease) {
            fontSizeIncrease.addEventListener('click', function() {
                let currentSize = parseInt(getComputedStyle(document.documentElement).fontSize);
                if (currentSize < 20) {
                    document.documentElement.style.fontSize = (currentSize + 2) + 'px';
                    localStorage.setItem('font-size', (currentSize + 2) + 'px');
                }
            });
        }
        
        if (fontSizeDecrease) {
            fontSizeDecrease.addEventListener('click', function() {
                let currentSize = parseInt(getComputedStyle(document.documentElement).fontSize);
                if (currentSize > 12) {
                    document.documentElement.style.fontSize = (currentSize - 2) + 'px';
                    localStorage.setItem('font-size', (currentSize - 2) + 'px');
                }
            });
        }
        
        const savedFontSize = localStorage.getItem('font-size');
        if (savedFontSize) {
            document.documentElement.style.fontSize = savedFontSize;
        }
        
        // VLibras
        const vlibrasToggle = document.getElementById('vlibras-toggle');
        if (vlibrasToggle) {
            vlibrasToggle.addEventListener('click', function() {
                const vlibrasWidget = document.querySelector('[vw]');
                if (vlibrasWidget) {
                    const isActive = vlibrasWidget.style.display !== 'none';
                    vlibrasWidget.style.display = isActive ? 'none' : 'block';
                    
                    this.style.background = isActive ? 'var(--light-gray)' : 'var(--primary-blue)';
                    this.style.color = isActive ? 'var(--black)' : 'var(--white)';
                }
            });
        }
        
        // Leitor de tela
        const screenReaderToggle = document.getElementById('screen-reader-toggle');
        let isReaderActive = false;
        
        if (screenReaderToggle) {
            screenReaderToggle.addEventListener('click', function() {
                isReaderActive = !isReaderActive;
                
                if (isReaderActive) {
                    this.style.background = 'var(--primary-blue)';
                    this.style.color = 'var(--white)';
                    
                    document.addEventListener('mouseover', readElementOnHover);
                    speak('Leitor de tela ativado. Passe o mouse sobre os elementos para ouvi-los.');
                } else {
                    this.style.background = 'var(--light-gray)';
                    this.style.color = 'var(--black)';
                    
                    document.removeEventListener('mouseover', readElementOnHover);
                    window.speechSynthesis.cancel();
                }
            });
        }
    }
    
    function readElementOnHover(e) {
        const element = e.target;
        let textToRead = '';
        
        if (element.tagName === 'BUTTON') {
            textToRead = element.textContent || element.getAttribute('aria-label') || 'Botão';
        } else if (element.tagName === 'A') {
            textToRead = element.textContent || 'Link';
        } else if (element.tagName === 'INPUT') {
            textToRead = element.placeholder || element.getAttribute('aria-label') || 'Campo de entrada';
        } else if (element.textContent && element.textContent.trim().length > 0 && element.textContent.trim().length < 100) {
            textToRead = element.textContent.trim();
        }
        
        if (textToRead) {
            speak(textToRead);
        }
    }
    
    function speak(text) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'pt-BR';
        utterance.rate = 0.8;
        window.speechSynthesis.speak(utterance);
    }
    
    // Inicializar LGPD
    function initLGPD() {
        const lgpdAccepted = localStorage.getItem('skynet-lgpd-accepted');
        
        if (!lgpdAccepted) {
            setTimeout(() => {
                const banner = document.getElementById('lgpd-banner');
                if (banner) {
                    banner.style.display = 'block';
                }
            }, 2000);
        }
    }
    
    // Funções LGPD globais
    window.acceptLGPD = function() {
        localStorage.setItem('skynet-lgpd-accepted', 'true');
        const banner = document.getElementById('lgpd-banner');
        if (banner) {
            banner.style.display = 'none';
        }
    };
    
    window.customizeLGPD = function() {
        showPrivacyPolicy();
    };
    
    window.showPrivacyPolicy = function() {
        const modal = document.getElementById('privacy-modal');
        if (modal) {
            modal.style.display = 'flex';
        }
    };
    
    window.closePrivacyModal = function() {
        const modal = document.getElementById('privacy-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    };
    
});
