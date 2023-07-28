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
        let pokemons:Pokemon[] = [];

        for(let i = 1; i<= 1010; i++)
        {
            const browser = await puppeteer.launch({headless: 'new'});
            const page:Page = await browser.newPage();
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36')
            await page.setViewport({width: 0, height: 0, deviceScaleFactor: 1});
            const p = new Pokemon_API(page);
            let poke = await p.getPokemon(i);
            if(poke[0].name !== "")
            {
                console.log(`${i} - ${poke[0].name}`)
                for(const pokemon of poke)
                    pokemons.push(pokemon)
            }
            browser.close();
            browser.disconnect();
            
            await new Promise(f => setTimeout(f, 1000));
        }

        let json = JSON.stringify(pokemons);

        let fs = require('fs');
        fs.writeFile('pokemons.json', json, 'utf8', () => {} );
    }
    catch (error)
    {
        console.log(error);
    }
}

main();