import { Page } from "puppeteer";
import {Url} from "../Models/Url";

export class AniDb_API
{
    constructor(private page: Page){}

    public async GetUrls() : Promise<Url[]>
    {
        const urls : Url[] = [];

        for (let i = 0; i < Number.MAX_VALUE; i++) 
        {
            const url = "https://anidb.net/anime/?h=1&noalias=1&orderby.name=0.1&page="+i+"&type.tvseries=1&view=list";
            await this.page.goto(url, {waitUntil: 'networkidle2'});
            
            const main = await this.page.$$("div.animelist_list");
            if(main.length == 0)
                break;

            const list = await main[0].$$("tr");

            for(const l of list)
            {
                const u = new Url();
                const urlTd = await l.$$("a");
                const url = (await urlTd[0].evaluate(x => x.outerHTML)).split('"')[1];

                const startedTd = await l.$$("td.airdate");
                const started = await startedTd[0]?.evaluate(x => x.innerText);

                const endedTd = await l.$$("td.enddate");
                const ended = await endedTd[0]?.evaluate(x => x.innerText);

                console.log('url: https://anidb.net/'+url+' start: '+started?.replace('??', '01')+' end: '+ ended?.replace('??', '01'));
                u.url = url;
                u.start = started?.replace('??', '01');
                u.ended = ended?.replace('??', '01');

                urls.push(u);
            }
        }
        return urls;
    }
}