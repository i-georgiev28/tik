// src/context/RobotContext.tsx

import React, { createContext, useState, useContext, useEffect } from 'react';
import { createRobot, updateRobotBattery, getRobots } from '../services/robotService';
import { getAlarms as fetchAlarms } from '../services/alarmService';

interface RobotContextType {
  robots: any[]; // Adjust based on robot structure
  createRobot: (robotData: { battery?: number }) => Promise<any> | void;
  updateBattery: (robotId: string, battery: number) => Promise<any> | void;
  getAlarms: (robotId: string) => Promise<any>;
}

const RobotContext = createContext<RobotContextType | undefined>(undefined);

export const RobotProvider = ({ children }: { children: React.ReactNode }) => {
  const [robots, setRobots] = useState<any[]>([]); // Robots state

  const createRobotHandler = async (robotData: { battery?: number }) => {
    try {
      const newRobot = await createRobot(robotData);
      setRobots((prevRobots) => [...prevRobots, newRobot]);
      return newRobot;
    } catch (err) {
      console.warn('createRobot error', err);
      throw err;
    }
  };

  const updateBatteryHandler = async (robotId: string, battery: number) => {
    try {
      const updated = await updateRobotBattery(robotId, battery);
      setRobots((prevRobots) =>
        prevRobots.map((robot) => (robot.id === robotId ? { ...robot, battery } : robot))
      );
      return updated;
    } catch (err) {
      console.warn('updateBattery error', err);
      throw err;
    }
  };

  const getAlarmsHandler = async (robotId: string) => {
    try {
      const alarms = await fetchAlarms(robotId);
      return alarms;
    } catch (err) {
      console.warn('getAlarms error', err);
      return [];
    }
  };

  // Fetch initial robots on mount (mock / API list)
  useEffect(() => {
    const loadRobots = async () => {
      try {
        const list = await getRobots();
        setRobots(Array.isArray(list) ? list : []);
      } catch (err) {
        console.warn('Failed to load robots', err);
      }
    };
    loadRobots();
  }, []);


  return (
    <RobotContext.Provider value={{ robots, createRobot: createRobotHandler, updateBattery: updateBatteryHandler, getAlarms: getAlarmsHandler }}>
      {children}
    </RobotContext.Provider>
  );
};

export const useRobotContext = (): RobotContextType => {
  const context = useContext(RobotContext);
  if (!context) {
    throw new Error("useRobotContext must be used within a RobotProvider");
  }
  return context;
};
