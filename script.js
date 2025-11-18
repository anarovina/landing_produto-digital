/* ========================================
   ANA ROVINA STUDIO - JAVASCRIPT
   Interações e funcionalidades da landing page
   ======================================== */

// === CONFIGURAÇÃO GLOBAL === //
const CONFIG = {
    API_KEY: 'AIzaSyCNvVjC97Ty97iTmJGfbLeixWaXtz8LkQM',
    EMAIL_RECIPIENT: 'contato@arovinastudio.com.br',
    GOOGLE_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbyUGKOOYtXD8rc2ff4a03unU3jlFq1lVm4u4SfeL2n9DGnOB9fqRNKuUgHskNnbZuar/exec'
};

// === NAVIGATION SCROLL EFFECT === //
function initNavigationScroll() {
    const nav = document.querySelector('.nav');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
}

// === SMOOTH SCROLL PARA LINKS DE NAVEGAÇÃO === //
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Ajuste para altura do nav
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// === INTERSECTION OBSERVER PARA ANIMAÇÕES === //
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                // Desconecta após animar para melhor performance
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observa cards de serviços
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => observer.observe(card));
    
    // Observa portfolio items
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach(item => observer.observe(item));
    
    // Observa testimonials
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    testimonialCards.forEach(card => observer.observe(card));
}

// === MOBILE MENU TOGGLE === //
function initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            mobileToggle.classList.toggle('active');
        });
        
        // Fecha menu ao clicar em um link
        const links = navLinks.querySelectorAll('.nav-link');
        links.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    navLinks.style.display = 'none';
                    mobileToggle.classList.remove('active');
                }
            });
        });
    }
}

// === CONTACT FORM HANDLING === //
function initContactForm() {
    const form = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Coleta dados do formulário
        const formData = {
            nome: form.nome.value,
            email: form.email.value,
            empresa: form.empresa.value,
            servico: form.servico.value,
            mensagem: form.mensagem.value,
            timestamp: new Date().toISOString()
        };
        
        // Validação básica
        if (!formData.nome || !formData.email || !formData.servico || !formData.mensagem) {
            showFormMessage('Por favor, preencha todos os campos obrigatórios.', 'error');
            return;
        }
        
        // Validação de email
        if (!isValidEmail(formData.email)) {
            showFormMessage('Por favor, insira um email válido.', 'error');
            return;
        }
        
        // Mostra mensagem de envio
        showFormMessage('Enviando mensagem...', 'sending');
        
        // Envia para Google Sheets
        try {
            await sendToGoogleSheets(formData);
            
            // Sucesso
            showFormMessage('✓ Mensagem enviada com sucesso! Retornaremos em breve.', 'success');
            form.reset();
            
            // Limpa mensagem após 5 segundos
            setTimeout(() => {
                formMessage.innerHTML = '';
                formMessage.className = 'form-message';
            }, 5000);
            
            // Tracking (Google Analytics, Facebook Pixel, etc.)
            trackFormSubmission(formData);
            
        } catch (error) {
            showFormMessage('Erro ao enviar mensagem. Tente novamente.', 'error');
            console.error('Erro no envio:', error);
        }
    });
}

// === FUNÇÕES AUXILIARES DO FORMULÁRIO === //

// Mostra mensagem no formulário
function showFormMessage(message, type) {
    const formMessage = document.getElementById('formMessage');
    if (!formMessage) return;
    
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
}

// Valida email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Simula envio do formulário (DESENVOLVIMENTO APENAS)
function simulateFormSubmission(data) {
    return new Promise((resolve) => {
        console.log('📧 Dados do formulário:', data);
        setTimeout(() => {
            resolve({ success: true });
        }, 1500);
    });
}

// Envia dados para Google Sheets
async function sendToGoogleSheets(data) {
    const SCRIPT_URL = CONFIG.GOOGLE_SCRIPT_URL;
    
    if (!SCRIPT_URL) {
        throw new Error('URL do Google Script não configurada. Veja CONFIGURACAO_GOOGLE_SHEETS.md');
    }
    
    try {
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        // Note: no-cors mode não permite ler a resposta
        // Assumimos sucesso se não houver erro de rede
        console.log('✅ Dados enviados para Google Sheets');
        return { success: true };
        
    } catch (error) {
        console.error('❌ Erro ao enviar para Google Sheets:', error);
        throw error;
    }
}

