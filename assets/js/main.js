/**
 * SCRIPT PRINCIPAL
 * Box Stone Website - Main Application Module
 */

/**
 * Configuración global de la aplicación
 */
const AppConfig = {
    siteName: 'Box Stone',
    version: '1.0.0',
    environment: 'production', // development, staging, production
    features: {
        analytics: true,
        animations: true,
        serviceWorker: false,
        darkMode: false
    },
    api: {
        baseUrl: 'https://api.boxstone.com',
        timeout: 10000
    },
    social: {
        facebook: '#',
        twitter: '#',
        linkedin: '#',
        instagram: '#'
    }
};

/**
 * Estado global de la aplicación
 */
let AppState = {
    isInitialized: false,
    currentSection: 'home',
    isMobile: false,
    isOnline: navigator.onLine,
    theme: 'light',
    language: 'es'
};

/**
 * Inicializa la aplicación principal
 */
function initializeApp() {
    if (AppState.isInitialized) {
        console.warn('La aplicación ya está inicializada');
        return;
    }
    
    try {
        // Detectar tipo de dispositivo
        detectDeviceType();
        
        // Configurar event listeners globales
        setupGlobalEventListeners();
        
        // Inicializar utilidades
        initializeUtilities();
        
        // Configurar performance monitoring
        setupPerformanceMonitoring();
        
        // Configurar analytics si está habilitado
        if (AppConfig.features.analytics) {
            initializeAnalytics();
        }
        
        // Configurar service worker si está habilitado
        if (AppConfig.features.serviceWorker) {
            registerServiceWorker();
        }
        
        // Configurar modo oscuro si está habilitado
        if (AppConfig.features.darkMode) {
            initializeDarkMode();
        }
        
        // Configurar accesibilidad
        setupAccessibilityFeatures();
        
        // Mostrar información de debug en desarrollo
        if (AppConfig.environment === 'development') {
            enableDebugMode();
        }
        
        AppState.isInitialized = true;
        
        console.log(`${AppConfig.siteName} v${AppConfig.version} inicializado correctamente`);
        
        // Disparar evento de inicialización completa
        document.dispatchEvent(new CustomEvent('appInitialized', {
            detail: { 
                version: AppConfig.version,
                timestamp: new Date().toISOString()
            }
        }));
        
    } catch (error) {
        console.error('Error al inicializar la aplicación:', error);
        showErrorMessage('Error de inicialización', 'Hubo un problema al cargar la página. Por favor, recarga el navegador.');
    }
}

/**
 * Detecta el tipo de dispositivo
 */
function detectDeviceType() {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    const isTablet = /ipad|android(?!.*mobile)/i.test(userAgent);
    
    AppState.isMobile = isMobile;
    AppState.isTablet = isTablet;
    
    // Añadir clases CSS al body
    document.body.classList.add(isMobile ? 'is-mobile' : 'is-desktop');
    if (isTablet) document.body.classList.add('is-tablet');
    
    console.log(`Dispositivo detectado: ${isMobile ? 'Móvil' : isTablet ? 'Tablet' : 'Desktop'}`);
}

/**
 * Configura event listeners globales
 */
function setupGlobalEventListeners() {
    // Manejar cambios de conectividad
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    
    // Manejar cambios de visibilidad de la página
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Manejar errores JavaScript globales
    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    // Manejar cambios de tamaño de ventana
    window.addEventListener('resize', debounce(handleWindowResize, 250));
    
    // Prevenir zoom en dispositivos móviles en inputs
    if (AppState.isMobile) {
        preventMobileZoom();
    }
    
    // Manejar atajos de teclado
    document.addEventListener('keydown', handleKeyboardShortcuts);
}

/**
 * Maneja cambios en el estado de conectividad
 */
