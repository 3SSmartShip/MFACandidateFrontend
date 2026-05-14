import apiClient from '../axios';

/**
 * POST /candidate/onboard
 * Candidate self-onboarding — link passport to org directory
 *
 * @param {Object} params
 * @param {string} params.inviteToken - Invitation token
 * @param {string} params.passportId - Passport ID
 * @param {string} params.fullName - Candidate's full name
 * @param {string} params.dateOfBirth - Date of birth (YYYY-MM-DD)
 * @returns {Promise<{directoryId: string, orgId: string}>}
 */
export const onboardCandidate = async ({ inviteToken, passportId, fullName, dateOfBirth }) => {
  return await apiClient.post('/candidate/onboard', {
    inviteToken,
    passportId,
    fullName,
    dateOfBirth,
  });
};
