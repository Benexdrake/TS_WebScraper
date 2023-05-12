import puppeteer, { ElementHandle, Page } from "puppeteer";
import  { Anime }  from "./Models/Anime";
import { AnimeBuilder } from "./Builders/AnimeBuilder";
import { AnimeLogic } from "./Logic/AnimeLogic";


export class Crunchyroll_API
{
    constructor(private page: Page){}
    public async GetAnime(url: string) : Promise<Anime>
    {
        const ab:AnimeBuilder = new AnimeBuilder();
        const al:AnimeLogic = new AnimeLogic(this.page);

        await this.page.goto(url,{waitUntil: 'networkidle2'});
        
        return ab.id(await al.getId(url))
                 .title(await al.getTitle())
                 .url(url)
                 .imageUrl(await al.getImage())
                 .rating(await al.getRating())
                 .information(await al.getInformation())
                 .genres(await al.getGenre())
                 .episodes(await al.getEpisodes())
                 .publisher(await al.getPublisher())
                 .audio(await al.getAudio())
                 .subtitle(await al.getSubTitle())
                 .build();
    }
}