
const getAskAPunk = async () => {

    const getUnformattedEvents =  async () => {
        try {
            const response = await fetch("https://montreal.askapunk.net/api/events", {
                method: "GET",
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Fetch error:", error);
        }
    }

    const unformattedEvents = await getUnformattedEvents();
    
    const processedEvents = unformattedEvents.map(event => {
        //
        console.log(event);
        
    })
}

getAskAPunk();