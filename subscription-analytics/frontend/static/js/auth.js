// Authentication functionality
class AuthManager {
    constructor() {
        this.token = localStorage.getItem('token');
        this.user = JSON.parse(localStorage.getItem('user') || 'null');
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Tab switching
        document.getElementById('loginTab').addEventListener('click', () => this.switchTab('login'));
        document.getElementById('registerTab').addEventListener('click', () => this.switchTab('register'));

        // Form submissions
        document.getElementById('loginForm').addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('registerForm').addEventListener('submit', (e) => this.handleRegister(e));
    }

    switchTab(tab) {
        const loginTab = document.getElementById('loginTab');
        const registerTab = document.getElementById('registerTab');
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');

        if (tab === 'login') {
            loginTab.classList.add('border-b-2', 'border-blue-500', 'text-blue-600', 'font-semibold');
            loginTab.classList.remove('text-gray-500');
            registerTab.classList.remove('border-b-2', 'border-blue-500', 'text-blue-600', 'font-semibold');
            registerTab.classList.add('text-gray-500');
            
            loginForm.classList.remove('hidden');
            registerForm.classList.add('hidden');
        } else {
            registerTab.classList.add('border-b-2', 'border-blue-500', 'text-blue-600', 'font-semibold');
            registerTab.classList.remove('text-gray-500');
            loginTab.classList.remove('border-b-2', 'border-blue-500', 'text-blue-600', 'font-semibold');
            loginTab.classList.add('text-gray-500');
            
            registerForm.classList.remove('hidden');
            loginForm.classList.add('hidden');
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            const formData = new FormData();
            formData.append('email', email);
            formData.append('password', password);

            const response = await fetch('/api/auth/login', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                this.setAuthData(data.access_token, data.user);
                this.showAlert('Login successful!', 'success');
                this.redirectToDashboard(data.user.role);
            } else {
                this.showAlert(data.detail || 'Login failed', 'error');
            }
        } catch (error) {
            this.showAlert('Network error. Please try again.', 'error');
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        
        const username = document.getElementById('registerUsername').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const role = document.getElementById('registerRole').value;

        try {
            const formData = new FormData();
            formData.append('username', username);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('role', role);

            const response = await fetch('/api/auth/register', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                this.setAuthData(data.access_token, data.user);
                this.showAlert('Registration successful!', 'success');
                this.redirectToDashboard(data.user.role);
            } else {
                this.showAlert(data.detail || 'Registration failed', 'error');
            }
        } catch (error) {
            this.showAlert('Network error. Please try again.', 'error');
        }
    }

    setAuthData(token, user) {
        this.token = token;
        this.user = user;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
    }

    clearAuthData() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    redirectToDashboard(role) {
        setTimeout(() => {
            if (role === 'admin') {
                window.location.href = '/admin/dashboard';
            } else {
                window.location.href = '/user/dashboard';
            }
        }, 1000);
    }

    showAlert(message, type) {
        const alertContainer = document.getElementById('alertContainer');
        const alertDiv = document.createElement('div');
        
        const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
        
        alertDiv.className = `${bgColor} text-white px-6 py-4 rounded-lg shadow-lg mb-4 transform transition-all duration-300`;
        alertDiv.innerHTML = `
            <div class="flex items-center justify-between">
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white hover:text-gray-200">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        alertContainer.appendChild(alertDiv);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 5000);
    }

    // Utility method for making authenticated API calls
    async makeAuthenticatedRequest(url, options = {}) {
        const headers = {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json',
            ...options.headers
        };

        const response = await fetch(url, {
            ...options,
            headers
        });

        if (response.status === 401) {
            this.clearAuthData();
            window.location.href = '/';
            return null;
        }

        return response;
    }
}

// Initialize auth manager
const authManager = new AuthManager();

// Check if user is already logged in and redirect
if (authManager.token && authManager.user) {
    authManager.redirectToDashboard(authManager.user.role);
}
