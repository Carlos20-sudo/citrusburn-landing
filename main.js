// ============================================
// FUNCIONALIDADES PRINCIPAIS
// ============================================

// Scroll suave para a seção de pedidos
function scrollToOrder() {
    const orderSection = document.getElementById('order-section');
    if (orderSection) {
        orderSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Alternar FAQ
function toggleFAQ(button) {
    const faqItem = button.parentElement;
    const isActive = faqItem.classList.contains('active');
    
    // Fechar todos os FAQs abertos
    document.querySelectorAll('.faq-item.active').forEach(item => {
        item.classList.remove('active');
    });
    
    // Abrir o FAQ clicado se não estava ativo
    if (!isActive) {
        faqItem.classList.add('active');
    }
}

// Manipular compra (redirecionar para o afiliado)
function handlePurchase(plan) {
    // Aqui você inserirá o link de afiliado do CitrusBurn
    // Este é um placeholder que será substituído pelo link real
    const affiliateLinks = {
        '1-month': 'https://citrusburn.com/affiliates/link-here',
        '3-month': 'https://citrusburn.com/affiliates/link-here',
        '6-month': 'https://citrusburn.com/affiliates/link-here'
    };
    
    const link = affiliateLinks[plan] || 'https://citrusburn.com/affiliates/';
    
    // Rastrear evento de clique
    trackEvent('purchase_click', {
        plan: plan,
        timestamp: new Date().toISOString()
    });
    
    // Redirecionar após um pequeno delay
    setTimeout(() => {
        window.open(link, '_blank');
    }, 300);
}

// ============================================
// RASTREAMENTO E ANALYTICS
// ============================================

// Função para rastrear eventos (pode ser integrada com Google Analytics, Facebook Pixel, etc.)
function trackEvent(eventName, eventData = {}) {
    console.log(`Event tracked: ${eventName}`, eventData);
    
    // Integração com Google Analytics (se disponível)
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, eventData);
    }
    
    // Integração com Facebook Pixel (se disponível)
    if (typeof fbq !== 'undefined') {
        fbq('track', eventName, eventData);
    }
    
    // Enviar para servidor local (opcional)
    sendAnalyticsToServer(eventName, eventData);
}

// Enviar dados de analytics para o servidor
function sendAnalyticsToServer(eventName, eventData) {
    const payload = {
        event: eventName,
        data: eventData,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
    };
    
    // Usar fetch para enviar dados sem bloquear a página
    navigator.sendBeacon('/analytics', JSON.stringify(payload));
}

// ============================================
// RASTREAMENTO DE SCROLL
// ============================================

let scrollTracked = {
    problem: false,
    solution: false,
    pricing: false,
    testimonials: false
};

function trackScrollEvents() {
    const sections = {
        problem: document.querySelector('.problem-section'),
        solution: document.querySelector('.solution-section'),
        testimonials: document.querySelector('.testimonials-section'),
        pricing: document.querySelector('.pricing-section')
    };
    
    window.addEventListener('scroll', () => {
        Object.keys(sections).forEach(sectionKey => {
            const section = sections[sectionKey];
            if (section && !scrollTracked[sectionKey]) {
                const rect = section.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    trackEvent(`section_viewed_${sectionKey}`);
                    scrollTracked[sectionKey] = true;
                }
            }
        });
    });
}

// ============================================
// RASTREAMENTO DE TEMPO NA PÁGINA
// ============================================

let pageStartTime = Date.now();

function trackTimeOnPage() {
    window.addEventListener('beforeunload', () => {
        const timeOnPage = Math.round((Date.now() - pageStartTime) / 1000);
        trackEvent('page_exit', {
            timeOnPage: timeOnPage,
            url: window.location.href
        });
    });
}

// ============================================
// RASTREAMENTO DE CLIQUES EM BOTÕES
// ============================================

function trackButtonClicks() {
    document.querySelectorAll('.cta-button, .buy-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const buttonText = button.textContent.trim();
            trackEvent('button_clicked', {
                buttonText: buttonText,
                buttonClass: button.className
            });
        });
    });
}

// ============================================
// RASTREAMENTO DE FORMULÁRIOS
// ============================================

function trackFormInteractions() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            trackEvent('form_submitted', {
                formId: form.id || 'unknown'
            });
        });
    });
}

// ============================================
// DETECÇÃO DE DISPOSITIVO
// ============================================

function getDeviceType() {
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (/mobile|android|iphone|ipad|phone/.test(userAgent)) {
        return 'mobile';
    } else if (/tablet|ipad/.test(userAgent)) {
        return 'tablet';
    } else {
        return 'desktop';
    }
}

// ============================================
// RASTREAMENTO DE FONTE DE TRÁFEGO
// ============================================

function trackTrafficSource() {
    const urlParams = new URLSearchParams(window.location.search);
    const source = urlParams.get('utm_source') || 'direct';
    const medium = urlParams.get('utm_medium') || 'organic';
    const campaign = urlParams.get('utm_campaign') || 'none';
    
    trackEvent('page_load', {
        source: source,
        medium: medium,
        campaign: campaign,
        device: getDeviceType(),
        timestamp: new Date().toISOString()
    });
    
    // Armazenar no sessionStorage para referência posterior
    sessionStorage.setItem('trafficSource', JSON.stringify({
        source,
        medium,
        campaign
    }));
}

// ============================================
// OTIMIZAÇÕES DE PERFORMANCE
// ============================================

// Lazy loading para imagens
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// ============================================
// INICIALIZAÇÃO
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Landing page loaded');
    
    // Inicializar rastreamentos
    trackTrafficSource();
    trackScrollEvents();
    trackTimeOnPage();
    trackButtonClicks();
    trackFormInteractions();
    initLazyLoading();
    
    // Log de dispositivo
    console.log('Device type:', getDeviceType());
    
    // Adicionar classe ao body baseado no dispositivo
    document.body.classList.add(`device-${getDeviceType()}`);
});

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

// Função para obter parâmetro da URL
function getURLParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Função para validar email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Função para formatar moeda
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

// ============================================
// INTEGRAÇÃO COM GOOGLE ANALYTICS (PLACEHOLDER)
// ============================================

// Descomente e configure com seu ID do Google Analytics
/*
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'GA_MEASUREMENT_ID');
*/

// ============================================
// INTEGRAÇÃO COM FACEBOOK PIXEL (PLACEHOLDER)
// ============================================

// Descomente e configure com seu Pixel ID do Facebook
/*
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', 'PIXEL_ID');
fbq('track', 'PageView');
*/
