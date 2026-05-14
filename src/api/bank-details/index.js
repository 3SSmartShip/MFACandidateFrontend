import apiClient from '../axios';

/**
 * POST /candidate/orgs/{orgId}/bank-details
 * Create bank details for this org
 *
 * @param {string} orgId - Organization UUID
 * @param {Object} data
 * @param {string} data.bankName
 * @param {string} data.accountHolderName
 * @param {string} data.accountNumber
 * @param {string} data.swiftCode
 * @param {string} data.ifscCode
 * @param {string} data.bankCountry
 * @param {string} data.currency
 * @returns {Promise<Object>} Created bank details
 */
export const createBankDetails = async (orgId, data) => {
  return await apiClient.post(`/candidate/orgs/${orgId}/bank-details`, data);
};

/**
 * PATCH /candidate/orgs/{orgId}/bank-details
 * Update caller's bank details for this org
 *
 * @param {string} orgId - Organization UUID
 * @param {Object} data - Partial bank details to update
 * @returns {Promise<Object>} Updated bank details
 */
export const updateBankDetails = async (orgId, data) => {
  return await apiClient.patch(`/candidate/orgs/${orgId}/bank-details`, data);
};

/**
 * DELETE /candidate/orgs/{orgId}/bank-details
 * Delete caller's bank details for this org
 *
 * @param {string} orgId - Organization UUID
 * @returns {Promise<string>}
 */
export const deleteBankDetails = async (orgId) => {
  return await apiClient.delete(`/candidate/orgs/${orgId}/bank-details`);
};
