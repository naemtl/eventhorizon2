import puppeteer from "puppeteer";

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

    const events = await page.evaluate(() => {
        const eventList = document.querySelectorAll(".flex.flex-col.md\\:flex-row-reverse");
    
        return Array.from(eventList).map((quote) => {
            const date = quote.querySelector('div.heading.text-2xl.mb-2').innerText.trim();
            const title = quote.querySelector('div.heading.text-4xl.mb-2').innerText.trim();
            const venue = quote.querySelector('[class="md:w-5/12 p-6"] > div:nth-of-type(3) > div.heading').innerText.trim();
            const address = quote.querySelector('[class="md:w-5/12 p-6"] > div:nth-of-type(3) > div:nth-of-type(2)').innerText.trim();
            const time = quote.querySelector('[class="md:w-5/12 p-6"] > div:nth-of-type(4)').innerText.trim();
            const price = quote.querySelector('[class="md:w-5/12 p-6"] > div.mb-4').innerText.trim();
            
            const imgElement = quote.querySelector('a img');
            const image = imgElement ? imgElement.src : null;

            const ticketLinkElement = quote.querySelector('a.btn.btn-inverse');
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

export { getCasa };