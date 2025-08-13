// Fonction utilitaire pour les appels API admin
export const adminApiCall = async (url: string, options: RequestInit = {}) => {
  const defaultOptions: RequestInit = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  return fetch(url, defaultOptions);
};

// Fonction pour les appels GET
export const adminApiGet = (url: string) => adminApiCall(url);

// Fonction pour les appels POST
export const adminApiPost = (url: string, data: Record<string, unknown>) => 
  adminApiCall(url, {
    method: 'POST',
    body: JSON.stringify(data),
  });

// Fonction pour les appels PUT
export const adminApiPut = (url: string, data: Record<string, unknown>) => 
  adminApiCall(url, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

// Fonction pour les appels DELETE
export const adminApiDelete = (url: string) => 
  adminApiCall(url, {
    method: 'DELETE',
  });
