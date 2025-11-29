import { fetchData, postData, putData } from './apiService';

export const createRobot = async (robotData: { id?: string, battery?: number }) => {
  return postData('/robots', robotData);
};

export const updateRobotBattery = async (robotId: string, battery: number) => {
  return putData(`/robots/${robotId}`, { battery });
};

export const getRobots = async () => {
  return fetchData('/robots');
};