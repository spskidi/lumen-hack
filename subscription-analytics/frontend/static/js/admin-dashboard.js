// Admin Dashboard functionality
class AdminDashboard {
    constructor() {
        this.token = localStorage.getItem('token');
        this.user = JSON.parse(localStorage.getItem('user') || 'null');
        this.apiUsageChart = null;
        this.userSegmentsChart = null;
        
        if (!this.token || !this.user || this.user.role !== 'admin') {
            window.location.href = '/';
            return;
        }
        
        this.initializeEventListeners();
        this.loadDashboardData();
    }

    initializeEventListeners() {
        document.getElementById('logoutBtn').addEventListener('click', () => this.logout());
        document.getElementById('refreshPredictions').addEventListener('click', () => this.loadRenewalPredictions());
        document.getElementById('userSearch').addEventListener('input', (e) => this.filterUsers(e.target.value));
        document.getElementById('exportUsers').addEventListener('click', () => this.exportUsers());
        document.getElementById('closeModal').addEventListener('click', () => this.closeUserModal());
    }

    async loadDashboardData() {
        this.displayAdminWelcome();
        await Promise.all([
            this.loadAnalytics(),
            this.loadRenewalPredictions(),
            this.loadAllUsers()
        ]);
    }

    displayAdminWelcome() {
        document.getElementById('adminWelcome').textContent = `Welcome, ${this.user.username}!`;
    }

    async loadAnalytics() {
        try {
            const response = await this.makeAuthenticatedRequest('/api/admin/analytics?days=30');
            if (!response) return;
            
            const data = await response.json();
            this.displayOverviewCards(data.overview);
            this.createCharts(data);
        } catch (error) {
            this.showAlert('Failed to load analytics data', 'error');
        }
    }

    displayOverviewCards(overview) {
        document.getElementById('totalUsers').textContent = overview.total_users.toLocaleString();
        document.getElementById('activeUsers').textContent = overview.active_users.toLocaleString();
        document.getElementById('monthlyRevenue').textContent = `$${overview.total_monthly_revenue.toLocaleString()}`;
        document.getElementById('avgRevenue').textContent = `$${overview.average_revenue_per_user.toFixed(2)}`;
    }


    async loadRenewalPredictions() {
        const container = document.getElementById('renewalPredictions');
        container.innerHTML = `
            <div class="flex justify-center items-center py-8">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                <span class="ml-2 text-gray-600">Analyzing renewal likelihood...</span>
            </div>
        `;

        try {
            const response = await this.makeAuthenticatedRequest('/api/admin/renewal-predictions');
            if (!response) return;
            
            const data = await response.json();
            this.displayRenewalPredictions(data.analysis);
        } catch (error) {
            container.innerHTML = `
                <div class="text-center py-8 text-red-600">
                    <i class="fas fa-exclamation-triangle text-2xl mb-2"></i>
                    <p>Failed to load renewal predictions</p>
                </div>
            `;
        }
    }

    displayRenewalPredictions(analysis) {
        const container = document.getElementById('renewalPredictions');
        
        if (!analysis || analysis.error) {
            container.innerHTML = `
                <div class="text-center py-8 text-red-600">
                    <i class="fas fa-exclamation-triangle text-2xl mb-2"></i>
                    <p>Failed to analyze renewal predictions</p>
                </div>
            `;
            return;
        }

        // Display overall metrics
        let html = '';
        if (analysis.overall_metrics) {
            const metrics = analysis.overall_metrics;
            html += `
                <div class="grid md:grid-cols-4 gap-4 mb-6">
                    <div class="bg-blue-50 p-4 rounded-lg text-center">
                        <div class="text-2xl font-bold text-blue-600">${Math.round(metrics.average_renewal_likelihood * 100)}%</div>
                        <div class="text-sm text-gray-600">Avg Renewal Rate</div>
                    </div>
                    <div class="bg-red-50 p-4 rounded-lg text-center">
                        <div class="text-2xl font-bold text-red-600">${metrics.high_risk_users || 0}</div>
                        <div class="text-sm text-gray-600">High Risk Users</div>
                    </div>
                    <div class="bg-green-50 p-4 rounded-lg text-center">
                        <div class="text-2xl font-bold text-green-600">${metrics.likely_renewals || 0}</div>
                        <div class="text-sm text-gray-600">Likely Renewals</div>
                    </div>
                    <div class="bg-gray-50 p-4 rounded-lg text-center">
                        <div class="text-2xl font-bold text-gray-600">${metrics.total_analyzed || 0}</div>
                        <div class="text-sm text-gray-600">Total Analyzed</div>
                    </div>
                </div>
            `;
        }

        // Display insights
        if (analysis.insights && analysis.insights.length > 0) {
            html += `
                <div class="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
                    <h4 class="font-semibold text-purple-800 mb-2">
                        <i class="fas fa-brain mr-2"></i>AI Insights
                    </h4>
                    <ul class="space-y-1">
                        ${analysis.insights.map(insight => `<li class="text-purple-700">• ${insight}</li>`).join('')}
                    </ul>
                </div>
            `;
        }

        container.innerHTML = html;

        // Update risk sections
        if (analysis.user_predictions) {
            this.displayRiskUsers(analysis.user_predictions);
        }
    }

