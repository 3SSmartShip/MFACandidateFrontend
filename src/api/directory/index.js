import apiClient from '../axios';

export const getDirectory = async (orgId) => {
  return await apiClient.get(`/candidate/orgs/${orgId}/directory`);
};
