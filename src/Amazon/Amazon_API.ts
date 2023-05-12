import puppeteer, { Page } from "puppeteer";
import { Amazon } from "./Models/Amazon";
import { AmazonBuilder } from "./Builders/AmazonBuilder";

export class Amazon_API
{
    constructor(private page:Page)
    {}
    public async getAmazonItem(url:string) : Promise<Amazon>
    {
        const amazonBuilder:AmazonBuilder = new AmazonBuilder();

        await this.page.goto(url);

        return amazonBuilder.id(await this.getId(url))
                            .title(await this.getTitle())
                            .price(await this.getPrice())
                            .plattform(await this.getPlattform())
                            .releaseDate(await this.getReleaseDate())
                            .information(await this.getInformation())
                            .imageUrl(await this.getImageUrl())
                            .build();
    }

    public async checkForPreorder(url:string, page:Page) : Promise<boolean>
    {
        await this.page.goto(url,{waitUntil: 'networkidle2'});

        const buyNowButton = await page.$$('input#buy-now-button');
        if(buyNowButton.length > 0)
        {
            return true;
        }
        return false;
    }

    private async getImageUrl() : Promise<string> 
    {
        const imageNode = await this.page.$$('img#landingImage');
        if(imageNode.length > 0)
        {
            const imageSplit = (await imageNode[0].evaluate(x => x.outerHTML)).split('"');
            return imageSplit[5];
        }
        return "";
    }
    private async getInformation() : Promise<string[]>
    {
        const array:string[] = [];
        const informationNode = await this.page.$$('div#feature-bullets');
        if(informationNode.length > 0)
        {
            const informationList = await informationNode[0].$$('span.a-list-item');
            for(const info of informationList)
            {
                const text = (await info.evaluate(x => x.innerText)).trim();
                array.push(text);
            }
        }
        return array;
    }
    private async getReleaseDate() : Promise<string> 
    {
        const releaseDateNode = await this.page.$$('div#availability');
        if(releaseDateNode.length > 0)
        {
            const text = (await releaseDateNode[0].evaluate(x => x.innerText)).replace('Dieser Artikel erscheint am','').replace('Jetzt vorbestellen.','').trim();
            if(text.includes('Nur noch'))
            return "Released"
            return text.substring(0,text.length-1);
        }
        return "";
    }
    private async getPlattform() : Promise<string> 
    {
        const plattformNode = await this.page.$$('div#platformInformation_feature_div');
        if(plattformNode.length > 0)
        {
            const text = (await plattformNode[0].evaluate(x => x.innerText)).replace('Plattform : ','').replace('|','').trim();
            return text;
        }
        return "";
    }
    private async getPrice() : Promise<number> 
    {
        const priceNode = await this.page.$$('span.a-offscreen');
        if(priceNode.length > 0)
        {
            const text = (await priceNode[0].evaluate(x => x.innerText)).replace('€','').replace(',','.');
            const number = parseFloat(text);
            if(!Number.isNaN(number))
            {
                return number;
            }
        }
        return 0
    }
    private async getTitle() : Promise<string> 
    {
        const titleNode = await this.page.$$('span#productTitle');
        if(titleNode.length > 0)
        {
            const text = await titleNode[0].evaluate(x => x.innerText)
            return text;
        }
        return "";
    }
    private async getId(url: string) : Promise<string> 
    {
        const idSplit = url.split('/');
        return idSplit[5];
    }
}