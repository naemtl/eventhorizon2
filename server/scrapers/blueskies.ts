import puppeteer, { Browser, Page } from "puppeteer";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';
import { getOriginalId, monthMap } from './helpers.ts';
import { FormattedEvent } from '../types';

dayjs.extend(utc);
dayjs.extend(timezone);

interface Event {
    doorShowTime: string;
    dateFrench: string;
    title: string;
    venue: string | null;
    address: string | null;
    image: string | null;
    ticketLink: string | null;
}

const formatDoorShowTime = (time: string) => time.match(/(\d{2}h\d{2})/gi)?.map(time => time.replace(/[Hh]/, ':'));

const getBlueSkies = async (): Promise<FormattedEvent[]> => {
  try {
    const browser: Browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null
    })
    const page: Page = await browser.newPage();

    await page.setRequestInterception(true);

    page.on('request', (request) => {
      if (request.resourceType() === 'stylesheet' || request.resourceType() === 'image') {
        request.abort();
      } else {
        request.continue();
      }
    });

    await page.goto("https://www.blueskiesturnblack.com/", {
        waitUntil: "domcontentloaded",
    });

    const unformattedEvents: Event[] = await page.evaluate(() => {
        const eventList = document.querySelectorAll("article.eventlist-event.eventlist-event--upcoming");
    
        return Array.from(eventList).map((quote) => {
            const dateFrench = quote.querySelector<HTMLAnchorElement>('h1.eventlist-title a')?.innerText.trim() || ''; // TODO: add error logging to DB
            const doorShowTime = quote.querySelector<HTMLParagraphElement>('.col.sqs-col-12.span-12 > div:nth-of-type(2) .sqs-html-content p:nth-of-type(4)')?.innerText.trim() || ''; // TODO: add error logging to DB
            
            const titleContainer = quote.querySelector<HTMLDivElement>('.col.sqs-col-12.span-12 > div:nth-of-type(1)');
            const titleHeadings = titleContainer?.querySelectorAll<HTMLHeadingElement>('h1, h2, h3, h4, h5, h6');
            const concatenatedTexts: string[] = [];

            titleHeadings?.forEach(heading => {
                let concatenatedText = '';

                heading.childNodes.forEach(child => {
                    if (child.nodeType === Node.ELEMENT_NODE || child.nodeType === Node.TEXT_NODE) {
                        const text = (child as HTMLElement).innerText || (child as HTMLElement).textContent;
                        if (text) {
                            concatenatedText += text.trim() + ' + ';
                        }
                    }
                });

                concatenatedText = concatenatedText.slice(0, -3);
                concatenatedTexts.push(concatenatedText);
            });
            const title = concatenatedTexts.join(' + ');

            const venueAddressContainer = quote.querySelector('.col.sqs-col-12.span-12 > div:nth-of-type(2) .sqs-html-content p:nth-of-type(2) > strong');
            const venue = venueAddressContainer ? (venueAddressContainer as HTMLElement).innerText.trim() : null;
            
            const address = venueAddressContainer ? (venueAddressContainer.nextSibling as HTMLElement).innerText?.trim().replace(/^-+\s*/, '').trim() : null;
            
            const imgElement = quote.querySelector<HTMLImageElement>('a.eventlist-column-thumbnail img');
            const image = imgElement ? imgElement.src : null;
            
            const ticketLinkElement = quote.querySelector<HTMLAnchorElement>('.row.sqs-row > .col.sqs-col-2.span-2 a');
            const ticketLink = ticketLinkElement ? ticketLinkElement.getAttribute('href') : null;

            return {
              doorShowTime,
              dateFrench,
              title,
              venue,
              address,
              image,
              ticketLink,
            };
        })
    });

    return unformattedEvents.map((event) => {
        
        const { 
            doorShowTime,
            dateFrench,
            title,
            venue,
            address,
            image,
            ticketLink 
        } = event;
        
        const [rawDay, rawMonth, rawYear] = dateFrench.split(' ')
        const day = parseInt(rawDay);
        const month = parseInt(monthMap[rawMonth.toLowerCase()]);
        const year = parseInt(rawYear);

        const formattedDoorShowTime = formatDoorShowTime(doorShowTime);
        const preciseTime = !!formattedDoorShowTime;
        const [ doorTime, showTime ] = formattedDoorShowTime || ["00:00", "00:00"];
        const [doorHour, doorMin] = doorTime.split(':').map(Number);
        const [showHour, showMin] = showTime.split(':').map(Number);

        const dateDoorTime = dayjs.utc(`${year}-${month}-${day} ${doorHour}:${doorMin}`).tz('America/New_York').toISOString();
        const dateShowTime = dayjs.utc(`${year}-${month}-${day} ${showHour}:${showMin}`).tz('America/New_York').toISOString();
        
        
        const originalId = getOriginalId(title.split(' + '), dateShowTime);

        return {
            originalId,
            title,
            dateShowTime,
            dateDoorTime,
            preciseTime,
            venue,
            address,
            price: null,
            image,
            ticketLink,
            moreInfoLink: null, // TODO: add moreInfoLink
            source: 'blueskiesturnblack',
        }
    });
  } catch (error) {
      console.error(error);
      return [];
  }
}

export { getBlueSkies };