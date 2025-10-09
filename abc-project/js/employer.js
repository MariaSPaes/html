// JavaScript para funcionalidades do empresário
document.addEventListener('DOMContentLoaded', function() {
    
    // Continuar cadastro de vaga
    const continueVagaBtn = document.querySelector('[data-action="continue-vaga"]');
    if (continueVagaBtn) {
        continueVagaBtn.addEventListener('click', function() {
            // Coletar dados da vaga
            const vagaData = {
                nomeEmpresa: document.getElementById('nome-empresa')?.value || '',
                cnpj: document.getElementById('cnpj')?.value || '',
                cargoVaga: document.getElementById('cargo-vaga')?.value || '',
                areaAtuacao: document.getElementById('area-atuacao')?.value || '',
                localTrabalho: document.getElementById('local-trabalho')?.value || '',
                cursosNecessarios: document.getElementById('cursos-necessarios')?.value || '',
                habilidadesNecessarias: document.getElementById('habilidades-necessarias')?.value || ''
            };
            
            // Validar campos obrigatórios
            const requiredFields = ['nomeEmpresa', 'cnpj', 'cargoVaga', 'areaAtuacao', 'localTrabalho'];
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!vagaData[field].trim()) {
                    isValid = false;
                }
            });
            
            if (!isValid) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }
            
            // Salvar dados da vaga
            localStorage.setItem('skynet-vaga-data', JSON.stringify(vagaData));
            
            // Navegar para página de vagas do empresário
            const pages = document.querySelectorAll('.page');
            pages.forEach(page => page.classList.remove('active'));
            
            const vagasEmpresarioPage = document.getElementById('vagas-empresario');
            if (vagasEmpresarioPage) {
                vagasEmpresarioPage.classList.add('active');
            }
            
            // Feedback visual
            this.innerHTML = '<i class="fas fa-check"></i> Vaga Cadastrada!';
            this.style.background = 'var(--green)';
            
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-arrow-right"></i> Continuar';
                this.style.background = '';
            }, 2000);
        });
    }
    
    // Máscara para CNPJ
    const cnpjInput = document.getElementById('cnpj');
    if (cnpjInput) {
        cnpjInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length <= 14) {
                value = value.replace(/^(\d{2})(\d)/, '$1.$2');
                value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
                value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
                value = value.replace(/(\d{4})(\d)/, '$1-$2');
            }
            
            e.target.value = value;
        });
    }
    
    // Visualizar perfil de candidato interessado
    const viewProfileBtns = document.querySelectorAll('.btn-view-profile');
    viewProfileBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Simular visualização de perfil
            const perfilCard = this.closest('.perfil-card');
            const nomeCandidata = perfilCard.querySelector('.perfil-name').textContent;
            
            alert(`Visualizando perfil de ${nomeCandidata}\n\nFuncionalidade em desenvolvimento...`);
        });
    });
    
    // Carregar dados salvos da vaga (se existirem)
    const savedVagaData = localStorage.getItem('skynet-vaga-data');
    if (savedVagaData) {
        const vagaData = JSON.parse(savedVagaData);
        
        // Preencher campos com dados salvos
        Object.keys(vagaData).forEach(key => {
            const element = document.getElementById(key.replace(/([A-Z])/g, '-$1').toLowerCase());
            if (element) {
                element.value = vagaData[key];
            }
        });
    }
});
