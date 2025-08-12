/**
 * CONTROL DE ANIMACIONES
 * Box Stone Website - Animations Module
 */

/**
 * Configuración de animaciones
 */
const animationConfig = {
    observerOptions: {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    },
    delays: {
        card: 100,
        stat: 200,
        techTag: 50
    },
    durations: {
        fadeIn: 600,
        slideIn: 500,
        bounce: 1000
    }
};

/**
 * Observer para animaciones al hacer scroll
 */
let intersectionObserver;

/**
 * Inicializa el sistema de animaciones
 */
function initializeAnimations() {
    // Configurar Intersection Observer para animaciones de scroll
    setupScrollAnimations();
    
    // Inicializar animaciones de estadísticas
    initializeStatAnimations();
    
    // Configurar animaciones de hover mejoradas
    setupAdvancedHoverEffects();
    
    // Inicializar animaciones de loading
    setupLoadingAnimations();
    
    console.log('Sistema de animaciones inicializado');
}

/**
 * Configura las animaciones que se activan al hacer scroll
 */
function setupScrollAnimations() {
    intersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const animationType = element.dataset.animate;
                
                switch (animationType) {
                    case 'fadeInUp':
                        animateFadeInUp(element);
                        break;
                    case 'slideInLeft':
                        animateSlideInLeft(element);
                        break;
                    case 'slideInRight':
                        animateSlideInRight(element);
                        break;
                    case 'scaleIn':
                        animateScaleIn(element);
                        break;
                    case 'bounceIn':
                        animateBounceIn(element);
                        break;
                    default:
                        animateFadeInUp(element);
                }
                
                // Dejar de observar el elemento después de animarlo
                intersectionObserver.unobserve(element);
            }
        });
    }, animationConfig.observerOptions);
    
    // Marcar elementos para animación al scroll
    markElementsForScrollAnimation();
}

/**
 * Marca elementos para animación al hacer scroll
 */
function markElementsForScrollAnimation() {
    // Cards con animación escalonada
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.dataset.animate = 'fadeInUp';
        card.style.animationDelay = `${index * animationConfig.delays.card}ms`;
        intersectionObserver.observe(card);
    });
    
    // Categorías de servicios con animación alternada
    const serviceCategories = document.querySelectorAll('.service-category');
    serviceCategories.forEach((category, index) => {
        category.style.opacity = '0';
        
        if (index % 2 === 0) {
            category.style.transform = 'translateX(-50px)';
            category.dataset.animate = 'slideInLeft';
        } else {
            category.style.transform = 'translateX(50px)';
            category.dataset.animate = 'slideInRight';
        }
        
        intersectionObserver.observe(category);
    });
    
    // Elementos de contenido general
    const sections = document.querySelectorAll('.section-content');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(40px)';
        section.dataset.animate = 'fadeInUp';
        intersectionObserver.observe(section);
    });
}

/**
 * Animación de aparición desde abajo
 * @param {Element} element - Elemento a animar
 */
function animateFadeInUp(element) {
    const delay = element.style.animationDelay || '0ms';
    
    setTimeout(() => {
        element.style.transition = `all ${animationConfig.durations.fadeIn}ms cubic-bezier(0.4, 0, 0.2, 1)`;
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
        
        // Limpiar estilos después de la animación
        setTimeout(() => {
            element.style.transition = '';
        }, animationConfig.durations.fadeIn);
    }, parseInt(delay));
}

/**
 * Animación de deslizamiento desde la izquierda
 * @param {Element} element - Elemento a animar
 */
function animateSlideInLeft(element) {
    element.style.transition = `all ${animationConfig.durations.slideIn}ms cubic-bezier(0.4, 0, 0.2, 1)`;
    element.style.opacity = '1';
    element.style.transform = 'translateX(0)';
}

/**
 * Animación de deslizamiento desde la derecha
 * @param {Element} element - Elemento a animar
 */
function animateSlideInRight(element) {
    element.style.transition = `all ${animationConfig.durations.slideIn}ms cubic-bezier(0.4, 0, 0.2, 1)`;
    element.style.opacity = '1';
    element.style.transform = 'translateX(0)';
}

/**
 * Animación de escalado
 * @param {Element} element - Elemento a animar
 */
function animateScaleIn(element) {
    element.style.transition = `all ${animationConfig.durations.fadeIn}ms cubic-bezier(0.4, 0, 0.2, 1)`;
    element.style.opacity = '1';
    element.style.transform = 'scale(1)';
}

/**
 * Animación de rebote
 * @param {Element} element - Elemento a animar
 */
function animateBounceIn(element) {
    element.style.animation = `bounce ${animationConfig.durations.bounce}ms ease`;
    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';
}

/**
 * Inicializa las animaciones de estadísticas
 */
