import apiClient from '../axios';

export const getDocuments = async (orgId, params = {}) => {
  return await apiClient.get(`/candidate/orgs/${orgId}/documents`, { params });
};

export const uploadDocuments = async (orgId, formData) => {
  return await apiClient.post(`/candidate/orgs/${orgId}/documents`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const getDocumentUrl = async (orgId, docId) => {
  return await apiClient.get(`/candidate/orgs/${orgId}/documents/${docId}/url`);
};

export const getDocumentDetail = async (orgId, docId) => {
  return await apiClient.get(`/candidate/orgs/${orgId}/documents/${docId}`);
};
