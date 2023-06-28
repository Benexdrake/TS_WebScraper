import puppeteer, { Page } from "puppeteer";
import { Crunchyroll_API } from "./Crunchyroll/Controller/Crunchyroll_API";
import { Pokemon_API } from "./Pokemon/Pokemon_API";
import { Pokemon } from "./Pokemon/Models/Pokemon";
import { Amazon_API } from "./Amazon/Amazon_API";

let main = async () =>
{
    try 
    {
        const browser = await puppeteer.launch({headless: false});
        const page:Page = await browser.newPage();
        await page.setViewport({width: 0, height: 0, deviceScaleFactor: 1});

        const cr = new Crunchyroll_API(page);
        const urls = await cr.GetAnimeUrls();
        console.log(urls.length)

        for(const url of urls)
        {
            const anime = await cr.GetAnime(url.urlAdress);
            console.log(anime);
            break;
        }

        page.close();
        browser.close();
    }
    catch (error)
    {
        console.log(error);
    }
}

main();