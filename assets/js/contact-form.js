/**
 * FORMULARIO DE CONTACTO
 * Box Stone Website - Contact Form Module
 */

// Base de datos simulada en memoria
let contactDatabase = [];

/**
 * Configuración del formulario
 */
const formConfig = {
    required: ['fullName', 'email', 'description'],
    validation: {
        fullName: {
            minLength: 2,
            maxLength: 100,
            pattern: /^[a-zA-ZÀ-ÿ\s]+$/
        },
        email: {
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        },
        phone: {
            pattern: /^[\+]?[\d\s\-\(\)]+$/,
            minLength: 7,
            maxLength: 20
        },
        description: {
            minLength: 10,
            maxLength: 1000
        }
    }
};

/**
 * Inicializa el formulario de contacto
 */
function initializeContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    // Configurar event listeners
    form.addEventListener('submit', handleSubmit);
    
    // Validación en tiempo real
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearFieldError(input));
    });

    // Configurar autocompletado inteligente
    setupSmartAutocomplete();
    
    console.log('Formulario de contacto inicializado');
}

/**
 * Maneja el envío del formulario
 * @param {Event} event - Evento del formulario
 */
function handleSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');
    
    // Deshabilitar botón durante el envío
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.innerHTML = '<div class="loading-spinner"></div> Enviando...';
    
    // Validar formulario completo
    if (!validateForm(form)) {
        resetSubmitButton(submitButton, originalText);
        showFormError('Por favor, corrige los errores antes de enviar.');
        return;
    }
    
    // Obtener datos del formulario
    const formData = new FormData(form);
    const contactData = {
        id: Date.now(),
        fullName: formData.get('fullName').trim(),
        email: formData.get('email').trim().toLowerCase(),
        phone: formData.get('phone')?.trim() || null,
        description: formData.get('description').trim(),
        timestamp: new Date().toISOString(),
        status: 'nuevo',
        source: 'website'
    };
    
    // Simular envío con delay
    setTimeout(() => {
        try {
            // Guardar en base de datos simulada
            saveContactData(contactData);
            
            // Mostrar mensaje de éxito
            showSuccessMessage();
            
            // Limpiar formulario
            form.reset();
            clearAllErrors();
            
            // Analíticas (simuladas)
            trackFormSubmission(contactData);
            
            console.log('Formulario enviado exitosamente:', contactData);
            
        } catch (error) {
            console.error('Error al enviar formulario:', error);
            showFormError('Hubo un error al enviar el mensaje. Por favor, inténtalo nuevamente.');
        }
        
        resetSubmitButton(submitButton, originalText);
    }, 1500);
}

/**
 * Valida todo el formulario
 * @param {HTMLFormElement} form - Formulario a validar
 * @returns {boolean} - True si el formulario es válido
 */
function validateForm(form) {
    let isValid = true;
    const formData = new FormData(form);
    
    // Validar campos requeridos
    formConfig.required.forEach(fieldName => {
        const field = form.querySelector(`[name="${fieldName}"]`);
        const value = formData.get(fieldName)?.trim();
        
        if (!value) {
            showFieldError(field, 'Este campo es obligatorio.');
            isValid = false;
        } else if (!validateField(field)) {
            isValid = false;
        }
    });
    
    // Validar campos opcionales que tienen valor
    Object.keys(formConfig.validation).forEach(fieldName => {
        if (!formConfig.required.includes(fieldName)) {
            const field = form.querySelector(`[name="${fieldName}"]`);
            const value = formData.get(fieldName)?.trim();
            
            if (value && !validateField(field)) {
                isValid = false;
            }
        }
    });
    
    return isValid;
}

/**
 * Valida un campo específico
 * @param {HTMLInputElement} field - Campo a validar
 * @returns {boolean} - True si el campo es válido
 */
