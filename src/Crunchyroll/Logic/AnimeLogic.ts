import { Page } from "puppeteer";
import { Episode } from "../Models/Episode";
import { EpisodeLogic } from "./EpisodeLogic";

export class AnimeLogic
{
    constructor(private page:Page){}

    async getSubTitle() : Promise<string[]> 
    {
        const array:string[] = [];
        const detailsTable = await this.page.$$('div.show-details-table');

        const detailsTableTable = await detailsTable[0]?.$$('div.details-table__table-row--4eYc5');
        
        const text3 = await detailsTableTable[2]?.$$('h5.text--gq6o-');
        const right3 = await text3[1]?.evaluate(x => x.innerText);
        let split3 = right3.split(',');
        for(const s of split3)
            array.push(s.trim());
        return array;
    }
    async getAudio() : Promise<string[]>
    {
        const array:string[] = [];
        const detailsTable = await this.page.$$('div.show-details-table');

        const detailsTableTable = await detailsTable[0]?.$$('div.details-table__table-row--4eYc5');
        
        const text2 = await detailsTableTable[1]?.$$('h5.text--gq6o-');
        const right2 = await text2[1]?.evaluate(x => x.innerText);
        let split2 = right2.split(',');
        for(const s of split2)
        array.push(s.trim());
        return array;   
    }
    async getPublisher() : Promise<string>
    {
        const detailsTable = await this.page.$$('div.show-details-table');
        const detailsTableTable = await detailsTable[0]?.$$('div.details-table__table-row--4eYc5');

        const text1 = await detailsTableTable[0]?.$$('h5.text--gq6o-');
        return await text1[1]?.evaluate(x => x.innerText);
    }

    async getId(url:string) : Promise<string>
    {
        const idSplit = url.split('/')
        return idSplit[idSplit.length-2];
    }

    async getRating() : Promise<number>
    {
        const rating = await this.page.$$('span.star-rating-average-data__label--TdvQs');
        const r = (await rating[0]?.evaluate(x => x.innerText)).split('(');
        const n = parseFloat(r[0]);
        if(!isNaN(n))
            return n;
        return 0;
    }

    async getImage() : Promise<string>
    {
        const image = await this.page.$$('img.content-image__image--7tGlg');
        const i = await image[0]?.evaluate(x => x.outerHTML);
        const imageSplit = i.split('"');
        return imageSplit[3] || "";
    }

    async getTitle() : Promise<string>
    {
        const title = await this.page.$$('h1.heading--nKNOf');
        return await title[0]?.evaluate(x => x.innerText);
    }

    async getInformation() : Promise<string>
    {
        const information = await this.page.$$('p.expandable-section__text---00oG');
        return await information[0]?.evaluate(x => x.innerText);
    }

    async getGenre() : Promise<string[]>
    {
        const array:string[] = [];
        const genre = await this.page.$$('div.genre-badge');
        for(const g of genre)
        {
            let genre_text = await g.evaluate(x => x.innerText);
            if(genre_text != "")
            {
                array.push(genre_text);
            }
        }
        return array;
    }

    async getEpisodes() : Promise<Episode[]>
    {
        const el:EpisodeLogic = new EpisodeLogic();
        const episodes:Episode[] = [];
        const main = await this.page.$$('div.erc-season-with-navigation');
        if(main.length > 0)
        {   
            while(true)
            {
                // Season
                const seasonTitle = await main[0]?.$$('h4.text--is-semibold--AHOYN');
                if(seasonTitle.length > 0)
                {
                    const season = await seasonTitle[0]?.evaluate(x => x.innerText);
                    
                    while(true)
                    {
                        // check for Mehr Anzeigen Button
                        const more = await main[0]?.$$('div.button--is-type-four--yKPXY')
                        if(more.length == 0)
                        break;

                        more[0].click();
                        await new Promise(f => setTimeout(f, 1000));
                    }
                    
                    // Liste Episoden Blöcke
                    const seasonEpisode = await main[0]?.$$('div.erc-season-episode-list');
                    if(seasonEpisode.length > 0)
                    {
                        const cards = await seasonEpisode[0]?.$$('div.card')
                        cards.forEach(async card => 
                        {
                            const episode = await el.getEpisode(card,season);
                            episodes.push(episode);
                        });
                    }
                    
                    // suchen nach Button wenn nicht mehr klickbar dann return
                    const controls = await this.page.$$('div.controls');
                    
                    if(controls.length > 0)
                    {   
                        const buttons = await controls[0]?.$$('div.cta-wrapper');
                        
                        const end = await buttons[1]?.evaluate(x => x.className);
                        if(end.includes('state-disabled'))
                        return episodes;
                        
                        const nextSeason = await buttons[1]?.evaluate(x => x.innerText);
                        if(nextSeason == 'NÄCHSTE STAFFEL')
                        {
                            buttons[1].click();
                            await new Promise(f => setTimeout(f, 1000));
                        }
                    }
                    else
                        return episodes;
                }
            }
        }
        return episodes;
    }
}