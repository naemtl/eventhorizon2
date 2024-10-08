import puppeteer from "puppeteer";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';
import { getOriginalId, monthMap } from './helpers.mjs';

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

const getCasa = async () => {
    
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null
    })
    const page = await browser.newPage();

    await page.setRequestInterception(true);

    page.on('request', (request) => {
      if (request.resourceType() === 'stylesheet' || request.resourceType() === 'image') {
        request.abort();
      } else {
        request.continue();
      }
    });

    await page.goto("https://casadelpopolo.com/en", {
        waitUntil: "domcontentloaded",
    });

    const unformattedEvents = await page.evaluate(() => {
        const eventList = document.querySelectorAll(".flex.flex-col.md\\:flex-row-reverse");
    
        return Array.from(eventList).map((quote) => {
            const dateElement = quote.querySelector('div.heading.text-2xl.mb-2')
            const rawDate = dateElement ? dateElement.innerText.trim() : null;
            
            const titleElement = quote.querySelector('div.heading.text-4xl.mb-2');
            const title = titleElement ? titleElement.innerText.trim() : null;
            
            const venueElement = quote.querySelector('[class="md:w-5/12 p-6"] > div:nth-of-type(3) > div.heading');
            const venue = venueElement ? venueElement.innerText.trim() : null;
            
            const addressElement = quote.querySelector('[class="md:w-5/12 p-6"] > div:nth-of-type(3) > div:nth-of-type(2)');
            const address = addressElement ? addressElement.innerText.trim() : null;
            
            const timeElement = quote.querySelector('[class="md:w-5/12 p-6"] > div:nth-of-type(4)');
            const rawTime = timeElement ? timeElement.innerText.trim() : null;
            
            const priceElement = quote.querySelector('[class="md:w-5/12 p-6"] > div.mb-4');
            const price = priceElement ? priceElement.innerText.trim() : null;
            
            const imgElement = quote.querySelector('a img');
            const image = imgElement ? imgElement.src : null;

            const ticketLinkElement = quote.querySelector('a.btn.btn-inverse');
            const ticketLink = ticketLinkElement ? ticketLinkElement.getAttribute('href') : null;

            return {
              rawDate,
              title,
              venue,
              address,
              rawTime,
              price,
              image,
              ticketLink,
            };
        })
    })

    return unformattedEvents.map(event => {
        const {
            rawDate,
            title,
            venue,
            address,
            rawTime,
            price,
            image,
            ticketLink
        } = event;

        const [rawMonth, rawDay, rawYear] = rawDate.replace(/,/g, '').split(' ').slice(1);
        
        const day = parseInt(rawDay);
        const month = parseInt(monthMap[rawMonth.toLowerCase()]);
        const year = parseInt(rawYear);

        const rawShowTime = rawTime.split(' ').slice(0, -1).join(' '); 

        const [showHour, showMin] = dayjs(rawShowTime, "h:mm A").format("HH:mm").split(':');
        
        const dateShowTime = dayjs.utc(`${year}-${month}-${day} ${showHour}:${showMin}`).tz('America/New_York').toISOString();     

        const originalId = getOriginalId(title.split(' '), dateShowTime);

        return {
            originalId,
            title,
            dateShowTime,
            dateDoorTime: null,
            venue,
            address,
            price,
            image,
            ticketLink,
            moreInfoLink: null, // TODO: add moreInfoLink
            source: 'casadelpopolo'
        }
    });
}

export { getCasa };