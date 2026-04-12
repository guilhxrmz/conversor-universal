/**
 * Sistema de Conversão Universal
 * Classe principal para gerenciar todas as conversões
 */
class UniversalConverter {
    constructor() {
        this.categories = {
            length: {
                meter: { factor: 1, symbol: 'm', name: 'Metro' },
                foot: { factor: 3.28084, symbol: 'ft', name: 'Pé' },
                inch: { factor: 39.3701, symbol: 'in', name: 'Polegada' },
                mile: { factor: 0.000621371, symbol: 'mi', name: 'Milha' },
                kilometer: { factor: 0.001, symbol: 'km', name: 'Quilômetro' },
                centimeter: { factor: 100, symbol: 'cm', name: 'Centímetro' },
                yard: { factor: 1.09361, symbol: 'yd', name: 'Jarda' }
            },
            weight: {
                kilogram: { factor: 1, symbol: 'kg', name: 'Quilograma' },
                pound: { factor: 2.20462, symbol: 'lb', name: 'Libra' },
                gram: { factor: 1000, symbol: 'g', name: 'Grama' },
                ounce: { factor: 35.274, symbol: 'oz', name: 'Onça' },
                ton: { factor: 0.001, symbol: 't', name: 'Tonelada' },
                milligram: { factor: 1000000, symbol: 'mg', name: 'Miligrama' }
            },
            temperature: {
                celsius: { symbol: '°C', name: 'Celsius' },
                fahrenheit: { symbol: '°F', name: 'Fahrenheit' },
                kelvin: { symbol: 'K', name: 'Kelvin' }
            },
            volume: {
                liter: { factor: 1, symbol: 'L', name: 'Litro' },
                milliliter: { factor: 1000, symbol: 'mL', name: 'Mililitro' },
                gallon: { factor: 0.264172, symbol: 'gal', name: 'Galão' },
                fluidOunce: { factor: 33.814, symbol: 'fl oz', name: 'Onça Fluida' },
                cup: { factor: 4.22675, symbol: 'cup', name: 'Copo' },
                pint: { factor: 2.11338, symbol: 'pt', name: 'Pinta' }
            },
            currency: {
                brl: { symbol: 'R$', name: 'Real Brasileiro' },
                usd: { symbol: '$', name: 'Dólar Americano' },
                eur: { symbol: '¢', name: 'Euro' }
            }
        };
        
        // Taxas de câmbio (serão atualizadas via API)
        this.exchangeRates = {
            brl: 1,
            usd: 0.1923,
            eur: 0.1765
        };
        
        this.lastUpdate = new Date();
        this.setupEventListeners();
        this.loadExchangeRates();
    }
    
    /**
     * Converte um valor entre unidades
     */
    convert(value, fromUnit, toUnit, category) {
        if (category === 'temperature') {
            return this.convertTemperature(value, fromUnit, toUnit);
        } else if (category === 'currency') {
            return this.convertCurrency(value, fromUnit, toUnit);
        } else {
            return this.convertByFactor(value, fromUnit, toUnit, category);
        }
    }
    
    /**
     * Conversão por fator (comprimento, peso, volume)
     */
    convertByFactor(value, fromUnit, toUnit, category) {
        // Verificar se as unidades existem
        if (!this.categories[category] || !this.categories[category][fromUnit] || !this.categories[category][toUnit]) {
            console.error('Unidade não encontrada:', { category, fromUnit, toUnit });
            return 0;
        }
        
        const fromFactor = this.categories[category][fromUnit].factor;
        const toFactor = this.categories[category][toUnit].factor;
        
        // Converte para a unidade base e depois para a unidade desejada
        const baseValue = value / fromFactor;
        return baseValue * toFactor;
    }
    
    /**
     * Conversão de temperatura (fórmulas especiais)
     */
    convertTemperature(value, fromUnit, toUnit) {
        // Primeiro converte para Celsius
        let celsius;
        switch (fromUnit) {
            case 'celsius':
                celsius = value;
                break;
            case 'fahrenheit':
                celsius = (value - 32) * 5 / 9;
                break;
            case 'kelvin':
                celsius = value - 273.15;
                break;
        }
        
        // Depois converte de Celsius para a unidade desejada
        switch (toUnit) {
            case 'celsius':
                return celsius;
            case 'fahrenheit':
                return (celsius * 9 / 5) + 32;
            case 'kelvin':
                return celsius + 273.15;
        }
    }
    
    /**
     * Conversão de moeda
     */
    convertCurrency(value, fromUnit, toUnit) {
        const fromRate = this.exchangeRates[fromUnit];
        const toRate = this.exchangeRates[toUnit];
        
        // Converte para USD (base) e depois para a moeda desejada
        const usdValue = value / fromRate;
        return usdValue * toRate;
    }
    
