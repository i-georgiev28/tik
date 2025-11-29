export const RID = 'abc123'; // Your constant robot ID

export type Alarm = {
  id?: number;
  enabled: boolean;
  time: string; // Format: "HH:MM"
  tag: string;
  days: {
    mon: boolean;
    tue: boolean;
    wed: boolean;
    thu: boolean;
    fri: boolean;
    sat: boolean;
    sun: boolean;
  };
};