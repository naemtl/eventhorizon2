import { getUnformattedEvents } from "./helpers.mjs";

const getRavewave = async () => {
    const unformattedEvents = await getUnformattedEvents("https://www.rave.ca/en/json/events");
    
    unformattedEvents.map(event => {
        //
        console.log(event);
        
    })
}

getRavewave();