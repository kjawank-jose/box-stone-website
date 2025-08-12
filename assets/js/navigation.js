/**
 * NAVEGACIÓN Y MANEJO DE SECCIONES
 * Box Stone Website - Navigation Module
 */

// Variables globales para navegación
let currentSection = 'home';
let isTransitioning = false;

/**
 * Muestra una sección específica y oculta las demás
 * @param {string} sectionId - ID de la sección a mostrar
 */
function showSection(sectionId) {
    // Prevenir transiciones múltiples simultáneas
    if (isTransitioning) return;
    
    // Si ya estamos en la sección solicitada, no hacer nada
    if (currentSection === sectionId) return;
    
    isTransitioning = true;
    
    // Obtener todas las secciones
    const sections = document.querySelectorAll('.section');
    const targetSection = document.getElementById(sectionId);
    
    if (!targetSection) {
        console.error(`Sección ${sectionId} no encontrada`);
        isTransitioning = false;
        return;
    }
    
    // Aplicar efecto de salida a la sección actual
    const currentSectionElement = document.getElementById(currentSection);
    if (currentSectionElement) {
        currentSectionElement.style.opacity = '0';
        currentSectionElement.style.transform = 'translateX(-50px)';
    }
    
    // Después de la animación de salida, cambiar secciones
    setTimeout(() => {
        // Ocultar todas las secciones
        sections.forEach(section => {
            section.classList.remove('active');
            section.style.opacity = '';
            section.style.transform = '';
        });
        
        // Mostrar la sección objetivo con animación de entrada
        targetSection.classList.add('active');
        targetSection.style.opacity = '0';
        targetSection.style.transform = 'translateX(50px)';
        
        // Aplicar animación de entrada
        setTimeout(() => {
            targetSection.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            targetSection.style.opacity = '1';
            targetSection.style.transform = 'translateX(0)';
            
            // Limpiar estilos después de la animación
            setTimeout(() => {
                targetSection.style.transition = '';
                targetSection.style.opacity = '';
                targetSection.style.transform = '';
                isTransitioning = false;
            }, 500);
        }, 50);
        
        // Actualizar sección actual
        currentSection = sectionId;
        
        // Actualizar estado visual de la navegación
        updateNavigationState(sectionId);
        
        // Cerrar menú móvil si está abierto
        closeMobileMenu();
        
        // Scroll al inicio de la página
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Disparar evento personalizado
        document.dispatchEvent(new CustomEvent('sectionChanged', {
            detail: { sectionId, previousSection: currentSection }
        }));
        
    }, 300);
}

/**
 * Actualiza el estado visual de la navegación
 * @param {string} activeSection - Sección activa
 */
function updateNavigationState(activeSection) {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        
        // Buscar el enlace correspondiente a la sección activa
        const onclick = link.getAttribute('onclick');
        if (onclick && onclick.includes(activeSection)) {
            link.classList.add('active');
        }
    });
}

/**
 * Alterna la visibilidad del menú móvil
 */
function toggleMobileMenu() {
    const navLinks = document.getElementById('navLinks');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (!navLinks || !mobileMenu) return;
    
    const isActive = navLinks.classList.contains('active');
    
    if (isActive) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
}

/**
 * Abre el menú móvil
 */
function openMobileMenu() {
    const navLinks = document.getElementById('navLinks');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (!navLinks || !mobileMenu) return;
    
    navLinks.classList.add('active');
    
    // Animación del icono hamburguesa
    const spans = mobileMenu.querySelectorAll('span');
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    
    // Agregar event listener para cerrar al hacer clic fuera
    setTimeout(() => {
        document.addEventListener('click', handleOutsideClick);
    }, 100);
}

/**
 * Cierra el menú móvil
 */
function closeMobileMenu() {
    const navLinks = document.getElementById('navLinks');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (!navLinks || !mobileMenu) return;
    
    navLinks.classList.remove('active');
    
    // Restaurar icono hamburguesa
    const spans = mobileMenu.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
    
    // Remover event listener
    document.removeEventListener('click', handleOutsideClick);
}

/**
 * Maneja clics fuera del menú móvil para cerrarlo
 * @param {Event} event - Evento de clic
 */
function handleOutsideClick(event) {
    const navLinks = document.getElementById('navLinks');
    const mobileMenu = document.querySelector('.mobile-menu');
    const nav = document.querySelector('nav');
    
    if (!nav.contains(event.target)) {
        closeMobileMenu();
    }
}

/**
 * Inicializa la navegación
 */
function initializeNavigation() {
    // Configurar event listeners para enlaces de navegación
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });
    
    // Manejar navegación con teclado
    document.addEventListener('keydown', handleKeyboardNavigation);
    
    // Manejar cambios de tamaño de ventana
    window.addEventListener('resize', handleWindowResize);
    
    // Inicializar estado de navegación
    updateNavigationState(currentSection);
    
    console.log('Sistema de navegación inicializado');
}

/**
 * Maneja la navegación con teclado
 * @param {KeyboardEvent} event - Evento de teclado
 */
function handleKeyboardNavigation(event) {
    // Cerrar menú móvil con Escape
    if (event.key === 'Escape') {
        closeMobileMenu();
        return;
    }
    
    // Navegación con números (1-4)
    const sectionMap = {
        '1': 'home',
        '2': 'about', 
        '3': 'services',
        '4': 'contact'
    };
    
    if (sectionMap[event.key] && !event.ctrlKey && !event.altKey) {
        showSection(sectionMap[event.key]);
    }
}

/**
 * Maneja cambios de tamaño de ventana
 */
function handleWindowResize() {
    // Cerrar menú móvil si la pantalla se hace más grande
    if (window.innerWidth > 768) {
        closeMobileMenu();
    }
}

/**
 * Maneja el efecto de scroll en el header
 */
function handleHeaderScroll() {
    const header = document.querySelector('header');
    if (!header) return;
    
    const scrolled = window.scrollY > 50;
    
    if (scrolled) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 5px 30px rgba(0, 0, 0, 0.15)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
}

/**
 * Configura el logo (imagen o texto)
 */
function setupLogo() {
    const logoImage = document.getElementById('logoImage');
    const logoText = document.getElementById('logoText');
    
    if (logoImage) {
        // Intentar cargar la imagen del logo
        logoImage.onload = function() {
            logoText.style.display = 'none';
            logoImage.style.display = 'block';
            console.log('Logo cargado correctamente');
        };
        
        logoImage.onerror = function() {
            logoText.style.display = 'block';
            logoImage.style.display = 'none';
            console.log('Usando logo de texto por defecto');
        };
        
        // Verificar si la imagen ya está cargada
        if (logoImage.complete) {
            logoImage.onload();
        }
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    setupLogo();
    
    // Event listener para el scroll
    window.addEventListener('scroll', handleHeaderScroll);
});

// Exportar funciones para uso global
window.showSection = showSection;
window.toggleMobileMenu = toggleMobileMenu;