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
            const eventObj = {};

            eventObj.date = quote.querySelector('div.heading.text-2xl.mb-2').innerText.trim();
            eventObj.title = quote.querySelector('div.heading.text-4xl.mb-2').innerText.trim();
            eventObj.venue = quote.querySelector('div.heading.text-2xl').innerText.trim();
            eventObj.address = quote.querySelector('div.heading.text-2xl').nextElementSibling.innerText.trim();
            eventObj.time = quote.querySelector('div.heading.text-2xl').nextElementSibling.nextElementSibling.innerText.trim();
            eventObj.price = quote.querySelector('div.mb-4').innerText.trim();
            
            const imgElement = quote.querySelector('a img');
            eventObj.image = imgElement ? imgElement.src : null;

            // eventObj.links = {
            //     tickets: quote.querySelector('a#tickets-116983').href,
            //     moreInfo: quote.querySelector('a.btn.false').href
            // };

            return eventObj;
        })
    })

    return events;
}

export { getCasa };