    displayRiskUsers(predictions) {
        const highRiskUsers = predictions.filter(p => p.risk_level === 'high').slice(0, 5);
        const likelyRenewals = predictions.filter(p => p.risk_level === 'low').slice(0, 5);

        // High risk users
        const highRiskContainer = document.getElementById('highRiskUsers');
        if (highRiskUsers.length > 0) {
            highRiskContainer.innerHTML = highRiskUsers.map(user => `
                <div class="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div class="flex justify-between items-center">
                        <div>
                            <div class="font-medium text-gray-800">User ID: ${user.user_id}</div>
                            <div class="text-sm text-red-600">${Math.round(user.renewal_likelihood * 100)}% renewal chance</div>
                        </div>
                        <span class="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">HIGH RISK</span>
                    </div>
                    ${user.recommended_actions ? `
                        <div class="mt-2 text-xs text-gray-600">
                            Actions: ${user.recommended_actions.join(', ')}
                        </div>
                    ` : ''}
                </div>
            `).join('');
        } else {
            highRiskContainer.innerHTML = `
                <div class="text-center py-4 text-gray-600">
                    <i class="fas fa-check-circle text-green-500 mr-2"></i>
                    No high-risk users identified
                </div>
            `;
        }

        // Likely renewals
        const likelyRenewalsContainer = document.getElementById('likelyRenewals');
        if (likelyRenewals.length > 0) {
            likelyRenewalsContainer.innerHTML = likelyRenewals.map(user => `
                <div class="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div class="flex justify-between items-center">
                        <div>
                            <div class="font-medium text-gray-800">User ID: ${user.user_id}</div>
                            <div class="text-sm text-green-600">${Math.round(user.renewal_likelihood * 100)}% renewal chance</div>
                        </div>
                        <span class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">LIKELY</span>
                    </div>
                    ${user.key_factors ? `
                        <div class="mt-2 text-xs text-gray-600">
                            Factors: ${user.key_factors.join(', ')}
                        </div>
                    ` : ''}
                </div>
            `).join('');
        } else {
            likelyRenewalsContainer.innerHTML = `
                <div class="text-center py-4 text-gray-600">
                    <i class="fas fa-info-circle mr-2"></i>
                    No likely renewals identified
                </div>
            `;
        }
    }

    createCharts(data) {
        // Create API Usage Chart
        const apiCtx = document.getElementById('apiUsageChart').getContext('2d');
        if (this.apiUsageChart) {
            this.apiUsageChart.destroy();
        }

        // Sample data for demonstration
        const last7Days = Array.from({length: 7}, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            return date.toLocaleDateString();
        });

