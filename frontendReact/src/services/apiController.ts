const api = {
    baseUrl: 'http://localhost:3000/',
    get: async (endpoint: string) => {
        const response = await fetch(`${api.baseUrl}${endpoint}`);
        if (!response.ok) {
        throw new Error('Network response was not ok');
        }
        return response.json();
    },
    post: async (endpoint: string, data: object) => {
        const response = await fetch(`${api.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        });
        if (!response.ok) {
        throw new Error('Network response was not ok');
        }
        return response.json();
    },
    put: async (endpoint: string, data: object) => {
        const response = await fetch(`${api.baseUrl}${endpoint}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        });
        if (!response.ok) {
        throw new Error('Network response was not ok');
        }
        return response.json();
    },
    delete: async (endpoint: string) => {
        const response = await fetch(`${api.baseUrl}${endpoint}`, {
        method: 'DELETE',
        });
        if (!response.ok) {
        throw new Error('Network response was not ok');
        }
        return response.json();
    },
}

export default api; 