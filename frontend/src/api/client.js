// API Service Layer for SentinelAssess
const API_BASE = 'http://localhost:8080/api/v1';

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers
    });

    if (!response.ok) {
      let errorMessage = `Request failed (HTTP ${response.status})`;
      try {
        const errJson = await response.json();
        errorMessage = errJson.message || errJson.error || errorMessage;
      } catch (_) {
        const errText = await response.text();
        if (errText) errorMessage = errText;
      }
      throw new Error(errorMessage);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    return await response.text();
  } catch (err) {
    // If backend is unreachable or throws a network error, provide informative error
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      throw new Error('Unable to connect to SentinelAssess backend server on port 8080.');
    }
    throw err;
  }
}

// Authentication Endpoints
export const authApi = {
  login: (credentials) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    }),
  register: (payload) =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
};

// Practice Arena Endpoints
export const practiceApi = {
  listQuestions: () => apiRequest('/practice/questions'),
  getQuestion: (id) => apiRequest(`/practice/questions/${id}`),
  runCode: (id, payload) =>
    apiRequest(`/practice/questions/${id}/run`, {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  submitCode: (id, userId, payload) =>
    apiRequest(`/practice/questions/${id}/submit?userId=${userId}`, {
      method: 'POST',
      body: JSON.stringify(payload)
    })
};

// Assessment Endpoints
export const assessmentApi = {
  listAssessments: () => apiRequest('/assessments'),
  getAssessment: (id) => apiRequest(`/assessments/${id}`),
  submitAssessment: (id, userId, payload) =>
    apiRequest(`/assessments/${id}/submit?userId=${userId}`, {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  getMySubmissions: (userId) =>
    apiRequest(`/assessments/submissions/my?userId=${userId}`)
};

// Admin Practice Management Endpoints
export const adminPracticeApi = {
  listAll: () => apiRequest('/practice/admin/questions'),
  createQuestion: (data) =>
    apiRequest('/practice/admin/questions', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  updateQuestion: (id, data) =>
    apiRequest(`/practice/admin/questions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
  deleteQuestion: (id) =>
    apiRequest(`/practice/admin/questions/${id}`, {
      method: 'DELETE'
    }),
  toggleActive: (id, value) =>
    apiRequest(`/practice/admin/questions/${id}/active?value=${value}`, {
      method: 'PATCH'
    }),
  addTestCase: (questionId, testCase) =>
    apiRequest(`/practice/admin/questions/${questionId}/test-cases`, {
      method: 'POST',
      body: JSON.stringify(testCase)
    })
};