    /**
     * Formata número para exibição
     */
    formatNumber(value, precision = 4) {
        if (isNaN(value) || !isFinite(value)) {
            return '0';
        }
        
        // Para valores muito grandes ou muito pequenos
        if (Math.abs(value) >= 1000000 || Math.abs(value) < 0.001) {
            return value.toExponential(precision);
        }
        
        // Para valores normais
        return parseFloat(value.toFixed(precision)).toString();
    }
    
    /**
     * Obtém informações de uma unidade
     */
    getUnitInfo(unit, category) {
        return this.categories[category][unit];
    }
    
    /**
     * Obtém todas as unidades de uma categoria
     */
    getUnits(category) {
        return Object.keys(this.categories[category]);
    }
    
    /**
     * Configura os event listeners
     */
    setupEventListeners() {
        const inputs = document.querySelectorAll('.converter-input');
        console.log('Inputs encontrados:', inputs.length);
        
        inputs.forEach(input => {
            console.log('Configurando input:', input.id, input.dataset.unit, input.dataset.category);
            
            // Teste simples
            input.addEventListener('input', (e) => {
                console.log('Input evento disparado para:', input.id, 'valor:', e.target.value);
                this.handleInput(e);
            });
            
            input.addEventListener('focus', (e) => this.handleFocus(e));
            input.addEventListener('blur', (e) => this.handleBlur(e));
        });
        
        // Prevenir entrada inválida
        inputs.forEach(input => {
            input.addEventListener('keydown', (e) => {
                // Permitir: backspace, delete, tab, escape, enter
                if ([8, 9, 27, 13].includes(e.keyCode)) {
                    return;
                }
                
                // Permitir: números, ponto, sinal de menos
                if ([46, 189, 109].includes(e.keyCode) || 
                    (e.keyCode >= 48 && e.keyCode <= 57) || 
                    (e.keyCode >= 96 && e.keyCode <= 105)) {
                    return;
                }
                
                e.preventDefault();
            });
        });
    }
    
    /**
     * Manipula entrada de dados
     */
    handleInput(e) {
        const input = e.target;
        const value = parseFloat(input.value) || 0;
        const fromUnit = input.dataset.unit;
        const category = input.dataset.category;
        
        console.log('handleInput chamado:', { value, fromUnit, category });
        
        // Atualizar todas as outras unidades da mesma categoria
        this.updateCategoryConversions(value, fromUnit, category);
        
        // Adicionar ao histórico
        if (value !== 0) {
            this.addToHistory(value, fromUnit, category);
        }
    }
    
    /**
     * Atualiza todas as conversões de uma categoria
     */
    updateCategoryConversions(value, fromUnit, category) {
        const units = this.getUnits(category);
        const inputs = document.querySelectorAll(`[data-category="${category}"]`);
        
        console.log('updateCategoryConversions:', { value, fromUnit, category, inputsCount: inputs.length });
        
        inputs.forEach(input => {
            const toUnit = input.dataset.unit;
            console.log('Processando input:', input.id, 'toUnit:', toUnit);
            
            if (toUnit !== fromUnit) {
                const convertedValue = this.convert(value, fromUnit, toUnit, category);
                console.log('Convertido:', convertedValue);
                input.value = this.formatNumber(convertedValue);
            }
        });
    }
    
    /**
     * Manipula foco no input
     */
    handleFocus(e) {
        const input = e.target;
        input.select();
    }
    
    /**
     * Manipula perda de foco
     */
    handleBlur(e) {
        const input = e.target;
        if (input.value === '') {
            input.value = '0';
        }
    }
    