function handleOnlineStatus() {
    AppState.isOnline = navigator.onLine;
    
    if (AppState.isOnline) {
        showNotification('success', 'Conexión restaurada');
        // Sincronizar datos pendientes si los hay
        syncPendingData();
    } else {
        showNotification('warning', 'Sin conexión a internet');
    }
    
    console.log(`Estado de conexión: ${AppState.isOnline ? 'Online' : 'Offline'}`);
}

/**
 * Maneja cambios de visibilidad de la página
 */
function handleVisibilityChange() {
    if (document.hidden) {
        console.log('Página oculta');
        // Pausar animaciones costosas, videos, etc.
        pauseExpensiveOperations();
    } else {
        console.log('Página visible');
        // Reanudar operaciones
        resumeOperations();
    }
}

/**
 * Maneja errores JavaScript globales
 */
function handleGlobalError(event) {
    console.error('Error global capturado:', event.error);
    
    if (AppConfig.environment === 'production') {
        // En producción, enviar error a servicio de logging
        logError(event.error);
    }
    
    // Mostrar mensaje amigable al usuario si es un error crítico
    if (event.error && event.error.stack && event.error.stack.includes('critical')) {
        showErrorMessage('Error Inesperado', 'Se produjo un error. La página se recargará automáticamente.');
        setTimeout(() => window.location.reload(), 3000);
    }
}

/**
 * Maneja promesas rechazadas no capturadas
 */
function handleUnhandledRejection(event) {
    console.error('Promesa rechazada no manejada:', event.reason);
    
    if (AppConfig.environment === 'production') {
        logError(event.reason);
    }
}

/**
 * Maneja cambios de tamaño de ventana
 */
function handleWindowResize() {
    // Actualizar variables CSS personalizadas si es necesario
    document.documentElement.style.setProperty('--viewport-width', window.innerWidth + 'px');
    document.documentElement.style.setProperty('--viewport-height', window.innerHeight + 'px');
    
    // Reajustar elementos que dependan del tamaño de ventana
    adjustResponsiveElements();
}

/**
 * Previene zoom accidental en móviles
 */
function preventMobileZoom() {
    const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], textarea');
    inputs.forEach(input => {
        if (parseFloat(getComputedStyle(input).fontSize) < 16) {
            input.style.fontSize = '16px';
        }
    });
}

/**
 * Maneja atajos de teclado
 */
function handleKeyboardShortcuts(event) {
    // Solo procesar si no estamos en un input
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        return;
    }
    
    // Ctrl/Cmd + K para búsqueda rápida
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        // Abrir modal de búsqueda o ir a contacto
        showSection('contact');
    }
    
    // Escape para cerrar modales/menús
    if (event.key === 'Escape') {
        closeMobileMenu();
        closeModals();
    }
    
    // Números 1-4 para navegación rápida
    if (['1', '2', '3', '4'].includes(event.key) && !event.ctrlKey && !event.altKey) {
        const sectionMap = { '1': 'home', '2': 'about', '3': 'services', '4': 'contact' };
        showSection(sectionMap[event.key]);
    }
}

/**
 * Inicializa utilidades generales
 */
function initializeUtilities() {
    // Configurar lazy loading de imágenes
    setupLazyLoading();
    
    // Configurar smooth scrolling
    setupSmoothScrolling();
    
    // Configurar tooltips
    setupTooltips();
    
    // Configurar clipboard functionality
    setupClipboard();
}

/**
 * Configura lazy loading para imágenes
 */
function setupLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

/**
 * Configura scroll suave
 */
function setupSmoothScrolling() {
    // Usar CSS scroll-behavior si está disponible
    if (CSS.supports('scroll-behavior', 'smooth')) {
        document.documentElement.style.scrollBehavior = 'smooth';
    }
}

/**
 * Configura tooltips
 */
function setupTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
}

/**
 * Muestra tooltip
 */
