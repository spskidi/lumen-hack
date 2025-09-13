// User Dashboard functionality
class UserDashboard {
    constructor() {
        this.token = localStorage.getItem('token');
        this.user = JSON.parse(localStorage.getItem('user') || 'null');
        this.usageChart = null;
        
        if (!this.token || !this.user) {
            window.location.href = '/';
            return;
        }
        
        this.initializeEventListeners();
        this.loadDashboardData();
    }

    initializeEventListeners() {
        document.getElementById('logoutBtn').addEventListener('click', () => this.logout());
        document.getElementById('refreshRecommendations').addEventListener('click', () => this.loadRecommendations());
    }

    async loadDashboardData() {
        this.displayUserWelcome();
        await Promise.all([
            this.loadUserProfile(),
            this.loadRecommendations(),
            this.loadUsageData()
        ]);
    }

    displayUserWelcome() {
        document.getElementById('userWelcome').textContent = `Welcome, ${this.user.username}!`;
    }

    async loadUserProfile() {
        try {
            const response = await this.makeAuthenticatedRequest(`/api/user/profile?user_id=${this.user.id}`);
            if (!response) return;
            
            const data = await response.json();
            this.displayUserProfile(data);
        } catch (error) {
            this.showAlert('Failed to load profile data', 'error');
        }
    }

    displayUserProfile(profile) {
        const profileContainer = document.getElementById('userProfile');
        profileContainer.innerHTML = `
            <div class="text-center">
                <div class="text-2xl font-bold text-blue-600">${profile.current_plan || 'No Plan'}</div>
                <div class="text-sm text-gray-600">Current Plan</div>
            </div>
            <div class="text-center">
                <div class="text-2xl font-bold text-green-600">$${profile.monthly_spend || 0}</div>
                <div class="text-sm text-gray-600">Monthly Spend</div>
            </div>
            <div class="text-center">
                <div class="text-2xl font-bold text-purple-600">
                    ${profile.subscription_start ? Math.floor((new Date() - new Date(profile.subscription_start)) / (1000 * 60 * 60 * 24)) : 0}
                </div>
                <div class="text-sm text-gray-600">Days Subscribed</div>
            </div>
        `;
    }

    async loadRecommendations() {
        const container = document.getElementById('recommendationsContainer');
        container.innerHTML = `
            <div class="flex justify-center items-center py-8">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                <span class="ml-2 text-gray-600">Generating AI recommendations...</span>
            </div>
        `;

        try {
            const response = await this.makeAuthenticatedRequest(`/api/user/recommendations?user_id=${this.user.id}`);
            if (!response) return;
            
            const data = await response.json();
            this.displayRecommendations(data.recommendations);
        } catch (error) {
            container.innerHTML = `
                <div class="text-center py-8 text-red-600">
                    <i class="fas fa-exclamation-triangle text-2xl mb-2"></i>
                    <p>Failed to load recommendations. Please try again.</p>
                </div>
            `;
        }
    }

