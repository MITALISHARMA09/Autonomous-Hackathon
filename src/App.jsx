import React, { useState, useEffect } from 'react';
import { FileText, Upload, Activity, TrendingUp, Clock, CheckCircle, AlertCircle, Users, Building2, Wallet, Database, Brain, Zap, X, LogOut } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function HealthRecordAIDashboard() {
  const [activeTab, setActiveTab] = useState('patient');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Mock data (in production, fetch from API)
  const patientRecords = [
    {
      id: 1,
      title: 'Cardiology Consultation',
      department: 'Cardiology',
      date: '2026-01-08',
      type: 'consultation',
      diagnosis: ['Hypertension', 'Atrial Fibrillation'],
      urgency: 'medium',
      medications: [
        { name: 'Metoprolol', dosage: '50mg', frequency: 'twice daily' },
        { name: 'Warfarin', dosage: '5mg', frequency: 'once daily' }
      ]
    },
    {
      id: 2,
      title: 'Lab Report - Complete Blood Count',
      department: 'Pathology',
      date: '2026-01-05',
      type: 'lab_report',
      diagnosis: ['Mild Anemia'],
      urgency: 'low',
      medications: [{ name: 'Iron Supplement', dosage: '325mg', frequency: 'once daily' }]
    },
    {
      id: 3,
      title: 'Emergency Visit - Chest Pain',
      department: 'Emergency',
      date: '2026-01-02',
      type: 'emergency',
      diagnosis: ['Acute Coronary Syndrome'],
      urgency: 'critical',
      medications: [
        { name: 'Aspirin', dosage: '81mg', frequency: 'once daily' },
        { name: 'Atorvastatin', dosage: '40mg', frequency: 'once daily' }
      ]
    }
  ];

  const claims = [
    {
      id: 1,
      claimNumber: 'CLM-A1B2C3D4',
      status: 'approved',
      amount: 45000,
      approvedAmount: 42000,
      complianceScore: 94,
      rejectionRisk: 0.12,
      submittedDate: '2026-01-07',
      approvedDate: '2026-01-09'
    },
    {
      id: 2,
      claimNumber: 'CLM-E5F6G7H8',
      status: 'under_review',
      amount: 28000,
      approvedAmount: null,
      complianceScore: 88,
      rejectionRisk: 0.25,
      submittedDate: '2026-01-08',
      approvedDate: null
    },
    {
      id: 3,
      claimNumber: 'CLM-I9J0K1L2',
      status: 'draft',
      amount: 15000,
      approvedAmount: null,
      complianceScore: 78,
      rejectionRisk: 0.45,
      submittedDate: null,
      approvedDate: null
    }
  ];

  const hospitalStats = {
    totalClaims: 156,
    pendingClaims: 42,
    approvedClaims: 98,
    rejectedClaims: 16,
    totalAmount: 6780000,
    approvedAmount: 5950000,
    avgProcessingTime: 18
  };

  const claimsByDepartment = [
    { department: 'Cardiology', claims: 35, amount: 1850000 },
    { department: 'Orthopedics', claims: 28, amount: 1420000 },
    { department: 'Neurology', claims: 22, amount: 1180000 },
    { department: 'General Medicine', claims: 45, amount: 980000 },
    { department: 'Emergency', claims: 26, amount: 1350000 }
  ];

  const claimTrend = [
    { month: 'Aug', submitted: 42, approved: 38, rejected: 4 },
    { month: 'Sep', submitted: 48, approved: 44, rejected: 4 },
    { month: 'Oct', submitted: 55, approved: 51, rejected: 4 },
    { month: 'Nov', submitted: 51, approved: 46, rejected: 5 },
    { month: 'Dec', submitted: 58, approved: 54, rejected: 4 },
    { month: 'Jan', submitted: 35, approved: 28, rejected: 2 }
  ];

  const statusDistribution = [
    { name: 'Approved', value: 98 },
    { name: 'Pending', value: 42 },
    { name: 'Rejected', value: 16 }
  ];

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // In production, make actual API call
      // const response = await fetch(`${API_URL}/api/auth/login`, {...});
      
      // Mock login for demo
      if (loginForm.email && loginForm.password) {
        setIsLoggedIn(true);
        setShowLogin(false);
        setCurrentUser({
          name: 'Dr. Rajesh Kumar',
          email: loginForm.email,
          role: 'patient',
          abhaId: '1234-5678-9012'
        });
      } else {
        setError('Please enter email and password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowLogin(true);
    setCurrentUser(null);
    setLoginForm({ email: '', password: '' });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          setTimeout(() => setUploadProgress(0), 1000);
        }
      }, 200);
    }
  };

  const getUrgencyColor = (urgency) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    };
    return colors[urgency] || colors.medium;
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      submitted: 'bg-blue-100 text-blue-800',
      under_review: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      settled: 'bg-purple-100 text-purple-800'
    };
    return colors[status] || colors.draft;
  };

  // Login Screen
  if (!isLoggedIn && showLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Brain className="w-12 h-12 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Health Record AI</h1>
            <p className="text-gray-600">Autonomous Intelligence for Healthcare</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="patient1@test.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-700 font-medium mb-2">Demo Credentials:</p>
            <div className="space-y-1 text-sm text-gray-600">
              <p>Email: patient1@test.com</p>
              <p>Password: test123</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Brain className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Health Record AI Agent</h1>
                <p className="text-sm text-gray-600">Autonomous Intelligence for Healthcare</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-green-100 px-3 py-1 rounded-full">
                <Zap className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">AI Active</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{currentUser?.name || 'Dr. Rajesh Kumar'}</p>
                <p className="text-xs text-gray-600">ABHA: {currentUser?.abhaId || '1234-5678-9012'}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-white rounded-lg shadow-sm p-1 flex space-x-1">
          <button
            onClick={() => setActiveTab('patient')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-md transition ${
              activeTab === 'patient' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="font-medium">Patient Dashboard</span>
          </button>
          <button
            onClick={() => setActiveTab('hospital')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-md transition ${
              activeTab === 'hospital' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Building2 className="w-5 h-5" />
            <span className="font-medium">Hospital Dashboard</span>
          </button>
          <button
            onClick={() => setActiveTab('insurer')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-md transition ${
              activeTab === 'insurer' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Wallet className="w-5 h-5" />
            <span className="font-medium">Insurer Dashboard</span>
          </button>
        </div>
      </div>

      {/* Patient Dashboard */}
      {activeTab === 'patient' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Records</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{patientRecords.length}</p>
                </div>
                <Database className="w-10 h-10 text-blue-500" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Claims</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{claims.filter(c => c.status !== 'draft').length}</p>
                </div>
                <FileText className="w-10 h-10 text-green-500" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Departments</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">5</p>
                </div>
                <Activity className="w-10 h-10 text-purple-500" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Processing</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">12d</p>
                </div>
                <Clock className="w-10 h-10 text-orange-500" />
              </div>
            </div>
          </div>

          {/* Upload Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Upload className="w-5 h-5 mr-2 text-blue-600" />
              Upload Health Record
            </h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition cursor-pointer">
              <input
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                id="fileUpload"
                accept=".pdf,.docx,.png,.jpg"
              />
              <label htmlFor="fileUpload" className="cursor-pointer">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-700 font-medium">Click to upload or drag and drop</p>
                <p className="text-sm text-gray-500 mt-1">PDF, DOCX, PNG, JPG (Max 10MB)</p>
              </label>
              {uploadProgress > 0 && (
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-2">Processing with AI... {uploadProgress}%</p>
                </div>
              )}
            </div>
          </div>

          {/* Health Records */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Your Health Records</h3>
              <p className="text-sm text-gray-600 mt-1">AI-organized by department</p>
            </div>
            <div className="divide-y divide-gray-200">
              {patientRecords.map((record) => (
                <div
                  key={record.id}
                  className="p-6 hover:bg-gray-50 transition cursor-pointer"
                  onClick={() => setSelectedRecord(selectedRecord?.id === record.id ? null : record)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h4 className="text-base font-semibold text-gray-900">{record.title}</h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getUrgencyColor(record.urgency)}`}>
                          {record.urgency.toUpperCase()}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Activity className="w-4 h-4 mr-1" />
                          {record.department}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {new Date(record.date).toLocaleDateString()}
                        </span>
                      </div>
                      {selectedRecord?.id === record.id && (
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium text-gray-700 mb-2">Diagnosis</p>
                              <ul className="space-y-1">
                                {record.diagnosis.map((d, i) => (
                                  <li key={i} className="text-sm text-gray-900">• {d}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700 mb-2">Medications</p>
                              <ul className="space-y-1">
                                {record.medications.map((m, i) => (
                                  <li key={i} className="text-sm text-gray-900">
                                    • {m.name} - {m.dosage} ({m.frequency})
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <CheckCircle className={`w-5 h-5 ${selectedRecord?.id === record.id ? 'text-blue-600' : 'text-gray-400'}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Insurance Claims */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Insurance Claims</h3>
              <p className="text-sm text-gray-600 mt-1">Track your claim status in real-time</p>
            </div>
            <div className="divide-y divide-gray-200">
              {claims.map((claim) => (
                <div key={claim.id} className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-base font-semibold text-gray-900">{claim.claimNumber}</h4>
                      <p className="text-sm text-gray-600 mt-1">Submitted: {claim.submittedDate || 'Not submitted'}</p>
                    </div>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(claim.status)}`}>
                      {claim.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-gray-600">Claim Amount</p>
                      <p className="text-lg font-bold text-gray-900">₹{claim.amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Compliance Score</p>
                      <p className="text-lg font-bold text-green-600">{claim.complianceScore}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Rejection Risk</p>
                      <p className="text-lg font-bold text-orange-600">{(claim.rejectionRisk * 100).toFixed(0)}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">AI Status</p>
                      <div className="flex items-center mt-1">
                        <Brain className="w-4 h-4 text-blue-600 mr-1" />
                        <p className="text-sm font-medium text-blue-600">Optimized</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Hospital Dashboard */}
      {activeTab === 'hospital' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Hospital Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-600">Total Claims</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{hospitalStats.totalClaims}</p>
              <p className="text-xs text-green-600 mt-2">+12% from last month</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-600">Approval Rate</p>
              <p className="text-3xl font-bold text-green-600 mt-1">
                {((hospitalStats.approvedClaims / hospitalStats.totalClaims) * 100).toFixed(1)}%
              </p>
              <p className="text-xs text-green-600 mt-2">+5% improvement</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-600">Approved Amount</p>
              <p className="text-3xl font-bold text-blue-600 mt-1">₹{(hospitalStats.approvedAmount / 100000).toFixed(1)}L</p>
              <p className="text-xs text-gray-600 mt-2">Out of ₹{(hospitalStats.totalAmount / 100000).toFixed(1)}L</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-600">Avg Processing</p>
              <p className="text-3xl font-bold text-purple-600 mt-1">{hospitalStats.avgProcessingTime}d</p>
              <p className="text-xs text-green-600 mt-2">-30% vs industry avg</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Claim Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={claimTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="submitted" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="approved" stroke="#10b981" strokeWidth={2} />
                  <Line type="monotone" dataKey="rejected" stroke="#ef4444" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Department Performance */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Claims by Department</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={claimsByDepartment}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="claims" fill="#3b82f6" name="Number of Claims" />
                <Bar yAxisId="right" dataKey="amount" fill="#10b981" name="Amount (₹)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Insurer Dashboard */}
      {activeTab === 'insurer' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Claims Review</h3>
            <p className="text-gray-600 mb-6">AI-assisted claim validation and processing</p>
            <div className="space-y-4">
              {claims.filter(c => c.status === 'under_review' || c.status === 'submitted').map((claim) => (
                <div key={claim.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">{claim.claimNumber}</h4>
                      <p className="text-sm text-gray-600">Amount: ₹{claim.amount.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <Brain className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-600">AI Score: {claim.complianceScore}%</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Rejection Risk: {(claim.rejectionRisk * 100).toFixed(0)}%</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition text-sm font-medium">
                      Approve
                    </button>
                    <button className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition text-sm font-medium">
                      Request Info
                    </button>
                    <button className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition text-sm font-medium">
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Insights */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow p-6 text-white">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Brain className="w-6 h-6 mr-2" />
              AI-Powered Insights
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <p className="text-sm opacity-90">Fraud Detection</p>
                <p className="text-2xl font-bold mt-1">3 Flagged</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <p className="text-sm opacity-90">Auto-Approved</p>
                <p className="text-2xl font-bold mt-1">45 Claims</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <p className="text-sm opacity-90">Time Saved</p>
                <p className="text-2xl font-bold mt-1">280 hrs</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}