function showTooltip(event) {
    const element = event.target;
    const text = element.dataset.tooltip;
    
    if (!text) return;
    
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = text;
    tooltip.style.cssText = `
        position: absolute;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 0.5rem;
        border-radius: 4px;
        font-size: 0.9rem;
        white-space: nowrap;
        z-index: 9999;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    document.body.appendChild(tooltip);
    
    // Posicionar tooltip
    const rect = element.getBoundingClientRect();
    tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 5 + 'px';
    
    // Mostrar con animación
    requestAnimationFrame(() => {
        tooltip.style.opacity = '1';
    });
    
    element._tooltip = tooltip;
}

/**
 * Oculta tooltip
 */
function hideTooltip(event) {
    const tooltip = event.target._tooltip;
    if (tooltip) {
        tooltip.style.opacity = '0';
        setTimeout(() => tooltip.remove(), 300);
        delete event.target._tooltip;
    }
}

/**
 * Configura funcionalidad de clipboard
 */
function setupClipboard() {
    const copyButtons = document.querySelectorAll('[data-copy]');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            const textToCopy = button.dataset.copy || button.textContent;
            
            try {
                await navigator.clipboard.writeText(textToCopy);
                showNotification('success', 'Copiado al portapapeles');
            } catch (error) {
                console.error('Error al copiar:', error);
                fallbackCopy(textToCopy);
            }
        });
    });
}

/**
 * Copia texto usando método de fallback
 */
function fallbackCopy(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
        document.execCommand('copy');
        showNotification('success', 'Copiado al portapapeles');
    } catch (error) {
        showNotification('error', 'No se pudo copiar el texto');
    }
    
    document.body.removeChild(textArea);
}

/**
 * Configura monitoreo de performance
 */
function setupPerformanceMonitoring() {
    if ('performance' in window) {
        // Medir tiempo de carga
        window.addEventListener('load', () => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log(`Tiempo de carga: ${loadTime}ms`);
            
            if (AppConfig.features.analytics) {
                // Enviar métricas a analytics
                trackPerformance('page_load_time', loadTime);
            }
        });
        
        // Observar Core Web Vitals si está disponible
        if ('PerformanceObserver' in window) {
            observeWebVitals();
        }
    }
}

/**
 * Observa Core Web Vitals
 */
function observeWebVitals() {
    try {
        // Largest Contentful Paint (LCP)
        new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                console.log('LCP:', entry.startTime);
            }
        }).observe({ entryTypes: ['largest-contentful-paint'] });
        
        // First Input Delay (FID)
        new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                console.log('FID:', entry.processingStart - entry.startTime);
            }
        }).observe({ entryTypes: ['first-input'] });
        
        // Cumulative Layout Shift (CLS)
        new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (!entry.hadRecentInput) {
                    console.log('CLS:', entry.value);
                }
            }
        }).observe({ entryTypes: ['layout-shift'] });
        
    } catch (error) {
        console.warn('No se pudo configurar el monitoreo de Web Vitals:', error);
    }
}

/**
 * Inicializa analytics
 */
function initializeAnalytics() {
    // Simular configuración de Google Analytics
    console.log('Analytics inicializado');
    
    // Trackear página inicial
    trackPageView(window.location.pathname);
    
    // Listener para cambios de sección
    document.addEventListener('sectionChanged', (event) => {
        trackPageView('/' + event.detail.sectionId);
    });
}

/**
 * Registra service worker
 */
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker registrado:', registration);
            })
            .catch(error => {
                console.error('Error al registrar Service Worker:', error);
            });
    }
}

/**
 * Inicializa modo oscuro
 */
function initializeDarkMode() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
        AppState.theme = savedTheme;
    } else {
        AppState.theme = prefersDark.matches ? 'dark' : 'light';
    }
    
    applyTheme(AppState.theme);
    
    // Escuchar cambios en preferencias del sistema
    prefersDark.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            AppState.theme = e.matches ? 'dark' : 'light';
            applyTheme(AppState.theme);
        }
    });
}

/**
 * Aplica tema
 */
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    AppState.theme = theme;
}

/**
 * Configura características de accesibilidad
 */
function setupAccessibilityFeatures() {
    // Configurar navegación por teclado mejorada
    setupKeyboardNavigation();
    
    // Configurar anuncios para lectores de pantalla
    setupScreenReaderAnnouncements();
    
    // Configurar skip links
    setupSkipLinks();
}

/**
 * Configura navegación por teclado
 */
function setupKeyboardNavigation() {
    // Hacer elementos interactivos accesibles por teclado
    const interactiveElements = document.querySelectorAll('.card, .tech-tag, .service-category');
    
    interactiveElements.forEach(element => {
        if (!element.hasAttribute('tabindex')) {
            element.setAttribute('tabindex', '0');
        }
        
        element.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                element.click();
            }
        });
    });
}

/**
 * Configura anuncios para lectores de pantalla
 */
function setupScreenReaderAnnouncements() {
    // Crear área de anuncios ARIA
    const announceArea = document.createElement('div');
    announceArea.setAttribute('aria-live', 'polite');
    announceArea.setAttribute('aria-atomic', 'true');
    announceArea.style.cssText = `
        position: absolute;
        left: -10000px;
        width: 1px;
        height: 1px;
        overflow: hidden;
    `;
    document.body.appendChild(announceArea);
    
    window.announceToScreenReader = (message) => {
        announceArea.textContent = message;
        setTimeout(() => {
            announceArea.textContent = '';
        }, 1000);
    };
}

/**
 * Configura skip links
 */
function setupSkipLinks() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.textContent = 'Saltar al contenido principal';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--primary-color);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 10000;
        transition: top 0.3s ease;
    `;
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
}

