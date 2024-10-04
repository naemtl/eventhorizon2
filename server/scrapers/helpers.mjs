export const monthMap = {
    'janvier': '01',
    'january': '01',
    'février': '02',
    'february': '02',
    'mars': '03',
    'march': '03',
    'avril': '04',
    'april': '04',
    'mai': '05',
    'may': '05',
    'juin': '06',
    'june': '06',
    'juillet': '07',
    'july': '07',
    'août': '08',
    'august': '08',
    'septembre': '09',
    'september': '09',
    'octobre': '10',
    'october': '10',
    'novembre': '11',
    'november': '11',
    'décembre': '12',
    'december': '12'
}

export const getOriginalId = (titleArray, dateShowTime) => `${titleArray.map(part => part.replace(/[^a-zA-Z0-9]/g, '')).join('')}${dateShowTime.toISOString()}`;

export const getUnformattedEvents =  async (url) => {
    try {
        const response = await fetch(url, {
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