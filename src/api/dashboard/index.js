import apiClient from '../axios';

/**
 * GET /candidate/orgs/{orgId}/documents
 * List candidate's own documents for this org
 *
 * @param {string} orgId - Organization UUID
 * @returns {Promise<Array<{id: string, documentType: string, status: string, confidenceScore: number, version: number, isLatest: boolean, createdAt: string}>>}
 */
export const getDocuments = async (orgId) => {
  return await apiClient.get(`/candidate/orgs/${orgId}/documents`);
};

/**
 * POST /candidate/orgs/{orgId}/documents
 * Upload documents for this org (multipart, max 6 PDFs)
 *
 * @param {string} orgId - Organization UUID
 * @param {FormData} formData - FormData with PDF files (max 6)
 * @returns {Promise<{batchId: string, docs: Array<{id: string}>}>}
 */
export const uploadDocuments = async (orgId, formData) => {
  return await apiClient.post(`/candidate/orgs/${orgId}/documents`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