// Tracking de conversão
function trackFormSubmission(data) {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', 'form_submission', {
            event_category: 'Contact',
            event_label: data.servico,
            value: 1
        });
    }
    
    // Facebook Pixel
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Lead', {
            content_name: 'Contact Form',
            content_category: data.servico
        });
    }
    
    console.log('📊 Conversão rastreada:', data.servico);
}

// === INTEGRAÇÃO COM EMAIL SERVICES === //

/**
 * EXEMPLO DE INTEGRAÇÃO COM EMAILJS
 * 
 * 1. Crie conta em emailjs.com
 * 2. Configure template de email
 * 3. Substitua a função simulateFormSubmission por:
 */
/*
async function sendEmailJS(data) {
    emailjs.init("YOUR_PUBLIC_KEY");
    
    try {
        const response = await emailjs.send(
            "YOUR_SERVICE_ID",
            "YOUR_TEMPLATE_ID",
            {
                from_name: data.nome,
                from_email: data.email,
                empresa: data.empresa,
                servico: data.servico,
                message: data.mensagem
            }
        );
        return response;
    } catch (error) {
        throw error;
    }
}
*/

/**
 * EXEMPLO DE INTEGRAÇÃO COM GOOGLE SHEETS
 * 
 * 1. Crie Google Apps Script
 * 2. Deploy como Web App
 * 3. Use a função abaixo:
 */
/*
async function sendToGoogleSheets(data) {
    const SCRIPT_URL = 'YOUR_GOOGLE_SCRIPT_URL';
    
    try {
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        return response;
    } catch (error) {
        throw error;
    }
}
*/

// === PORTFOLIO ITEM INTERACTIONS === //
function initPortfolioInteractions() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    portfolioItems.forEach(item => {
        item.addEventListener('click', () => {
            const title = item.querySelector('.portfolio-title').textContent;
            console.log('Portfolio item clicado:', title);
            // Aqui você pode adicionar modal ou link para página de projeto
        });
    });
}

// === UTILITY FUNCTIONS === //

// Debounce para otimizar eventos de scroll/resize
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Detecta se elemento está visível no viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// === PERFORMANCE OPTIMIZATIONS === //

// Lazy loading para imagens (quando adicionar imagens reais)
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });
        
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => imageObserver.observe(img));
    }
}

// === ANALYTICS E TRACKING === //

// Rastreamento de scroll depth
function initScrollDepthTracking() {
    let scrollDepths = [25, 50, 75, 100];
    let firedDepths = [];
    
    window.addEventListener('scroll', debounce(() => {
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        
        scrollDepths.forEach(depth => {
            if (scrollPercent >= depth && !firedDepths.includes(depth)) {
                firedDepths.push(depth);
                
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'scroll_depth', {
                        event_category: 'Engagement',
                        event_label: `${depth}%`,
                        value: depth
                    });
                }
                
                console.log(`📊 Scroll depth: ${depth}%`);
            }
        });
    }, 500));
}

// Rastreamento de tempo na página
function initTimeOnPageTracking() {
    let startTime = Date.now();
    
    window.addEventListener('beforeunload', () => {
        const timeSpent = Math.round((Date.now() - startTime) / 1000);
        
        if (typeof gtag !== 'undefined') {
            gtag('event', 'time_on_page', {
                event_category: 'Engagement',
                event_label: 'seconds',
                value: timeSpent
            });
        }
        
        console.log(`⏱️ Tempo na página: ${timeSpent}s`);
    });
}

// === CONSOLE BRANDING === //
function initConsoleBranding() {
    const styles = [
        'color: #00A78E',
        'font-size: 16px',
        'font-weight: bold',
        'padding: 10px'
    ].join(';');
    
    console.log('%cANA ROVINA STUDIO', styles);
    console.log('%cProdutora Digital | contato@arovinastudio.com.br', 'color: #666; font-size: 12px;');
}

// === INICIALIZAÇÃO === //
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Iniciando Ana Rovina Studio Landing Page...');
    
    // Inicializa todas as funcionalidades
    initConsoleBranding();
    initNavigationScroll();
    initSmoothScroll();
    initScrollAnimations();
    initMobileMenu();
    initContactForm();
    initPortfolioInteractions();
    initLazyLoading();
    initScrollDepthTracking();
    initTimeOnPageTracking();
    
    console.log('✅ Landing page carregada com sucesso!');
});

// === ERROR HANDLING === //
window.addEventListener('error', (e) => {
    console.error('❌ Erro detectado:', e.message);
    // Aqui você pode enviar erros para serviço de monitoramento
});

// === EXPORT PARA TESTES (OPCIONAL) === //
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        isValidEmail,
        debounce,
        isInViewport
    };
}