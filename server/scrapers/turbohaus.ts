import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';

import { getUnformattedEvents } from "../helpers/scrapeHelper.ts";

dayjs.extend(utc);

const getTurbohaus = async () => {

    // Turbohaus month param is {01-12}-{YYYY}

    const currentMonthYear = dayjs().format('MM-YYYY');    
    const nextMonthYear = dayjs().add(1, 'month').format('MM-YYYY');
    const subsequentMonthYear = dayjs().add(2, 'month').format('MM-YYYY');
    const getCalendarEvents = async (monthYear) => {

        const additionalParams = {
            month: monthYear,
            collectionId: "5514d06ce4b0cc915219770e",
        }

        const unformattedEvents = await getUnformattedEvents(`https://www.turbohaus.ca/api/open/GetItemsByMonth?month=${additionalParams.month}&collectionId=${additionalParams.collectionId}`);

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

            const moreInfoLink = `https://www.turbohaus.com/${fullUrl}`
            
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

    const currentMonthEvents = await getCalendarEvents(currentMonthYear);
    const nextMonthEvents = await getCalendarEvents(nextMonthYear);
    const subsequentMonthEvents = await getCalendarEvents(subsequentMonthYear);
    
    const events = [...currentMonthEvents, ...nextMonthEvents, ...subsequentMonthEvents]

    return events;
}

export { getTurbohaus };