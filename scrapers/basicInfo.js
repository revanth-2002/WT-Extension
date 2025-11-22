async function scrapeBasicInfo() {
    const data = {};

    // --- Basic Info ---
    const nameElem = document.querySelector('h1');
    if (nameElem) data.name = cleanText(nameElem.innerText);

    // Headline is usually in a div near the h1
    const divs = document.querySelector('section.artdeco-card > div.ph5 > div.mt2 > div > div.text-body-medium');
    //console.log(divs);
    const text = cleanText(divs?.innerText);
    data.headline = text;
    // for (let div of divs) {
    //     const text = cleanText(div.textContent);
    //     if (text && text !== data.name && text.length > 10 && text.length < 200) {
    //         data.headline = text;
    //         break;
    //     }
    // }

    // Location - look for text that looks like a location
    const allSpans = document.querySelectorAll('span');
    for (let span of allSpans) {
        const text = cleanText(span.innerText);
        if (text.match(/,.*United States|,.*India|,.*UK|Area$/i) && text.length < 100) {
            data.location = text;
            break;
        }
    }

    // --- About Section ---
    const aboutelem = document.querySelector('#about');
    if (aboutelem) {
        const aboutElem = aboutelem?.parentElement.querySelector(
        'section.artdeco-card > div.display-flex > div > div > div > span.visually-hidden'
        );

        const About = aboutElem?.textContent || "";

        const cleanAbout = About
        ?.replace(/[\n\r\t]+/g, '\n')
        .replace(/[ ]{2,}/g, ' ')
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .join('\n');
         data.about=cleanAbout;
    }

    return data;
}