    /**
     * Carrega taxas de câmbio via API real
     */
    async loadExchangeRates() {
        try {
            // Verificar se temos cache recente (24 horas)
            const cachedRates = localStorage.getItem('exchangeRates');
            const cachedTime = localStorage.getItem('exchangeRatesTime');
            
            if (cachedRates && cachedTime) {
                const timeDiff = Date.now() - parseInt(cachedTime);
                const hoursDiff = timeDiff / (1000 * 60 * 60);
                
                if (hoursDiff < 24) {
                    // Usar cache se tiver menos de 24 horas
                    this.exchangeRates = JSON.parse(cachedRates);
                    this.updateCurrencyRate();
                    console.log('Usando taxas de câmbio em cache');
                    return;
                }
            }
            
            // Buscar taxas atualizadas da API
            const response = await fetch('https://v6.exchangerate-api.com/v6/latest/USD');
            const data = await response.json();
            
            if (data.conversion_rates) {
                // Converter para base Real (BRL)
                const brlRate = data.conversion_rates.BRL;
                this.exchangeRates = {
                    brl: 1,
                    usd: brlRate,      // 1 BRL = brlRate USD
                    eur: brlRate / data.conversion_rates.EUR  // 1 BRL = (BRL/USD) / (EUR/USD) EUR
                };
                
                // Salvar no cache
                localStorage.setItem('exchangeRates', JSON.stringify(this.exchangeRates));
                localStorage.setItem('exchangeRatesTime', Date.now().toString());
                
                this.updateCurrencyRate();
                console.log('Taxas de câmbio atualizadas via API:', this.exchangeRates);
            } else {
                throw new Error('Formato de resposta inválido');
            }
            
        } catch (error) {
            console.error('Erro ao carregar taxas de câmbio:', error);
            
            // Fallback para taxas fixas se API falhar
            this.exchangeRates = {
                brl: 1,
                usd: 0.1923,
                eur: 0.1765
            };
            
            this.updateCurrencyRate();
            console.log('Usando taxas de câmbio fallback');
        }
    }
    
    /**
     * Atualiza exibição da taxa de câmbio
     */
    updateCurrencyRate() {
        const rateElement = document.getElementById('currency-rate');
        if (rateElement) {
            const brlToUsd = this.exchangeRates.usd;
            rateElement.textContent = `Taxa: $1 = R$${this.formatNumber(1/brlToUsd, 2)}`;
        }
    }
    
    /**
     * Adiciona conversão ao histórico
     */
    addToHistory(value, fromUnit, category) {
        const units = this.getUnits(category);
        const conversions = [];
        
        // Gerar conversões para todas as unidades
        units.forEach(toUnit => {
            if (toUnit !== fromUnit) {
                const convertedValue = this.convert(value, fromUnit, toUnit, category);
                conversions.push({
                    from: { value, unit: fromUnit },
                    to: { value: convertedValue, unit: toUnit },
                    category,
                    timestamp: new Date()
                });
            }
        });
        
        // Salvar no localStorage
        this.saveHistory(conversions);
    }
    
    /**
     * Salva histórico no localStorage
     */
    saveHistory(conversions) {
        try {
            let history = JSON.parse(localStorage.getItem('conversionHistory') || '[]');
            
            // Adicionar novas conversões
            conversions.forEach(conv => {
                history.unshift(conv);
            });
            
            // Manter apenas as últimas 50 conversões
            history = history.slice(0, 50);
            
            localStorage.setItem('conversionHistory', JSON.stringify(history));
            
            // Disparar evento para atualizar UI
            window.dispatchEvent(new CustomEvent('historyUpdated'));
        } catch (error) {
            console.error('Erro ao salvar histórico:', error);
        }
    }
    
    /**
     * Busca conversões por texto
     */
    searchConversions(query) {
        const results = [];
        query = query.toLowerCase();
        
        Object.entries(this.categories).forEach(([category, units]) => {
            Object.entries(units).forEach(([unit, info]) => {
                if (info.name.toLowerCase().includes(query) || 
                    info.symbol.toLowerCase().includes(query)) {
                    results.push({
                        category,
                        unit,
                        info,
                        url: `#${category}-${unit}`
                    });
                }
            });
        });
        
        return results;
    }
    
    /**
     * Obtém conversões populares
     */
    getPopularConversions() {
        return [
            { category: 'length', from: 'meter', to: 'foot', description: 'Metro para Pé' },
            { category: 'weight', from: 'kilogram', to: 'pound', description: 'Quilograma para Libra' },
            { category: 'temperature', from: 'celsius', to: 'fahrenheit', description: 'Celsius para Fahrenheit' },
            { category: 'volume', from: 'liter', to: 'milliliter', description: 'Litro para Mililitro' },
            { category: 'currency', from: 'brl', to: 'usd', description: 'Real para Dólar' }
        ];
    }
    
    /**
     * Valida entrada numérica
     */
    validateInput(value) {
        const num = parseFloat(value);
        return !isNaN(num) && isFinite(num);
    }
    
    /**
     * Limpa todos os inputs
     */
    clearAllInputs() {
        const inputs = document.querySelectorAll('.converter-input');
        inputs.forEach(input => {
            input.value = '0';
        });
    }
    
    /**
     * Exporta dados (para funcionalidade premium)
     */
    exportData() {
        const data = {
            categories: this.categories,
            exchangeRates: this.exchangeRates,
            lastUpdate: this.lastUpdate,
            history: JSON.parse(localStorage.getItem('conversionHistory') || '[]')
        };
        
        return data;
    }
}

// Exportar classe para uso global
window.UniversalConverter = UniversalConverter;
