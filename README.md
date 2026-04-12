# Conversor Universal

Uma ferramenta online gratuita e rápida para converter unidades de medida, peso, temperatura, volume e moedas. 100% frontend, funciona offline e é otimizado para SEO.

## Funcionalidades

### Conversões Disponíveis
- **Comprimento**: Metro, Pé, Polegada, Milha, Quilômetro, Centímetro
- **Peso/Massa**: Quilograma, Libra, Grama, Onça, Tonelada
- **Temperatura**: Celsius, Fahrenheit, Kelvin
- **Volume**: Litro, Mililitro, Galão, Onça Fluida
- **Moeda**: Real, Dólar, Euro (taxas atualizadas)

### Características
- Conversão em tempo real sem botões
- Histórico de conversões (localStorage)
- Design responsivo (mobile-first)
- Busca integrada de conversões
- Modo claro/escuro
- Funciona offline
- SEO otimizado
- Páginas específicas para cada conversão

## Tecnologias

- **Frontend**: HTML5, CSS3, JavaScript Vanilla
- **Design**: CSS Grid, Flexbox, CSS Variables
- **Armazenamento**: localStorage para histórico
- **Deploy**: GitHub Pages
- **Monetização**: Google AdSense

## Estrutura do Projeto

```
conversor-universal/
  index.html                    # Página principal
  conversoes/
    comprimento.html           # Página SEO: comprimento
    peso.html                  # Página SEO: peso
    temperatura.html           # Página SEO: temperatura
    volume.html                # Página SEO: volume
    moeda.html                 # Página SEO: moeda
  assets/
    css/
      style.css                # Estilos principais
    js/
      converter.js             # Sistema de conversão
      history.js               # Histórico
      main.js                  # Script principal
    icons/
      favicon.svg              # Favicon
  README.md                    # Este arquivo
```

## Como Usar

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/usuario/conversor-universal.git
   cd conversor-universal
   ```

2. **Abra o arquivo**:
   - Abra `index.html` no navegador
   - Ou use um servidor local: `python -m http.server 8000`

3. **Use o conversor**:
   - Digite o valor em qualquer campo
   - As outras unidades são atualizadas automaticamente
   - Use Ctrl+K para buscar rapidamente

## Deploy

### GitHub Pages
1. Crie um repositório no GitHub
2. Faça upload dos arquivos
3. Vá em Settings > Pages
4. Selecione branch `main` e pasta `/root`
5. Pronto! Seu site estará disponível em `username.github.io/conversor-universal`

### Netlify
1. Conecte seu repositório GitHub
2. Configure build command: `echo "No build needed"`
3. Publish directory: `./`
4. Deploy automático ativado

## Monetização

### Google AdSense
1. Crie conta no AdSense
2. Adicione seu publisher ID nos arquivos HTML
3. Configure os espaços de anúncios:
   - Sidebar: 300x250
   - Header: 728x90
   - Entre seções: 300x250

### Estratégia de Monetização
- **Display ads**: Em positions estratégicos
- **In-feed ads**: Entre conversões
- **Native ads**: Integrados ao conteúdo
- **Matched content**: Conteúdo relacionado

## SEO

### Páginas Específicas
Cada tipo de conversão tem sua própria página otimizada:
- `/conversoes/comprimento.html` - Conversor de comprimento
- `/conversoes/peso.html` - Conversor de peso
- `/conversoes/temperatura.html` - Conversor de temperatura
- `/conversoes/volume.html` - Conversor de volume
- `/conversoes/moeda.html` - Conversor de moeda

### Keywords Alvo
- "conversor de medidas"
- "conversor online"
- "metro para pé"
- "conversor temperatura"
- "conversor moeda"

## Marketing

### TikTok Strategy
- **Conteúdo**: Demonstrações rápidas de 15 segundos
- **Hooks**: "Converta X para Y em segundos"
- **CTA**: "Link na bio para usar grátis"
- **Hashtags**: #conversor #matematica #dicas #utilitario

### Exemplos de Vídeos
1. "Converta 1 metro para pés sem calculadora"
2. "Conversor que funciona offline"
3. "Nunca mais erre uma conversão"

## Performance

### Otimizações
- CSS minificado
- JavaScript otimizado
- Lazy loading de imagens
- Cache estratégico
- Service Worker (opcional)

### Métricas
- **Lighthouse**: 90+ performance
- **Core Web Vitals**: Good
- **Mobile**: 100% responsivo

## Futuras Melhorias

### Premium Features
- Conversões em lote (CSV)
- API para desenvolvedores
- Histórico ilimitado
- Sem anúncios
- Domínio personalizado

### Novas Conversões
- Área (m², ft²)
- Velocidade (km/h, mph)
- Pressão (Pa, atm)
- Energia (Joules, calorias)
- Tempo (segundos, minutos, horas)

## Contribuição

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Faça commit: `git commit -m 'Adiciona nova funcionalidade'`
4. Push: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

## Licença

MIT License - use como quiser!

## Contato

- GitHub: @usuario
- Email: seu@email.com
- Site: seusite.com

---

## Estatísticas Projetadas

### Tráfego
- **Mês 1**: 1.000 visitas/dia
- **Mês 3**: 3.000 visitas/dia
- **Mês 6**: 5.000 visitas/dia
- **Ano 1**: 10.000 visitas/dia

### Receita (AdSense)
- **Mês 1**: R$150-300/mês
- **Mês 3**: R$400-700/mês
- **Mês 6**: R$800-1500/mês
- **Ano 1**: R$1500-3000/mês

Este projeto é uma excelente forma de aprender desenvolvimento web, SEO e monetização online enquanto cria uma ferramenta útil para milhares de pessoas.