        this.apiUsageChart = new Chart(apiCtx, {
            type: 'line',
            data: {
                labels: last7Days,
                datasets: [{
                    label: 'API Calls',
                    data: [1200, 1900, 3000, 5000, 2000, 3000, 4500],
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        // Create User Segments Chart
        const segmentsCtx = document.getElementById('userSegmentsChart').getContext('2d');
        if (this.userSegmentsChart) {
            this.userSegmentsChart.destroy();
        }

        this.userSegmentsChart = new Chart(segmentsCtx, {
            type: 'doughnut',
            data: {
                labels: ['Power Users', 'Regular Users', 'Light Users', 'Inactive'],
                datasets: [{
                    data: [15, 35, 30, 20],
                    backgroundColor: [
                        'rgb(16, 185, 129)',
                        'rgb(59, 130, 246)',
                        'rgb(245, 158, 11)',
                        'rgb(239, 68, 68)'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    async loadAllUsers() {
        try {
            const response = await this.makeAuthenticatedRequest('/api/admin/users?include_usage=true');
            if (!response) return;
            
            const data = await response.json();
            this.allUsers = data.users;
            this.displayUsersTable(this.allUsers);
        } catch (error) {
            this.showAlert('Failed to load users data', 'error');
        }
    }

    displayUsersTable(users) {
        const tbody = document.getElementById('usersTableBody');
        
        if (!users || users.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="px-6 py-4 text-center text-gray-500">No users found</td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = users.map(user => `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10">
                            <div class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <i class="fas fa-user text-gray-600"></i>
                            </div>
                        </div>
                        <div class="ml-4">
                            <div class="text-sm font-medium text-gray-900">${user.username}</div>
                            <div class="text-sm text-gray-500">${user.email}</div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        ${user.current_plan || 'No Plan'}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    $${user.monthly_spend || 0}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${user.recent_usage?.last_login ? new Date(user.recent_usage.last_login).toLocaleDateString() : 'Never'}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                        ${user.is_active ? 'Active' : 'Inactive'}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onclick="adminDashboard.viewUserDetails(${user.id})" class="text-indigo-600 hover:text-indigo-900 mr-3">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button onclick="adminDashboard.editUser(${user.id})" class="text-blue-600 hover:text-blue-900">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    filterUsers(searchTerm) {
        if (!this.allUsers) return;
        
        const filtered = this.allUsers.filter(user => 
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.current_plan && user.current_plan.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        
        this.displayUsersTable(filtered);
    }

    async viewUserDetails(userId) {
        try {
            const response = await this.makeAuthenticatedRequest(`/api/admin/user/${userId}/detailed?days=30`);
            if (!response) return;
            
            const data = await response.json();
            this.showUserModal(data);
        } catch (error) {
            this.showAlert('Failed to load user details', 'error');
        }
    }

    showUserModal(userData) {
        const modal = document.getElementById('userDetailModal');
        const content = document.getElementById('userDetailContent');
        
        content.innerHTML = `
            <div class="grid md:grid-cols-2 gap-6">
                <div>
                    <h4 class="text-lg font-semibold mb-4">User Information</h4>
                    <div class="space-y-2 text-sm">
                        <div><strong>Username:</strong> ${userData.user.username}</div>
                        <div><strong>Email:</strong> ${userData.user.email}</div>
                        <div><strong>Plan:</strong> ${userData.user.current_plan || 'No Plan'}</div>
                        <div><strong>Monthly Spend:</strong> $${userData.user.monthly_spend || 0}</div>
                        <div><strong>Subscription Start:</strong> ${userData.user.subscription_start ? new Date(userData.user.subscription_start).toLocaleDateString() : 'N/A'}</div>
                    </div>
                </div>
                <div>
                    <h4 class="text-lg font-semibold mb-4">Recent Activity</h4>
                    <div class="space-y-2 text-sm">
                        <div><strong>Total API Calls:</strong> ${userData.usage_data.reduce((sum, u) => sum + u.api_calls, 0).toLocaleString()}</div>
                        <div><strong>Data Processed:</strong> ${userData.usage_data.reduce((sum, u) => sum + u.data_processed_gb, 0).toFixed(2)} GB</div>
                        <div><strong>Support Tickets:</strong> ${userData.usage_data.reduce((sum, u) => sum + u.support_tickets, 0)}</div>
                    </div>
                </div>
            </div>
            
            ${userData.recent_recommendations.length > 0 ? `
                <div class="mt-6">
                    <h4 class="text-lg font-semibold mb-4">Recent Recommendations</h4>
                    <div class="space-y-2">
                        ${userData.recent_recommendations.slice(0, 3).map(rec => `
                            <div class="bg-gray-50 p-3 rounded">
                                <div class="font-medium">${rec.title}</div>
                                <div class="text-sm text-gray-600">${rec.description}</div>
                                <div class="text-xs text-gray-500 mt-1">
                                    ${rec.confidence_score ? Math.round(rec.confidence_score * 100) + '% confidence' : ''}
                                    ${rec.potential_savings > 0 ? ` • $${rec.potential_savings} potential savings` : ''}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
        `;
        
        modal.classList.remove('hidden');
    }

    closeUserModal() {
        document.getElementById('userDetailModal').classList.add('hidden');
    }

    editUser(userId) {
        // Placeholder for edit functionality
        this.showAlert('Edit functionality coming soon', 'info');
    }

    exportUsers() {
        if (!this.allUsers) return;
        
        const csv = [
            ['Username', 'Email', 'Plan', 'Monthly Spend', 'Status', 'Created At'].join(','),
            ...this.allUsers.map(user => [
                user.username,
                user.email,
                user.current_plan || '',
                user.monthly_spend || 0,
                user.is_active ? 'Active' : 'Inactive',
                user.created_at ? new Date(user.created_at).toLocaleDateString() : ''
            ].join(','))
        ].join('\n');
        
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'users_export.csv';
        a.click();
        window.URL.revokeObjectURL(url);
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
        
        const bgColor = type === 'success' ? 'bg-green-500' : type === 'info' ? 'bg-blue-500' : 'bg-red-500';
        
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
let adminDashboard;
document.addEventListener('DOMContentLoaded', () => {
    adminDashboard = new AdminDashboard();
});