function initializeStatAnimations() {
    const stats = document.querySelectorAll('.stat-number');
    
    stats.forEach((stat, index) => {
        // Marcar para animación cuando sea visible
        stat.style.opacity = '0';
        stat.dataset.animate = 'countUp';
        stat.dataset.finalValue = stat.textContent;
        stat.textContent = '0';
        
        // Observer específico para estadísticas
        const statObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        animateCountUp(entry.target);
                    }, index * animationConfig.delays.stat);
                    statObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        statObserver.observe(stat);
    });
}

/**
 * Anima el conteo hacia arriba de las estadísticas
 * @param {Element} element - Elemento de estadística
 */
function animateCountUp(element) {
    const finalValue = element.dataset.finalValue;
    const isPercentage = finalValue.includes('%');
    const isPlus = finalValue.includes('+');
    const isSlash = finalValue.includes('/');
    
    let numericValue;
    let suffix = '';
    
    if (isPercentage) {
        numericValue = parseInt(finalValue);
        suffix = '%';
    } else if (isPlus) {
        numericValue = parseInt(finalValue);
        suffix = '+';
    } else if (isSlash) {
        element.textContent = finalValue;
        element.style.opacity = '1';
        return;
    } else {
        numericValue = parseInt(finalValue);
    }
    
    element.style.opacity = '1';
    
    const duration = 2000;
    const steps = 60;
    const increment = numericValue / steps;
    const stepDuration = duration / steps;
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        
        if (current >= numericValue) {
            element.textContent = numericValue + suffix;
            clearInterval(timer);
            
            // Añadir efecto de pulso al finalizar
            element.style.transform = 'scale(1.1)';
            setTimeout(() => {
                element.style.transform = 'scale(1)';
            }, 200);
        } else {
            element.textContent = Math.floor(current) + suffix;
        }
    }, stepDuration);
}

/**
 * Configura efectos de hover avanzados
 */
function setupAdvancedHoverEffects() {
    // Efecto de ondulación en botones
    const buttons = document.querySelectorAll('.cta-button');
    buttons.forEach(button => {
        button.addEventListener('click', createRippleEffect);
    });
    
    // Efecto de brillo en tech tags
    const techTags = document.querySelectorAll('.tech-tag');
    techTags.forEach(tag => {
        tag.addEventListener('mouseenter', () => {
            tag.style.animation = 'none';
            tag.offsetHeight; // Trigger reflow
            tag.style.animation = 'techTagGlow 0.6s ease';
        });
    });
    
    // Efecto de elevación en cards
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px) scale(1.02)';
            card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.boxShadow = '';
        });
    });
}

/**
 * Crea efecto de ondulación en botones
 * @param {Event} event - Evento de clic
 */
function createRippleEffect(event) {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    const ripple = document.createElement('span');
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    `;
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

/**
 * Configura animaciones de carga
 */
function setupLoadingAnimations() {
    // Animación de aparición progresiva para elementos
    const elementsToLoad = document.querySelectorAll('[data-load-order]');
    
    elementsToLoad.forEach(element => {
        const order = parseInt(element.dataset.loadOrder);
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.6s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, order * 100);
    });
}

/**
 * Añade animación de escritura a elementos de texto
 * @param {Element} element - Elemento de texto
 * @param {number} speed - Velocidad de escritura (ms por carácter)
 */
function typeWriter(element, speed = 50) {
    const text = element.textContent;
    element.textContent = '';
    element.style.opacity = '1';
    
    let i = 0;
    const timer = setInterval(() => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(timer);
        }
    }, speed);
}

/**
 * Crea partículas flotantes de fondo
 */
function createFloatingParticles() {
    const container = document.body;
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        particle.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: rgba(102, 126, 234, 0.3);
            border-radius: 50%;
            pointer-events: none;
            z-index: -1;
            left: ${Math.random() * 100}vw;
            top: ${Math.random() * 100}vh;
            animation: float ${5 + Math.random() * 10}s infinite linear;
        `;
        
        container.appendChild(particle);
    }
}

/**
 * Limpia todas las animaciones activas
 */
function cleanupAnimations() {
    if (intersectionObserver) {
        intersectionObserver.disconnect();
    }
    
    // Remover partículas flotantes
    document.querySelectorAll('.floating-particle').forEach(particle => {
        particle.remove();
    });
}

/**
 * Maneja animaciones según las preferencias del usuario
 */
function handleMotionPreferences() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
        // Deshabilitar animaciones complejas
        document.documentElement.style.setProperty('--animation-duration', '0.01ms');
        return;
    }
    
    // Escuchar cambios en las preferencias
    prefersReducedMotion.addEventListener('change', (e) => {
        if (e.matches) {
            cleanupAnimations();
        } else {
            initializeAnimations();
        }
    });
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    handleMotionPreferences();
    initializeAnimations();
});

// Limpiar al cerrar la página
window.addEventListener('beforeunload', cleanupAnimations);

// Exportar funciones para uso global
window.typeWriter = typeWriter;
window.createFloatingParticles = createFloatingParticles;