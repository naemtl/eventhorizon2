import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import { getUnformattedEvents } from "./helpers.ts";

dayjs.extend(utc);

const getRavewave = async () => {
    const unformattedEvents = await getUnformattedEvents("https://www.rave.ca/en/json/events");
    
    const formattedEvents = unformattedEvents.map(event => {

        const {
            id,
            link,
            date_start,
            name,
            location,
            flyers,
          } = event;

          const rawDateShowTime = dayjs(date_start).format('YYYY-MM-DD HH:mm');
          const dateShowTime = dayjs.utc(rawDateShowTime).toISOString();

          const image = flyers ? Object.entries(flyers)[0][1] : null;
          
          return {
            originalId: id,
            title: name,
            dateShowTime,
            dateDoorTime: null,
            venue: location,
            address: null,
            price: null,
            image,
            ticketLink: null,
            moreInfoLink: link,
            source: "ravewave",
        }
    })

   return formattedEvents;
}

export { getRavewave };