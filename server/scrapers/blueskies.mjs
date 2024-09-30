import puppeteer from "puppeteer";

const getBlueSkies = async () => {
    
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

    await page.goto("https://www.blueskiesturnblack.com/", {
        waitUntil: "domcontentloaded",
    });

    const events = await page.evaluate(() => {
        const eventList = document.querySelectorAll("article.eventlist-event.eventlist-event--upcoming");
    
        return Array.from(eventList).map((quote) => {
            const date = quote.querySelector('h1.eventlist-title a').innerText.trim();
            
            const titleContainer = quote.querySelector('.col.sqs-col-12.span-12 > div:nth-of-type(1)');
            const titleHeadings = titleContainer.querySelectorAll('h1, h2, h3, h4, h5, h6');
            let concatenatedTexts = [];

            titleHeadings.forEach(heading => {
                let concatenatedText = '';

                heading.childNodes.forEach(child => {
                    if (child.nodeType === Node.ELEMENT_NODE || child.nodeType === Node.TEXT_NODE) {
                        concatenatedText += child.innerText ? child.innerText.trim() : child.textContent.trim();
                        concatenatedText += ' + ';
                    }
                });

                concatenatedText = concatenatedText.slice(0, -3);
                concatenatedTexts.push(concatenatedText);
            });

            console.log(concatenatedTexts);
            const title = concatenatedTexts.join(' + ');

            const venueAddressContainer = quote.querySelector('.col.sqs-col-12.span-12 > div:nth-of-type(2) .sqs-html-content p:nth-of-type(2) > strong');
            const venue = venueAddressContainer ? venueAddressContainer.innerText.trim() : '';
            
            const address = venueAddressContainer ? venueAddressContainer.nextSibling.textContent.trim().replace(/^-+\s*/, '').trim() : '';
            const time = quote.querySelector('.col.sqs-col-12.span-12 > div:nth-of-type(2) .sqs-html-content p:nth-of-type(4)').innerText.trim();
            
            const price = 'See ticket link'
            
            const imgElement = quote.querySelector('a.eventlist-column-thumbnail img');
            const image = imgElement ? imgElement.src : null;
            

            const ticketLinkElement = quote.querySelector('.row.sqs-row > .col.sqs-col-2.span-2 a');
            const ticketLink = ticketLinkElement ? ticketLinkElement.getAttribute('href') : null;

            return {
              date,
              title,
              venue,
              address,
              time,
              price,
              image,
              ticketLink,
            };
        })
    })

    return events;
}

export { getBlueSkies };