function validateField(field) {
    const fieldName = field.name;
    const value = field.value.trim();
    const validation = formConfig.validation[fieldName];
    
    if (!validation) return true;
    
    // Verificar longitud mínima
    if (validation.minLength && value.length < validation.minLength) {
        showFieldError(field, `Mínimo ${validation.minLength} caracteres.`);
        return false;
    }
    
    // Verificar longitud máxima
    if (validation.maxLength && value.length > validation.maxLength) {
        showFieldError(field, `Máximo ${validation.maxLength} caracteres.`);
        return false;
    }
    
    // Verificar patrón
    if (validation.pattern && !validation.pattern.test(value)) {
        let errorMessage = 'Formato inválido.';
        
        switch (fieldName) {
            case 'fullName':
                errorMessage = 'Solo se permiten letras y espacios.';
                break;
            case 'email':
                errorMessage = 'Ingresa un email válido.';
                break;
            case 'phone':
                errorMessage = 'Ingresa un número de teléfono válido.';
                break;
        }
        
        showFieldError(field, errorMessage);
        return false;
    }
    
    // Si llegamos aquí, el campo es válido
    clearFieldError(field);
    return true;
}

/**
 * Muestra error en un campo específico
 * @param {HTMLInputElement} field - Campo con error
 * @param {string} message - Mensaje de error
 */
function showFieldError(field, message) {
    clearFieldError(field);
    
    const formGroup = field.closest('.form-group');
    const errorElement = document.createElement('span');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.color = '#e74c3c';
    errorElement.style.fontSize = '0.9rem';
    errorElement.style.marginTop = '0.5rem';
    errorElement.style.display = 'block';
    
    formGroup.appendChild(errorElement);
    field.style.borderColor = '#e74c3c';
    field.style.boxShadow = '0 0 5px rgba(231, 76, 60, 0.3)';
}

/**
 * Limpia el error de un campo específico
 * @param {HTMLInputElement} field - Campo a limpiar
 */
function clearFieldError(field) {
    const formGroup = field.closest('.form-group');
    const errorElement = formGroup.querySelector('.field-error');
    
    if (errorElement) {
        errorElement.remove();
    }
    
    field.style.borderColor = '';
    field.style.boxShadow = '';
}

/**
 * Limpia todos los errores del formulario
 */
function clearAllErrors() {
    document.querySelectorAll('.field-error').forEach(error => error.remove());
    document.querySelectorAll('.form-error').forEach(error => error.remove());
    
    const inputs = document.querySelectorAll('#contactForm input, #contactForm textarea');
    inputs.forEach(input => {
        input.style.borderColor = '';
        input.style.boxShadow = '';
    });
}

/**
 * Muestra un error general del formulario
 * @param {string} message - Mensaje de error
 */
function showFormError(message) {
    const form = document.getElementById('contactForm');
    const existingError = form.querySelector('.form-error');
    
    if (existingError) {
        existingError.remove();
    }
    
    const errorElement = document.createElement('div');
    errorElement.className = 'form-error';
    errorElement.style.cssText = `
        background: linear-gradient(135deg, #e74c3c, #c0392b);
        color: white;
        padding: 1rem;
        border-radius: 10px;
        margin: 1rem 0;
        text-align: center;
        animation: fadeInUp 0.5s ease;
    `;
    errorElement.textContent = message;
    
    form.insertBefore(errorElement, form.firstChild);
    
    setTimeout(() => {
        errorElement.remove();
    }, 5000);
}

/**
 * Muestra el mensaje de éxito
 */
function showSuccessMessage() {
    const successMessage = document.getElementById('successMessage');
    if (successMessage) {
        successMessage.style.display = 'block';
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 8000);
    }
}

/**
 * Resetea el botón de envío
 * @param {HTMLButtonElement} button - Botón a resetear
 * @param {string} originalText - Texto original del botón
 */
function resetSubmitButton(button, originalText) {
    button.disabled = false;
    button.textContent = originalText;
}

/**
 * Guarda los datos de contacto en la base de datos simulada
 * @param {Object} contactData - Datos del contacto
 */
