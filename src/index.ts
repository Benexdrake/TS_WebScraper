import puppeteer, { Page } from "puppeteer";
import { Crunchyroll_API } from "./Crunchyroll/Controller/Crunchyroll_API";
import { Pokemon_API } from "./Pokemon/Pokemon_API";
import { Pokemon } from "./Pokemon/Models/Pokemon";
import { Amazon_API } from "./Amazon/Amazon_API";
import { AniDb_API } from "./AniDb/Controller/AniDb_API";

let main = async () =>
{
    try 
    {
        const window = new Window();
        const handle = window.open("https://www.w3schools.com");
    }
    catch (error)
    {
        console.log(error);
    }
}

main();