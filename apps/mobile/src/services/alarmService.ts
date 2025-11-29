import { fetchData, postData, putData } from './apiService';

export const createAlarm = async (alarmData: { robotId: string, tag: string, time: string, enabled?: boolean, days: { [key: string]: boolean } }) => {
  return postData('/alarms', alarmData);
};

export const updateAlarm = async (alarmId: string, enabled: boolean) => {
  return putData(`/alarms/${alarmId}`, { enabled });
};

export const getAlarms = async (robotId: string) => {
  return fetchData(`/robots/${robotId}/alarms`);
};
export const streamAlarms = (robotId: string) => {
  return new EventSource(`/alarms/stream?robot_id=${robotId}`);
};