    displayRecommendations(recommendations) {
        const container = document.getElementById('recommendationsContainer');
        
        if (!recommendations || recommendations.length === 0) {
            container.innerHTML = `
                <div class="text-center py-8 text-gray-500">
                    <i class="fas fa-lightbulb text-4xl mb-4 text-purple-300"></i>
                    <p class="text-lg">No recommendations available at this time.</p>
                    <p class="text-sm mt-2">Check back soon for personalized insights.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = recommendations.map((rec, index) => `
            <div class="bg-white border-l-4 ${this.getRecommendationBorderColor(rec.type)} rounded-lg p-6 mb-4 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
                <div class="flex items-start justify-between mb-4">
                    <div class="flex items-center">
                        <div class="p-3 rounded-full ${this.getRecommendationBgColor(rec.type)} mr-4">
                            <i class="fas ${this.getRecommendationIcon(rec.type)} text-xl ${this.getRecommendationColor(rec.type)}"></i>
                        </div>
                        <div>
                            <h3 class="text-xl font-bold text-gray-800 mb-1">${rec.title}</h3>
                            <span class="text-sm text-gray-500 uppercase tracking-wide">${rec.type.replace('_', ' ')}</span>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 text-sm px-3 py-1 rounded-full font-medium">
                            ${Math.round(rec.confidence_score * 100)}% confidence
                        </div>
                        ${rec.potential_savings > 0 ? `<div class="text-green-600 font-bold text-lg mt-1">Save $${rec.potential_savings}/mo</div>` : ''}
                    </div>
                </div>
            </div>
        `).join('');
    }

    getRecommendationIcon(type) {
        const icons = {
            'plan_upgrade': 'arrow-up',
            'cost_optimization': 'piggy-bank',
            'feature_suggestion': 'lightbulb',
            'usage_improvement': 'chart-line'
        };
        return icons[type] || 'info-circle';
    }

    getRecommendationColor(type) {
        const colors = {
            'plan_upgrade': 'text-green-600',
            'cost_optimization': 'text-blue-600',
            'feature_suggestion': 'text-yellow-600',
            'usage_improvement': 'text-purple-600'
        };
        return colors[type] || 'text-gray-600';
    }

    getRecommendationBorderColor(type) {
        const colors = {
            'plan_upgrade': 'border-green-400',
            'cost_optimization': 'border-blue-400',
            'feature_suggestion': 'border-yellow-400',
            'usage_improvement': 'border-purple-400'
        };
        return colors[type] || 'border-gray-400';
    }

    getRecommendationBgColor(type) {
        const colors = {
            'plan_upgrade': 'bg-green-100',
            'cost_optimization': 'bg-blue-100',
            'feature_suggestion': 'bg-yellow-100',
            'usage_improvement': 'bg-purple-100'
        };
        return colors[type] || 'bg-gray-100';
    }

    async loadUsageData() {
        try {
            const response = await this.makeAuthenticatedRequest(`/api/user/usage?user_id=${this.user.id}&days=30`);
            if (!response) return;
            
            const data = await response.json();
            this.displayUsageOverview(data.summary);
            this.displayFeaturesUsed(data.summary.features_used);
            this.createUsageChart(data.daily_usage);
        } catch (error) {
            this.showAlert('Failed to load usage data', 'error');
        }
    }

    displayUsageOverview(summary) {
        const container = document.getElementById('usageOverview');
        container.innerHTML = `
            <div class="grid grid-cols-2 gap-4">
                <div class="bg-blue-50 p-4 rounded-lg">
                    <div class="text-2xl font-bold text-blue-600">${summary.total_api_calls.toLocaleString()}</div>
                    <p class="text-gray-700 text-lg leading-relaxed mb-4">${summary.description}</p>
                    <div class="bg-gray-50 rounded-lg p-3">
                        <p class="text-sm text-gray-600"><strong>Analysis:</strong> ${summary.reasoning}</p>
                    </div>
                    <div class="text-sm text-gray-600">API Calls</div>
                </div>
                <div class="bg-green-50 p-4 rounded-lg">
                    <div class="text-2xl font-bold text-green-600">${summary.total_data_processed_gb}GB</div>
                    <div class="text-sm text-gray-600">Data Processed</div>
                </div>
                <div class="bg-purple-50 p-4 rounded-lg">
                    <div class="text-2xl font-bold text-purple-600">${Math.round(summary.average_session_duration_minutes)}min</div>
                    <div class="text-sm text-gray-600">Avg Session</div>
                </div>
                <div class="bg-orange-50 p-4 rounded-lg">
                    <div class="text-2xl font-bold text-orange-600">${summary.total_support_tickets}</div>
                    <div class="text-sm text-gray-600">Support Tickets</div>
                </div>
            </div>
        `;
    }

    displayFeaturesUsed(features) {
        const container = document.getElementById('featuresUsed');
        
        if (!features || features.length === 0) {
            container.innerHTML = `
                <div class="col-span-full text-center py-8 text-gray-600">
                    <i class="fas fa-info-circle text-2xl mb-2"></i>
                    <p>No features used yet.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = features.map(feature => `
            <div class="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-4">
                <div class="flex items-center">
                    <i class="fas fa-puzzle-piece text-orange-600 mr-2"></i>
                    <span class="font-medium text-gray-800">${feature}</span>
                </div>
            </div>
        `).join('');
    }

    createUsageChart(dailyUsage) {
        const ctx = document.getElementById('usageChart').getContext('2d');
        
        if (this.usageChart) {
            this.usageChart.destroy();
        }

        const dates = dailyUsage.map(d => new Date(d.date).toLocaleDateString());
        const apiCalls = dailyUsage.map(d => d.api_calls);
        const dataProcessed = dailyUsage.map(d => d.data_processed_gb);

        this.usageChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: 'API Calls',
                    data: apiCalls,
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    yAxisID: 'y'
                }, {
                    label: 'Data Processed (GB)',
                    data: dataProcessed,
                    borderColor: 'rgb(16, 185, 129)',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    yAxisID: 'y1'
                }]
            },
            options: {
                responsive: true,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    },
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'API Calls'
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Data Processed (GB)'
                        },
                        grid: {
                            drawOnChartArea: false,
                        },
                    }
                }
            }
        });
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
    }

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
            this.logout();
            return null;
        }

        return response;
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
        
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 5000);
    }
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', () => {
    new UserDashboard();
});
