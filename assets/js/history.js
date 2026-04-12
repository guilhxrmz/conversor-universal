/**
 * Sistema de Histórico de Conversões
 * Gerencia o histórico de conversões realizadas
 */
class ConversionHistory {
    constructor() {
        this.maxHistoryItems = 50;
        this.historyContainer = document.getElementById('historyContent');
        this.clearButton = document.getElementById('clearHistory');
        
        this.setupEventListeners();
        this.loadHistory();
    }
    
    /**
     * Configura event listeners
     */
    setupEventListeners() {
        // Botão de limpar histórico
        if (this.clearButton) {
            this.clearButton.addEventListener('click', () => this.clearHistory());
        }
        
        // Evento customizado para atualizar histórico
        window.addEventListener('historyUpdated', () => this.loadHistory());
    }
    
    /**
     * Carrega histórico do localStorage
     */
    loadHistory() {
        try {
            const historyData = localStorage.getItem('conversionHistory');
            this.history = historyData ? JSON.parse(historyData) : [];
            this.renderHistory();
        } catch (error) {
            console.error('Erro ao carregar histórico:', error);
            this.history = [];
            this.renderHistory();
        }
    }
    
    /**
     * Renderiza histórico na UI
     */
    renderHistory() {
        if (!this.historyContainer) return;
        
        if (this.history.length === 0) {
            this.historyContainer.innerHTML = `
                <p class="empty-history">Nenhuma conversão realizada ainda</p>
            `;
            return;
        }
        
        const historyHTML = this.history.slice(0, 10).map(item => this.createHistoryItem(item)).join('');
        this.historyContainer.innerHTML = historyHTML;
        
        // Adicionar event listeners aos itens
        this.attachHistoryItemListeners();
    }
    
    /**
     * Cria HTML para um item do histórico
     */
    createHistoryItem(item) {
        const fromUnit = converter.getUnitInfo(item.from.unit, item.category);
        const toUnit = converter.getUnitInfo(item.to.unit, item.category);
        const timeAgo = this.formatTimeAgo(new Date(item.timestamp));
        
        return `
            <div class="history-item" data-category="${item.category}" data-from="${item.from.unit}" data-to="${item.to.unit}">
                <div class="history-conversion">
                    <span class="history-value">${converter.formatNumber(item.from.value)} ${fromUnit.symbol}</span>
                    <span class="history-arrow">=</span>
                    <span class="history-value">${converter.formatNumber(item.to.value)} ${toUnit.symbol}</span>
                </div>
                <div class="history-meta">
                    <span class="history-time">${timeAgo}</span>
                    <button class="history-repeat" title="Repetir conversão">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M1 4v6h6"></path>
                            <path d="M23 20v-6h-6"></path>
                            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
                        </svg>
                    </button>
                </div>
            </div>
        `;
    }
    
    /**
     * Formata tempo relativo
     */
    formatTimeAgo(date) {
        const now = new Date();
        const diff = now - date;
        
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        if (seconds < 60) return 'Agora';
        if (minutes < 60) return `${minutes} min atrás`;
        if (hours < 24) return `${hours} h atrás`;
        if (days < 7) return `${days} dias atrás`;
        
        return date.toLocaleDateString('pt-BR');
    }
    