/**
 * Habilita modo debug
 */
function enableDebugMode() {
    console.log('🔧 Modo debug habilitado');
    
    // Mostrar información de la aplicación
    console.table({
        'Nombre': AppConfig.siteName,
        'Versión': AppConfig.version,
        'Entorno': AppConfig.environment,
        'Dispositivo': AppState.isMobile ? 'Móvil' : 'Desktop',
        'Conexión': AppState.isOnline ? 'Online' : 'Offline'
    });
    
    // Agregar herramientas de debug al objeto global
    window.BoxStoneDebug = {
        AppConfig,
        AppState,
        showSection,
        getContactStats,
        exportContactsToCSV
    };
}

/**
 * Funciones de utilidad
 */

/**
 * Debounce function para optimizar eventos
 */
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

/**
 * Throttle function para optimizar eventos
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Muestra notificación temporal
 */
function showNotification(type, message, duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'warning' ? '#FF9800' : '#f44336'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 4px;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

/**
 * Muestra mensaje de error
 */
function showErrorMessage(title, message) {
    const modal = document.createElement('div');
    modal.className = 'error-modal';
    modal.innerHTML = `
        <div class="error-modal__content">
            <h3>${title}</h3>
            <p>${message}</p>
            <button onclick="this.closest('.error-modal').remove()">Cerrar</button>
        </div>
    `;
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10001;
    `;
    
    document.body.appendChild(modal);
}

/**
 * Funciones placeholder para funcionalidades avanzadas
 */
function pauseExpensiveOperations() { /* Implementar según necesidades */ }
function resumeOperations() { /* Implementar según necesidades */ }
function adjustResponsiveElements() { /* Implementar según necesidades */ }
function closeModals() { /* Implementar según necesidades */ }
function syncPendingData() { /* Implementar según necesidades */ }
function logError(error) { /* Implementar logging service */ }
function trackPageView(path) { console.log('Page view:', path); }
function trackPerformance(metric, value) { console.log(`Performance ${metric}:`, value); }

// Inicializar aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initializeApp);

// Exportar funciones principales
window.AppConfig = AppConfig;
window.AppState = AppState;
window.showNotification = showNotification;