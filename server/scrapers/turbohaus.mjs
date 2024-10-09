import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import { getUnformattedEvents } from "./helpers.mjs";

dayjs.extend(utc);

const getTurbohaus = async () => {

    // Turbohaus month param is {01-12}-{YYYY}

    const currentMonth = dayjs().format('MM');
    const nextMonth = dayjs().add(1, 'month').format('MM');
    const subsequentMonth = dayjs().add(2, 'month').format('MM');

    const additionalParams = {
        month: "10-2022",
        collectionId: "5514d06ce4b0cc915219770e",
    }

    const unformattedEvents = await getUnformattedEvents("https://www.turbohaus.com/api/events", additionalParams);
    
    const formattedEvents = unformattedEvents.map(event => {
        const {
            id,
            title,
            location,
            fullUrl,
            assetUrl,
            startDate,
          } = event;

          const rawDateShowTime = dayjs(startDate).format('YYYY-MM-DD HH:mm');
          const dateShowTime = dayjs.utc(rawDateShowTime).toISOString();

          const moreInfoLink = `https://www.turbohaus.com/events/${fullUrl}`
          
          return {
            originalId: id,
            title,
            dateShowTime,
            dateDoorTime: null,
            venue: location.addressTitle,
            address: location.addressLine1,
            price: null,
            image: assetUrl,
            ticketLink: null,
            moreInfoLink,
            source: "turbohaus",
          };
    });

    return formattedEvents
}

export { getTurbohaus };