function saveContactData(contactData) {
    // Validar datos antes de guardar
    if (!contactData.fullName || !contactData.email || !contactData.description) {
        throw new Error('Datos incompletos');
    }
    
    // Verificar duplicados recientes (mismo email en las últimas 24 horas)
    const twentyFourHoursAgo = Date.now() - (24 * 60 * 60 * 1000);
    const recentDuplicate = contactDatabase.find(contact => 
        contact.email === contactData.email && 
        new Date(contact.timestamp).getTime() > twentyFourHoursAgo
    );
    
    if (recentDuplicate) {
        console.warn('Contacto duplicado detectado:', recentDuplicate);
    }
    
    // Guardar en base de datos
    contactDatabase.push(contactData);
    
    // Simular persistencia en localStorage (opcional)
    try {
        const existing = JSON.parse(localStorage.getItem('boxstone_contacts') || '[]');
        existing.push(contactData);
        localStorage.setItem('boxstone_contacts', JSON.stringify(existing));
    } catch (e) {
        console.warn('No se pudo guardar en localStorage:', e);
    }
    
    console.log('Datos guardados. Total de contactos:', contactDatabase.length);
}

/**
 * Configura autocompletado inteligente
 */
function setupSmartAutocomplete() {
    const nameField = document.getElementById('fullName');
    const emailField = document.getElementById('email');
    
    // Formatear nombre mientras se escribe
    if (nameField) {
        nameField.addEventListener('input', function() {
            // Capitalizar primera letra de cada palabra
            this.value = this.value.replace(/\b\w/g, l => l.toUpperCase());
        });
    }
    
    // Formatear email mientras se escribe
    if (emailField) {
        emailField.addEventListener('input', function() {
            // Convertir a minúsculas
            this.value = this.value.toLowerCase();
        });
    }
}

/**
 * Simula tracking de analíticas
 * @param {Object} contactData - Datos del contacto
 */
function trackFormSubmission(contactData) {
    // Simular envío a Google Analytics, Facebook Pixel, etc.
    console.log('Tracking form submission:', {
        event: 'form_submit',
        form_name: 'contact_form',
        timestamp: contactData.timestamp,
        user_type: 'lead'
    });
    
    // Simular webhook a sistema CRM
    console.log('Sending to CRM:', {
        action: 'new_lead',
        data: contactData
    });
}

/**
 * Obtiene estadísticas de contactos (para admin)
 * @returns {Object} - Estadísticas básicas
 */
function getContactStats() {
    const today = new Date().toDateString();
    const thisWeek = Date.now() - (7 * 24 * 60 * 60 * 1000);
    
    return {
        total: contactDatabase.length,
        today: contactDatabase.filter(c => new Date(c.timestamp).toDateString() === today).length,
        thisWeek: contactDatabase.filter(c => new Date(c.timestamp).getTime() > thisWeek).length,
        bySource: contactDatabase.reduce((acc, c) => {
            acc[c.source] = (acc[c.source] || 0) + 1;
            return acc;
        }, {})
    };
}

/**
 * Exporta contactos a CSV (para admin)
 * @returns {string} - Datos en formato CSV
 */
function exportContactsToCSV() {
    const headers = ['ID', 'Nombre', 'Email', 'Teléfono', 'Descripción', 'Fecha', 'Estado'];
    const csvData = [headers.join(',')];
    
    contactDatabase.forEach(contact => {
        const row = [
            contact.id,
            `"${contact.fullName}"`,
            contact.email,
            contact.phone || '',
            `"${contact.description.replace(/"/g, '""')}"`,
            contact.timestamp,
            contact.status
        ];
        csvData.push(row.join(','));
    });
    
    return csvData.join('\n');
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initializeContactForm);

// Exponer funciones para uso global
window.handleSubmit = handleSubmit;
window.getContactStats = getContactStats;
window.exportContactsToCSV = exportContactsToCSV;