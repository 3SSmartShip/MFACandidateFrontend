import apiClient from '../axios';

export const getCandidateOrgs = async () => {
  return await apiClient.get('/candidate/orgs');
};
