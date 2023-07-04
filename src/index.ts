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

        



        

        page.close();
        browser.close();
    }
    catch (error)
    {
        console.log(error);
    }
}

main();