import { ElementHandle } from "puppeteer";
import { EpisodeBuilder } from "../Builders/EpisodeBuilder";
import { Episode } from "../Models/Episode";

export class EpisodeLogic
{
    async getEpisode(card:ElementHandle<HTMLDivElement>, season:string) : Promise<Episode>
    {
        const eb: EpisodeBuilder = new EpisodeBuilder();
        let cardDetails = await card.evaluate(x => x.innerHTML);
        let cardSplit = cardDetails.split('"');
        const idSplit = cardSplit[11].split("/");
        const dubSplit = cardSplit[110].split('<')

        return eb.id(idSplit[idSplit.length-2])
                 .season(season)
                 .imageUrl("https://www.crunchyroll.com/" + cardSplit[41])
                 .title(cardSplit[9])
                 .url("https://www.crunchyroll.com/" + cardSplit[11])
                 .dub(dubSplit[0].replace(">","").trim())
                 .build();
    }
}