import puppeteer, { ElementHandle, Page } from "puppeteer";
import  { Anime }  from "../Models/Anime";
import { AnimeBuilder } from "../Builders/AnimeBuilder";
import { AnimeLogic } from "../Logic/AnimeLogic";
import { Url } from "../Models/Url";


export class Crunchyroll_API
{
    constructor(private page: Page){}

    

    public async GetAnimeUrls() : Promise<Url[]>
    {
        const urls : Url[] = [];

        const url = "https://www.crunchyroll.com/de/videos/new";

        await this.page.goto(url, {waitUntil: 'networkidle2'});

        await this.page.evaluate(async () => {
            for (let index = 0; index <= 35; index++) 
            {
                window.scrollBy(0,document.body.scrollHeight);
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
          });

        const browserCards = await this.page.$$("div.browse-card");

        for(const bc of browserCards)
        {
            const u = new Url();
            const bcUrl = await bc.$$("a.browse-card__poster-wrapper--pU-AW");

            const bcUrlText = await bcUrl[0]?.evaluate(x => x.outerHTML);

            const bcUrlTextSplit = bcUrlText.split('"'); // index 3 for url

            const hover = await bc.$$("div.browse-card-hover__series-meta--hgyIc");
            if(hover.length > 0)
            {   
                const hoverMeta = await hover[0]?.$$("span.text--gq6o-");
                
                if(hoverMeta.length > 0)
                {
                    
                    //Season 0
                    const seasonText = await hoverMeta[0]?.evaluate(x => x?.innerText);
                    
                    //Episode 1
                    const episodeText = await hoverMeta[1]?.evaluate(x => x?.innerText);
                    u.episodes = parseInt(seasonText.split(' ')[0].replace('.',''));
                    u.seasons = parseInt(episodeText.split(' ')[0].replace('.',''));
                }
            }
                
            u.urlAdress = "https://www.crunchyroll.com"+bcUrlTextSplit[3];
            urls.push(u);
        }

          

        return urls;
    }

    public async GetAnime(url: Url) : Promise<Anime>
    {
        const ab:AnimeBuilder = new AnimeBuilder();
        const al:AnimeLogic = new AnimeLogic(this.page);

        await this.page.goto(url.urlAdress,{waitUntil: 'networkidle2'});
        
        return ab.id(await al.getId(url.urlAdress))
                 .title(await al.getTitle())
                 .url(url.urlAdress)
                 .imageUrl(await al.getImage())
                 .rating(await al.getRating())
                 .information(await al.getInformation())
                 .genres(await al.getGenre())
                 .episodes(await al.getEpisodes())
                 .publisher(await al.getPublisher())
                 .audio(await al.getAudio())
                 .subtitle(await al.getSubTitle())
                 .seasons(url.seasons)
                 .episodeCount(url.episodes)
                 .build();
    }

    // es fehlen Informationen, die in Discord auch fehlen würden, idee verworfen.
    private async GetAnimes() : Promise<Anime[]>
    {
        const animes : Anime[] = [];

        const url = "https://www.crunchyroll.com/de/videos/new";

        await this.page.goto(url, {waitUntil: 'networkidle2'});

        await this.page.evaluate(async () => {
            for (let index = 0; index <= 35; index++) 
            {
                window.scrollBy(0,document.body.scrollHeight);
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
          });

          const browserCards = await this.page.$$("div.browse-card");

        for(const bc of browserCards)
        {
            const a = new Anime();
            const bcUrl = await bc.$$("a.browse-card__poster-wrapper--pU-AW");

            const bcUrlText = await bcUrl[0]?.evaluate(x => x.outerHTML);

            const bcUrlTextSplit = bcUrlText.split('"'); // index 3 for url

            const hover = await bc.$$("div.browse-card-hover__series-meta--hgyIc");
            if(hover.length > 0)
            {   
                const hoverMeta = await hover[0]?.$$("span.text--gq6o-");
                
                if(hoverMeta.length > 0)
                {
                    const ab:AnimeBuilder = new AnimeBuilder();

                    // id
                    a.url = "https://www.crunchyroll.com"+bcUrlTextSplit[3];
                    // title
                    const browserCardTitle = await bc.$$('a.browse-card__title-link--SLlRM');
                    
                    a.title = await browserCardTitle[0]?.evaluate(x => x.innerText)
                        
                    //url
                    const urlSplit = (await browserCardTitle[0].evaluate(x => x.outerHTML)).split('"')
                    console.log(urlSplit);   
                    
                    //imageurl
                    const imageUrl = await bc.$$('img.content-image__image--7tGlg');
                    const imageSplit = await imageUrl[0]?.evaluate(x => x.outerHTML);
                    console.log(imageSplit);
                    //rating

                    //information

                    //genres X

                    //episodesCount

                    //publisher X

                    //audio

                    //subtitle

                    //seasons

                    




                    //Season 0
                    const seasonText = await hoverMeta[0]?.evaluate(x => x?.innerText);
                    
                    //Episode 1
                    const episodeText = await hoverMeta[1]?.evaluate(x => x?.innerText);
                    a.episodeCount = parseInt(seasonText.split(' ')[0].replace('.',''));
                    a.seasons = parseInt(episodeText.split(' ')[0].replace('.',''));
                }
            }

        }

        return animes;
    }
}