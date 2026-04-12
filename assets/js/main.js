/**
 * Script Principal - Conversor Universal
 * Inicialização e coordenação de todos os componentes
 */

// Variáveis globais
let converter;
let history;

// Inicialização quando tudo estiver carregado
window.addEventListener('load', () => {
    initializeApp();
});

// Também tentar com DOMContentLoaded como fallback
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initializeApp();
    });
} else {
    // DOM já está carregado
    initializeApp();
}

/**
 * Inicializa a aplicação
 */
function initializeApp() {
    try {
        // Inicializar componentes
        converter = new UniversalConverter();
        history = new ConversionHistory();
        
        // Configurar funcionalidades adicionais
        setupKeyboardShortcuts();
        setupTheme();
        setupAnalytics();
        
        // Mostrar mensagem de boas-vindas
        showWelcomeMessage();
        
        console.log('Conversor Universal inicializado com sucesso!');
    } catch (error) {
        console.error('Erro ao inicializar aplicação:', error);
        showErrorMessage('Ocorreu um erro ao inicializar a aplicação. Por favor, recarregue a página.');
    }
}



/**
 * Configura atalhos de teclado
 */
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + L para limpar todos os inputs
        if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
            e.preventDefault();
            if (confirm('Limpar todos os campos de conversão?')) {
                converter.clearAllInputs();
                showNotification('Campos limpos!', 'success');
            }
        }
    });
}

/**
 * Configura tema (claro/escuro)
 */
function setupTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
    
    // Adicionar botão de tema (opcional)
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
    `;
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });
    
    // Adicionar ao header
    const nav = document.querySelector('.nav');
    if (nav) {
        nav.appendChild(themeToggle);
    }
}

/**
 * Aplica tema
 */
function applyTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    
    // Atualizar variáveis CSS para tema escuro
    if (theme === 'dark') {
        document.documentElement.style.setProperty('--background', '#0f172a');
        document.documentElement.style.setProperty('--card-bg', '#1e293b');
        document.documentElement.style.setProperty('--text-primary', '#f1f5f9');
        document.documentElement.style.setProperty('--text-secondary', '#94a3b8');
        document.documentElement.style.setProperty('--border-color', '#334155');
    } else {
        // Reset para tema claro (já está no CSS)
        document.documentElement.style.removeProperty('--background');
        document.documentElement.style.removeProperty('--card-bg');
        document.documentElement.style.removeProperty('--text-primary');
        document.documentElement.style.removeProperty('--text-secondary');
        document.documentElement.style.removeProperty('--border-color');
    }
}

/**
 * Configura analytics básico
 */
function setupAnalytics() {
    // Track page views
    trackEvent('page_view', {
        page: window.location.pathname,
        title: document.title,
        timestamp: new Date().toISOString()
    });
    
    // Track converter interactions
    const inputs = document.querySelectorAll('.converter-input');
    inputs.forEach(input => {
        input.addEventListener('change', () => {
            trackEvent('conversion', {
                category: input.dataset.category,
                unit: input.dataset.unit,
                value: input.value
            });
        });
    });
}

/**
 * Evento de analytics
 */
function trackEvent(eventName, data) {
    // Em produção, isso enviaria para Google Analytics ou outro serviço
    console.log('Analytics Event:', eventName, data);
    
    // Salvar localmente para análise
    const events = JSON.parse(localStorage.getItem('analyticsEvents') || '[]');
    events.push({
        event: eventName,
        data: data,
        timestamp: new Date().toISOString()
    });
    
    // Manter apenas os últimos 100 eventos
    if (events.length > 100) {
        events.splice(0, events.length - 100);
    }
    
    localStorage.setItem('analyticsEvents', JSON.stringify(events));
}

/**
 * Mostra mensagem de boas-vindas
 */
function showWelcomeMessage() {
    const lastVisit = localStorage.getItem('lastVisit');
    const now = new Date().toISOString();
    
    if (!lastVisit) {
        // Primeira visita
        setTimeout(() => {
            showNotification('Bem-vindo ao Conversor Universal! Use Ctrl+K para buscar rapidamente.', 'info');
        }, 1000);
    } else {
        // Visitante retornando
        const lastDate = new Date(lastVisit);
        const daysDiff = Math.floor((new Date() - lastDate) / (1000 * 60 * 60 * 24));
        
        if (daysDiff >= 1) {
            setTimeout(() => {
                showNotification(`Bem-vindo de volta! Faz ${daysDiff} dia(s) desde sua última visita.`, 'info');
            }, 1000);
        }
    }
    
    localStorage.setItem('lastVisit', now);
}

/**
 * Mostra mensagem de erro
 */
function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #ef4444;
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        z-index: 1000;
        font-weight: 500;
    `;
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.parentNode.removeChild(errorDiv);
        }
    }, 5000);
}

/**
 * Mostra notificação
 */
function showNotification(message, type = 'info') {
    if (window.history && window.history.showNotification) {
        window.history.showNotification(message, type);
    } else {
        // Fallback se o módulo de histórico não estiver carregado
        console.log(`[${type.toUpperCase()}] ${message}`);
    }
}

/**
 * Obtém nome exibido da categoria
 */
function getCategoryDisplayName(category) {
    const names = {
        length: 'Comprimento',
        weight: 'Peso',
        temperature: 'Temperatura',
        volume: 'Volume',
        currency: 'Moeda'
    };
    return names[category] || category;
}

/**
 * Compartilha conversão (funcionalidade social)
 */
function shareConversion(fromValue, fromUnit, toValue, toUnit, category) {
    const text = `Converti ${fromValue} ${fromUnit} para ${toValue} ${toUnit} usando o Conversor Universal!`;
    const url = window.location.href;
    
    if (navigator.share) {
        navigator.share({
            title: 'Conversão Universal',
            text: text,
            url: url
        });
    } else {
        // Fallback - copiar para área de transferência
        const fullText = `${text}\n${url}`;
        navigator.clipboard.writeText(fullText).then(() => {
            showNotification('Conversão copiada para a área de transferência!', 'success');
        });
    }
}

/**
 * Adiciona estilos CSS dinâmicos
 */
function addDynamicStyles() {
    const styles = `
        .theme-toggle {
            background: none;
            border: none;
            padding: 0.5rem;
            border-radius: 6px;
            cursor: pointer;
            color: var(--text-secondary);
            transition: all 0.3s ease;
        }
        
        .theme-toggle:hover {
            background: var(--background);
            color: var(--primary-color);
        }
        
                
        .highlighted {
            animation: highlight 2s ease;
        }
        
        @keyframes highlight {
            0% { background: transparent; }
            50% { background: var(--warning-color); opacity: 0.3; }
            100% { background: transparent; }
        }
        
        .error-message {
            animation: slideDown 0.3s ease;
        }
        
        @keyframes slideDown {
            from {
                transform: translateX(-50%) translateY(-100%);
                opacity: 0;
            }
            to {
                transform: translateX(-50%) translateY(0);
                opacity: 1;
            }
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
}

// Adicionar estilos dinâmicos
addDynamicStyles();

// Exportar funções para uso global
window.showNotification = showNotification;
window.shareConversion = shareConversion;
