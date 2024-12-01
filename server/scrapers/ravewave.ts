import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';

import { getUnformattedEvents } from "../helpers/scrapeHelper.ts";
import { writeLog } from '../helpers/logHelper.ts';
import { FormattedEvent } from '../types/index';

dayjs.extend(utc);

interface Event {
  id: string;
  link: string;
  date_start: string;
  name: string;
  location: string;
  flyers: {
    [key: string]: string;
  };
}

const getRavewave = async (): Promise<FormattedEvent[]> => {
  try {
    const unformattedEvents: Event[] = await getUnformattedEvents("https://www.rave.ca/en/json/events");
    
    return unformattedEvents.map(event => {
      const rawDateShowTime = dayjs(event.date_start).format('YYYY-MM-DD HH:mm');
      const preciseTime = !!rawDateShowTime;
      const dateShowTime = dayjs.utc(rawDateShowTime).toISOString();

      const image = event.flyers ? Object.entries(event.flyers)[0][1] : null;
        
      return {
        originalId: event.id,
        title: event.name,
        dateShowTime,
        dateDoorTime: null,
        preciseTime,
        venue: event.location,
        address: null,
        price: null,
        image,
        ticketLink: null,
        moreInfoLink: event.link,
        source: "ravewave",
      }
    })
  } catch (error) {
    writeLog({ error: error.message, source: "ravewave" });
    return []; 
  }
}

export { getRavewave };