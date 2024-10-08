import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';
import { getUnformattedEvents } from "./helpers.mjs";

dayjs.extend(utc);
dayjs.extend(timezone);

const getAskAPunk = async () => {
    const unformattedEvents = await getUnformattedEvents("https://montreal.askapunk.net/api/events");
    
    const formattedEvents = unformattedEvents.map(event => {
       const {
        id,
        title,
        slug,
        start_datetime,
        media,
        place
      } = event;
      
      const rawDateShowTime = dayjs.unix(start_datetime)
      const dateShowTime = dayjs.utc(rawDateShowTime).tz('America/New_York').toISOString();

      const image = media ? media[0].url : null;
      const venue = place ? place.name : null;
      const address = place ? place.address : null;
      const cleanTitle = title.replace(/[^ -~]+/g, "/");
      
      return {
        originalId: id,
        title: cleanTitle,
        dateShowTime,
        dateDoorTime: null,
        venue,
        address,
        price: null,
        image,
        ticketLink: null,
        moreInfoLink: `https://montreal.askapunk.net/events/${slug}`,
        source: "askapunk"
      }
    });

    return formattedEvents;
}

export { getAskAPunk };