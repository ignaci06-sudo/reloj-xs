// Zonas horarias por defecto
const DEFAULT_TIMEZONES = [
    { timezone: 'America/New_York', name: 'Nueva York', flag: '🇺🇸' },
    { timezone: 'Europe/London', name: 'Londres', flag: '🇬🇧' },
    { timezone: 'Europe/Paris', name: 'París', flag: '🇫🇷' },
    { timezone: 'Asia/Tokyo', name: 'Tokio', flag: '🇯🇵' },
    { timezone: 'Australia/Sydney', name: 'Sídney', flag: '🇦🇺' },
    { timezone: 'Asia/Dubai', name: 'Dubái', flag: '🇦🇪' },
];

// Almacenar zonas horarias personalizadas
let customTimezones = [];

// Cargar zonas horarias del localStorage
function loadTimezones() {
    const saved = localStorage.getItem('timezones');
    if (saved) {
        try {
            customTimezones = JSON.parse(saved);
        } catch (e) {
            customTimezones = [];
        }
    }
}

// Guardar zonas horarias en localStorage
function saveTimezones() {
    localStorage.setItem('timezones', JSON.stringify(customTimezones));
}

// Formatear hora para una zona horaria específica
function formatTime(timezone) {
    try {
        const time = new Date().toLocaleString('es-ES', {
            timeZone: timezone,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
        return time;
    } catch (e) {
        return '??:??:??';
    }
}

// Formatear fecha para una zona horaria específica
function formatDate(timezone) {
    try {
        const date = new Date().toLocaleString('es-ES', {
            timeZone: timezone,
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: '2-digit'
        });
        return date;
    } catch (e) {
        return '---';
    }
}

// Obtener flag de un país (aproximado)
function getFlag(timezone) {
    const flagMap = {
        'America/New_York': '🇺🇸',
        'Europe/London': '🇬🇧',
        'Europe/Paris': '🇫🇷',
        'Asia/Tokyo': '🇯🇵',
        'Australia/Sydney': '🇦🇺',
        'Asia/Dubai': '🇦🇪',
        'America/Chicago': '🇺🇸',
        'America/Denver': '🇺🇸',
        'America/Los_Angeles': '🇺🇸',
        'America/Mexico_City': '🇲🇽',
        'America/Toronto': '🇨🇦',
        'America/Argentina/Buenos_Aires': '🇦🇷',
        'Asia/Bangkok': '🇹🇭',
        'Asia/Kolkata': '🇮🇳',
        'Asia/Shanghai': '🇨🇳',
        'Asia/Singapore': '🇸🇬',
        'Asia/Seoul': '🇰🇷',
        'Europe/Amsterdam': '🇳🇱',
        'Europe/Berlin': '🇩🇪',
        'Europe/Istanbul': '🇹🇷',
        'Europe/Moscow': '🇷🇺',
        'Europe/Madrid': '🇪🇸',
        'Africa/Cairo': '🇪🇬',
        'Africa/Johannesburg': '🇿🇦',
        'Pacific/Auckland': '🇳🇿',
        'Pacific/Fiji': '🇫🇯',
    };
    return flagMap[timezone] || '🌍';
}

// Obtener nombre de zona horaria
function getTimezoneName(timezone) {
    const nameMap = {
        'America/New_York': 'Nueva York',
        'Europe/London': 'Londres',
        'Europe/Paris': 'París',
        'Asia/Tokyo': 'Tokio',
        'Australia/Sydney': 'Sídney',
        'Asia/Dubai': 'Dubái',
        'America/Chicago': 'Chicago',
        'America/Denver': 'Denver',
        'America/Los_Angeles': 'Los Ángeles',
        'America/Mexico_City': 'México',
        'America/Toronto': 'Toronto',
        'America/Argentina/Buenos_Aires': 'Buenos Aires',
        'Asia/Bangkok': 'Bangkok',
        'Asia/Kolkata': 'Nueva Delhi',
        'Asia/Shanghai': 'Shanghái',
        'Asia/Singapore': 'Singapur',
        'Asia/Seoul': 'Seúl',
        'Europe/Amsterdam': 'Ámsterdam',
        'Europe/Berlin': 'Berlín',
        'Europe/Istanbul': 'Estambul',
        'Europe/Moscow': 'Moscú',
        'Europe/Madrid': 'Madrid',
        'Africa/Cairo': 'El Cairo',
        'Africa/Johannesburg': 'Johannesburgo',
        'Pacific/Auckland': 'Auckland',
        'Pacific/Fiji': 'Fiyi',
    };
    return nameMap[timezone] || timezone;
}

// Crear elemento de reloj
function createClockCard(timezone, customId = null) {
    const card = document.createElement('div');
    card.className = 'clock-card';
    card.setAttribute('data-timezone', timezone);
    if (customId) {
        card.setAttribute('data-custom-id', customId);
    }
    
    const name = getTimezoneName(timezone);
    const flag = getFlag(timezone);
    
    card.innerHTML = `
        <div class="location">
            <div style="font-size: 2.5rem; margin-bottom: 10px;">${flag}</div>
            <h2>${name}</h2>
            <p class="timezone">${timezone}</p>
        </div>
        <div class="digital-clock">
            <span>${formatTime(timezone).split(':')[0]}</span><span class="blink">:</span><span>${formatTime(timezone).split(':')[1]}</span><span class="blink">:</span><span>${formatTime(timezone).split(':')[2]}</span>
        </div>
        <div class="date">${formatDate(timezone)}</div>
        ${customId ? `<button class="btn-danger" style="width: 100%; margin-top: 15px;">Eliminar</button>` : ''}
    `;
    
    // Agregar evento para eliminar
    if (customId) {
        card.querySelector('.btn-danger').addEventListener('click', () => {
            removeTimezone(customId);
        });
    }
    
    return card;
}

// Actualizar todos los relojes
function updateAllClocks() {
    const cards = document.querySelectorAll('.clock-card');
    cards.forEach(card => {
        const timezone = card.getAttribute('data-timezone');
        const timeStr = formatTime(timezone);
        const dateStr = formatDate(timezone);
        
        const parts = timeStr.split(':');
        const digitalClock = card.querySelector('.digital-clock');
        digitalClock.innerHTML = `
            <span>${parts[0]}</span><span class="blink">:</span><span>${parts[1]}</span><span class="blink">:</span><span>${parts[2]}</span>
        `;
        
        const dateEl = card.querySelector('.date');
        if (dateEl) {
            dateEl.textContent = dateStr;
        }
    });
}

// Renderizar grid de relojes
function renderClocks() {
    const grid = document.getElementById('clocksGrid');
    grid.innerHTML = '';
    
    // Relojes por defecto
    DEFAULT_TIMEZONES.forEach(tz => {
        const card = createClockCard(tz.timezone);
        grid.appendChild(card);
    });
    
    // Relojes personalizados
    customTimezones.forEach((tz, index) => {
        const card = createClockCard(tz.timezone, index);
        grid.appendChild(card);
    });
}

// Agregar nueva zona horaria
function addTimezone(timezone) {
    if (!timezone) return;
    
    // Verificar que no esté duplicada
    const isDuplicate = customTimezones.some(tz => tz.timezone === timezone) ||
                       DEFAULT_TIMEZONES.some(tz => tz.timezone === timezone);
    
    if (isDuplicate) {
        alert('Esta zona horaria ya está agregada');
        return;
    }
    
    customTimezones.push({ timezone });
    saveTimezones();
    renderClocks();
}

// Eliminar zona horaria
function removeTimezone(id) {
    customTimezones.splice(id, 1);
    saveTimezones();
    renderClocks();
}

// Modal functionality
function setupModal() {
    const modal = document.getElementById('modal');
    const addBtn = document.getElementById('add-timezone-btn');
    const closeBtn = document.querySelector('.close');
    const submitBtn = document.getElementById('add-btn');
    const select = document.getElementById('timezone-select');
    
    addBtn.addEventListener('click', () => {
        modal.style.display = 'block';
        select.value = '';
        select.focus();
    });
    
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    submitBtn.addEventListener('click', () => {
        const timezone = select.value;
        if (timezone) {
            addTimezone(timezone);
            modal.style.display = 'none';
        }
    });
    
    select.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            submitBtn.click();
        }
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    loadTimezones();
    renderClocks();
    setupModal();
    
    // Actualizar cada segundo
    setInterval(updateAllClocks, 1000);
    
    // Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js').catch(err => {
            console.log('SW registration failed:', err);
        });
    }
});
