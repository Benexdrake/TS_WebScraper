import puppeteer, { Page } from "puppeteer";
import { Crunchyroll_API } from "./Crunchyroll/Crunchyroll_API";
import { Pokemon_API } from "./Pokemon/Pokemon_API";
import { Pokemon } from "./Pokemon/Models/Pokemon";
import { Amazon_API } from "./Amazon/Amazon_API";

let main = async () =>
{
    try 
    {
        const url = 'https://www.crunchyroll.com/de/series/GRDQKP57Y/ixion-saga-dt';

        const browser = await puppeteer.launch({headless: false});
        const page:Page = await browser.newPage();
        await page.setViewport({width: 0, height: 0, deviceScaleFactor: 1});

        const cr = new Crunchyroll_API(page);
        const anime = await cr.GetAnime(url);

        console.log(anime);

        page.close();
        browser.close();
    }
    catch (error)
    {
        console.log(error);
    }
}

main();