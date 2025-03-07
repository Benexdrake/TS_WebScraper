import puppeteer, { Browser, Page } from "puppeteer";
import { save_image } from "../lib/helper";

export class IMDb_API
{
    constructor(private browser:Browser)
    {}

    public async get_movies(url:string)
    {
        const page:Page = await this.browser.newPage();
        page.goto(url)
        await new Promise(f => setTimeout(f, 3000));
    
        let accept = await page.$('button.icb-btn')
        accept?.click()
        console.log('Accept Clicked')
        await new Promise(f => setTimeout(f, 3000));
    
        // while(true)
        // {
        //     await new Promise(f => setTimeout(f, 3000));
        //     let button = await page.$('span.ipc-see-more__text')
        
        //     if(!button)
        //         break


        //     button.click()
        //     console.log('More Clicked')
        // }
    

        let main = await page.$('ul.ipc-metadata-list')

        let mainBlocks = await main?.$$('li.ipc-metadata-list-summary-item')

        if(!mainBlocks)
            return

        let i = 1

        let movies:any = []
    
        for(let mb of mainBlocks)
        {
            console.log(`${i} / ${mainBlocks.length}`)
            let movie = await this.get_movie(mb, this.browser)
            if(movie)
               movies.push(movie) 

            i++;
        }
    }

    public async get_movie(mb:any, browser:Browser)
    {
        

        //url a.ipc-lockup-overlay ? a.ipc-title-link-wrapper
        let urlBlock = await mb.$('a.ipc-title-link-wrapper')
        let href =  await urlBlock?.evaluate((x:any) => x.href)

        let url = href+""

        //id id in url /title/id/? split by / [2]?
        let id = href?.split('/')[4]

        //title  a.ipc-title-link-wrapper  innertext
        let titleBock = await mb.$('a.ipc-title-link-wrapper')
        let title = (await titleBock?.evaluate((x:any) => x.innerText.trim().replace(/^\d+\.?\s*/, '')))

        //rating span.ipc-rating-star--rating replace , -> .
        let ratingBlock = await mb.$('span.ipc-rating-star--rating')
        let rating = parseFloat(await ratingBlock?.evaluate((x:any) => x.innerText.replace(',', '.'))+'')

        let imageUrlBlock = await mb.$('img.ipc-image')
        let imageUrl = await imageUrlBlock?.evaluate((x:any) => x.src.split('@')[0])+'@'

        if (!imageUrl)
            return
        
        await save_image(imageUrl,id+'')

        let tripleBlock = await mb.$$('span.sc-5bc66c50-6')
        //release span.sc-5bc66c50-6 OOdsw dli-title-metadata-item [0] innertext
        let release = parseInt(await tripleBlock[0].evaluate((x:any) => x.innerText))
        //alter span.sc-5bc66c50-6 OOdsw dli-title-metadata-item [2] innertext 
        let fsk = parseInt(await tripleBlock[2].evaluate((x:any) => x.innerText))
        //lengthspan.sc-5bc66c50-6 OOdsw dli-title-metadata-item [1] innertext
        let length = await tripleBlock[1].evaluate((x:any) => x.innerText)
   

        //description .ipc-html-content-inner-div innerText
        let descriptionBlock = await mb.$('div.ipc-html-content-inner-div')
        let description = await descriptionBlock?.evaluate((x:any) => x.innerText.trim())


        let result = await this.get_information_for_movie(url,browser)
        

        let movie = {url, id, title, rating, release, fsk, length, description, 'genres':result?.genres, 'regie':result?.regies, 'script': result?.drehbuchs, 'actors':result?.besetzungs, 'image': id+'.jpg'}
        return movie
    }

    public async get_information_for_movie(url:string,browser:Browser)
    {
        const page:Page = await browser.newPage();
        await page.goto(url)
        await new Promise(f => setTimeout(f, 1000));

        let titleSection = await page.$('ul.ipc-metadata-list--dividers-all')

        let metaList = await titleSection?.$$('li.ipc-metadata-list__item')

        if(!metaList)
            return null;

        let regies = []
        let drehbuchs = []
        let besetzungs = []

        // Regie 
        let regieList = await metaList[0].$$('li.ipc-inline-list__item')
        for(let rl of regieList)
        {
            let regie = await rl.evaluate(x => x.innerText)
            regies.push(regie)
        }
        // Drehbuch
        let drehbuchList = await metaList[1].$$('li.ipc-inline-list__item')
        for(let dl of drehbuchList)
        {
            let drehbuch = await dl.evaluate(x => x.innerText)
            drehbuchs.push(drehbuch)
        }
        // Hauptbesetzung
        let besetzungList = await metaList[2].$$('li.ipc-inline-list__item')
        for(let bl of besetzungList)
        {
            let besetzung = await bl.evaluate(x => x.innerText)
            besetzungs.push(besetzung)
        }

        let genreBlock = await page.$('div.ipc-chip-list__scroller')

        let genreList = await genreBlock?.$$('a.ipc-chip')

        if(!genreList)
            return null;

        let genres = []
        for(let gl of genreList)
        {
            let genre = await gl.evaluate(x => x.innerText)
            genres.push(genre)
        }
        page.close()

        return {regies,drehbuchs,besetzungs,genres}
    }
}