import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

import { getUnformattedEvents } from "../helpers/scrapeHelper.ts";
import { writeLog } from '../helpers/logHelper.ts';
import { FormattedEvent } from '../types';

dayjs.extend(utc);
dayjs.extend(timezone);

interface Event {
  id: string;
  title: string;
  start_datetime: number;
  place: {
    name: string;
    address: string;
  } | null;
  media: {
    url: string;
  }[] | null;
  slug: string | null;
}

const getAskAPunk = async (): Promise<FormattedEvent[]> => {
  try {
    const unformattedEvents: Event[] = await getUnformattedEvents("https://montreal.askapunk.net/api/events");

    return unformattedEvents.map(event => {
      const rawDateShowTime = dayjs.unix(event.start_datetime)
      const preciseTime = !!rawDateShowTime;
      const dateShowTime = dayjs.utc(rawDateShowTime).tz('America/New_York').toISOString();

      const cleanTitle = event.title.replace(/[^ -~]+/g, "/");
      const venue = event.place?.name ?? null;
      const address = event.place?.address ?? null;
      const image = event.media?.[0]?.url ? `https://montreal.askapunk.net/media/${event.media[0].url}` : null;
      const moreInfoLink = event.slug ? `https://montreal.askapunk.net/events/${event.slug}` : null;

      return {
        originalId: event.id,
        title: cleanTitle,
        dateShowTime,
        dateDoorTime: null,
        preciseTime,
        venue,
        address,
        price: null,
        image,
        ticketLink: null,
        moreInfoLink,
        source: "askapunk"
      }
    });
  } catch (error) {
    writeLog({ error: error.message, source: "askapunk" });
    return [];
  }
}

export { getAskAPunk };