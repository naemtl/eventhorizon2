import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';

import { getUnformattedEvents } from "../helpers/scrapeHelper.ts";
import { writeLog } from '../helpers/logHelper.ts';
import { FormattedEvent } from '../types/index';

dayjs.extend(utc);

interface Event {
  id: string;
  title: string;
  location: {
    addressTitle: string;
    addressLine1: string;
  };
  fullUrl: string;
  assetUrl: string;
  startDate: string;
}

const getTurbohaus = async (): Promise<FormattedEvent[]> => {
  try {
    // Turbohaus month param is {01-12}-{YYYY}
    const currentMonthYear = dayjs().format('MM-YYYY');    
    const nextMonthYear = dayjs().add(1, 'month').format('MM-YYYY');
    const subsequentMonthYear = dayjs().add(2, 'month').format('MM-YYYY');

    const getCalendarEvents = async (monthYear) => {
      const additionalParams = {
          month: monthYear,
          collectionId: "5514d06ce4b0cc915219770e",
      }
      const unformattedEvents: Event[] = await getUnformattedEvents(`https://www.turbohaus.ca/api/open/GetItemsByMonth?month=${additionalParams.month}&collectionId=${additionalParams.collectionId}`);

      return unformattedEvents.map(event => {
          const rawDateShowTime = dayjs(event.startDate).format('YYYY-MM-DD HH:mm');
          const preciseTime = !!rawDateShowTime;
          const dateShowTime = dayjs.utc(rawDateShowTime).toISOString();
          const moreInfoLink = `https://www.turbohaus.com/${event.fullUrl}`
          
          return {
              originalId: event.id,
              title: event.title,
              dateShowTime,
              dateDoorTime: null,
              preciseTime,
              venue: event.location.addressTitle,
              address: event.location.addressLine1,
              price: null,
              image: event.assetUrl,
              ticketLink: null,
              moreInfoLink,
              source: "turbohaus",
          };
        });
      }
    const currentMonthEvents = await getCalendarEvents(currentMonthYear);
    const nextMonthEvents = await getCalendarEvents(nextMonthYear);
    const subsequentMonthEvents = await getCalendarEvents(subsequentMonthYear);
    return [...currentMonthEvents, ...nextMonthEvents, ...subsequentMonthEvents]
  } catch (error) {
    writeLog({ error: error.message, source: "turbohaus" });
    return [];
  }
}

export { getTurbohaus };