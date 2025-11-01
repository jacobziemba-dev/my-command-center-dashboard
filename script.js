// Toast Notification System
function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'toast-message';
    messageDiv.textContent = message;
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'toast-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.onclick = () => removeToast(toast);
    
    toast.appendChild(messageDiv);
    toast.appendChild(closeBtn);
    toastContainer.appendChild(toast);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        removeToast(toast);
    }, 5000);
}

function removeToast(toast) {
    toast.classList.add('slide-out');
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 300);
}

// Browser Detection
function detectBrowser() {
    const userAgent = navigator.userAgent;
    let browser = 'Unknown';
    let version = 'Unknown';
    
    if (userAgent.indexOf('Firefox') > -1) {
        browser = 'Firefox';
        const match = userAgent.match(/Firefox\/(\d+)/);
        version = match ? match[1] : 'Unknown';
    } else if (userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Edg') === -1) {
        browser = 'Chrome';
        const match = userAgent.match(/Chrome\/(\d+)/);
        version = match ? match[1] : 'Unknown';
    } else if (userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') === -1) {
        browser = 'Safari';
        const match = userAgent.match(/Version\/(\d+)/);
        version = match ? match[1] : 'Unknown';
    } else if (userAgent.indexOf('Edg') > -1) {
        browser = 'Edge';
        const match = userAgent.match(/Edg\/(\d+)/);
        version = match ? match[1] : 'Unknown';
    } else if (userAgent.indexOf('Opera') > -1 || userAgent.indexOf('OPR') > -1) {
        browser = 'Opera';
        const match = userAgent.match(/(?:Opera|OPR)\/(\d+)/);
        version = match ? match[1] : 'Unknown';
    }
    
    return { browser, version };
}

// OS Detection
function detectOS() {
    const userAgent = navigator.userAgent;
    let os = 'Unknown';
    
    if (userAgent.indexOf('Win') > -1) os = 'Windows';
    else if (userAgent.indexOf('Mac') > -1) os = 'macOS';
    else if (userAgent.indexOf('Linux') > -1) os = 'Linux';
    else if (userAgent.indexOf('Android') > -1) os = 'Android';
    else if (userAgent.indexOf('iOS') > -1 || /iPad|iPhone|iPod/.test(userAgent)) os = 'iOS';
    
    return os;
}

// Browser Information Collection
function getBrowserInfo() {
    const browserInfo = detectBrowser();
    const os = detectOS();
    
    const info = {
        browser: `${browserInfo.browser} ${browserInfo.version}`,
        os: os,
        cpuCores: navigator.hardwareConcurrency || 'Unknown',
        deviceMemory: navigator.deviceMemory ? `${navigator.deviceMemory} GB` : 'Not available',
        screenResolution: `${screen.width} × ${screen.height}`,
        colorDepth: `${screen.colorDepth} bits`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language || 'Unknown',
        languages: navigator.languages ? navigator.languages.join(', ') : 'Unknown',
        cookiesEnabled: navigator.cookieEnabled ? 'Enabled' : 'Disabled',
        javascriptEnabled: 'Enabled',
        onlineStatus: navigator.onLine ? 'Online' : 'Offline',
        connectionType: getConnectionType()
    };
    
    return info;
}

// Connection Type Detection
function getConnectionType() {
    if ('connection' in navigator) {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (connection) {
            return connection.effectiveType || connection.type || 'Unknown';
        }
    }
    return 'Not available';
}

// Display Browser Information
function displayBrowserInfo() {
    const info = getBrowserInfo();
    const grid = document.getElementById('browserInfoGrid');
    grid.innerHTML = '';
    
    const infoItems = [
        { label: 'Browser', value: info.browser },
        { label: 'Operating System', value: info.os },
        { label: 'CPU Cores', value: info.cpuCores },
        { label: 'Device Memory', value: info.deviceMemory },
        { label: 'Screen Resolution', value: info.screenResolution },
        { label: 'Color Depth', value: info.colorDepth },
        { label: 'Timezone', value: info.timezone },
        { label: 'Language', value: info.language },
        { label: 'All Languages', value: info.languages },
        { 
            label: 'Cookies', 
            value: info.cookiesEnabled,
            status: info.cookiesEnabled === 'Enabled' ? 'enabled' : 'disabled'
        },
        {
            label: 'JavaScript',
            value: info.javascriptEnabled,
            status: 'enabled'
        },
        {
            label: 'Connection',
            value: info.onlineStatus,
            status: info.onlineStatus === 'Online' ? 'online' : 'offline'
        },
        { label: 'Connection Type', value: info.connectionType }
    ];
    
    infoItems.forEach(item => {
        const card = document.createElement('div');
        card.className = 'info-card';
        
        const label = document.createElement('h3');
        label.textContent = item.label;
        
        const value = document.createElement('div');
        value.className = 'value';
        value.textContent = item.value;
        
        card.appendChild(label);
        card.appendChild(value);
        
        if (item.status) {
            const status = document.createElement('span');
            status.className = `status ${item.status}`;
            status.textContent = item.status === 'online' || item.status === 'enabled' ? '✓ Active' : '✗ Inactive';
            card.appendChild(status);
        }
        
        grid.appendChild(card);
    });
}

// Cleanup Functions
function clearLocalStorage() {
    try {
        const count = localStorage.length;
        localStorage.clear();
        if (count > 0) {
            showToast(`Cleared ${count} localStorage item(s)`, 'success');
        } else {
            showToast('No localStorage items to clear', 'warning');
        }
    } catch (error) {
        showToast('Error clearing localStorage: ' + error.message, 'error');
    }
}

function clearSessionStorage() {
    try {
        const count = sessionStorage.length;
        sessionStorage.clear();
        showToast(`Cleared ${count} sessionStorage item(s)`, 'success');
    } catch (error) {
        showToast('Error clearing sessionStorage: ' + error.message, 'error');
    }
}

function clearCookies() {
    try {
        const cookies = document.cookie.split(';');
        let cleared = 0;
        
        cookies.forEach(cookie => {
            const eqPos = cookie.indexOf('=');
            const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
            
            if (name) {
                // Set cookie to expire in the past
                document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
                document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;domain=${window.location.hostname};`;
                document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;domain=.${window.location.hostname};`;
                cleared++;
            }
        });
        
        if (cleared > 0) {
            showToast(`Cleared ${cleared} cookie(s) for this domain`, 'success');
        } else {
            showToast('No cookies found for this domain', 'warning');
        }
    } catch (error) {
        showToast('Error clearing cookies: ' + error.message, 'error');
    }
}

// Online/Offline Status Listener
function updateOnlineStatus() {
    displayBrowserInfo();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Display browser info on load
    displayBrowserInfo();
    
    // Cleanup button listeners
    document.getElementById('clearLocalStorage').addEventListener('click', clearLocalStorage);
    document.getElementById('clearSessionStorage').addEventListener('click', clearSessionStorage);
    document.getElementById('clearCookies').addEventListener('click', clearCookies);
    
    // Online/offline status listeners
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    // Connection change listener (if available)
    if ('connection' in navigator) {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (connection) {
            connection.addEventListener('change', () => {
                displayBrowserInfo();
            });
        }
    }
});