    /**
     * Anexa listeners aos itens do histórico
     */
    attachHistoryItemListeners() {
        const repeatButtons = this.historyContainer.querySelectorAll('.history-repeat');
        
        repeatButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const historyItem = e.target.closest('.history-item');
                const category = historyItem.dataset.category;
                const fromUnit = historyItem.dataset.from;
                const toUnit = historyItem.dataset.to;
                
                this.repeatConversion(category, fromUnit, toUnit);
            });
        });
        
        // Adicionar hover effect
        const historyItems = this.historyContainer.querySelectorAll('.history-item');
        historyItems.forEach(item => {
            item.addEventListener('click', () => {
                // Scroll para a categoria correspondente
                const categoryCard = document.querySelector(`[data-category="${category}"]`);
                if (categoryCard) {
                    categoryCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    categoryCard.classList.add('highlighted');
                    setTimeout(() => {
                        categoryCard.classList.remove('highlighted');
                    }, 2000);
                }
            });
        });
    }
    
    /**
     * Repete uma conversão do histórico
     */
    repeatConversion(category, fromUnit, toUnit) {
        const fromInput = document.querySelector(`[data-category="${category}"][data-unit="${fromUnit}"]`);
        const toInput = document.querySelector(`[data-category="${category}"][data-unit="${toUnit}"]`);
        
        if (fromInput && toInput) {
            // Focar no input de origem
            fromInput.focus();
            fromInput.select();
            
            // Adicionar efeito visual
            const categoryCard = document.querySelector(`[data-category="${category}"]`);
            categoryCard.classList.add('highlighted');
            setTimeout(() => {
                categoryCard.classList.remove('highlighted');
            }, 1000);
        }
    }
    
    /**
     * Limpa todo o histórico
     */
    clearHistory() {
        if (confirm('Tem certeza que deseja limpar todo o histórico de conversões?')) {
            try {
                localStorage.removeItem('conversionHistory');
                this.history = [];
                this.renderHistory();
                
                // Mostrar mensagem de sucesso
                this.showNotification('Histórico limpo com sucesso!', 'success');
            } catch (error) {
                console.error('Erro ao limpar histórico:', error);
                this.showNotification('Erro ao limpar histórico', 'error');
            }
        }
    }
    
    /**
     * Exporta histórico para CSV
     */
    exportToCSV() {
        if (this.history.length === 0) {
            this.showNotification('Nenhum histórico para exportar', 'warning');
            return;
        }
        
        const csv = this.generateCSV();
        this.downloadCSV(csv, 'conversion-history.csv');
        this.showNotification('Histórico exportado com sucesso!', 'success');
    }
    
    /**
     * Gera CSV do histórico
     */
    generateCSV() {
        const headers = ['Data', 'Categoria', 'De', 'Para', 'Valor De', 'Valor Para'];
        const rows = this.history.map(item => {
            const fromUnit = converter.getUnitInfo(item.from.unit, item.category);
            const toUnit = converter.getUnitInfo(item.to.unit, item.category);
            const date = new Date(item.timestamp).toLocaleString('pt-BR');
            
            return [
                date,
                this.getCategoryName(item.category),
                fromUnit.name,
                toUnit.name,
                item.from.value,
                item.to.value
            ];
        });
        
        return [headers, ...rows].map(row => row.join(',')).join('\n');
    }
    
    /**
     * Obtém nome da categoria
     */
    getCategoryName(category) {
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
     * Faz download do arquivo CSV
     */
    downloadCSV(csv, filename) {
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    /**
     * Mostra notificação
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Estilos
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '500',
            zIndex: '1000',
            opacity: '0',
            transform: 'translateX(100%)',
            transition: 'all 0.3s ease'
        });
        
        // Cor por tipo
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#2563eb'
        };
        notification.style.backgroundColor = colors[type] || colors.info;
        
        document.body.appendChild(notification);
        
        // Animar entrada
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remover após 3 segundos
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    /**
     * Obtém estatísticas do histórico
     */
    getStats() {
        const stats = {
            totalConversions: this.history.length,
            categories: {},
            mostUsed: {},
            recentActivity: this.history.slice(0, 5)
        };
        
        // Contar por categoria
        this.history.forEach(item => {
            if (!stats.categories[item.category]) {
                stats.categories[item.category] = 0;
            }
            stats.categories[item.category]++;
        });
        
        // Encontrar mais usados
        Object.entries(stats.categories).forEach(([category, count]) => {
            if (!stats.mostUsed.category || count > stats.mostUsed.count) {
                stats.mostUsed = { category, count };
            }
        });
        
        return stats;
    }
    
    /**
     * Filtra histórico por categoria
     */
    filterByCategory(category) {
        return this.history.filter(item => item.category === category);
    }
    
    /**
     * Busca no histórico
     */
    search(query) {
        query = query.toLowerCase();
        return this.history.filter(item => {
            const fromUnit = converter.getUnitInfo(item.from.unit, item.category);
            const toUnit = converter.getUnitInfo(item.to.unit, item.category);
            
            return fromUnit.name.toLowerCase().includes(query) ||
                   toUnit.name.toLowerCase().includes(query) ||
                   item.category.toLowerCase().includes(query);
        });
    }
}

// Exportar classe para uso global
window.ConversionHistory = ConversionHistory;
