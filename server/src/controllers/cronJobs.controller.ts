import { schedule, ScheduledTask } from 'node-cron';

import { loadCurrencies, loadAirports } from '../models/cronJobs.model.js';
import { errorLogger, UnknownError } from '../middleware/errorHandler.js';

const FLIGHT_DATA_SCHEDULE = `* * 12 * * *`;

export const initCronJobs = async () => {
  const jobFlightDataUpdate: ScheduledTask = await schedule(
    FLIGHT_DATA_SCHEDULE,
    async () => {
      try {
        await loadCurrencies();
        console.log('Currencies loaded');
        await loadAirports();
        console.log('Airports loaded');
      } catch (err) {
        errorLogger(new UnknownError(<Error>err));
      }
    }
  );
  jobFlightDataUpdate.start();
  console.log('Cron schedule initialized');
};
