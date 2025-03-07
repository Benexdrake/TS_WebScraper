import puppeteer, { ElementHandle, Page } from "puppeteer";
let fs = require('fs');
export class ID_API
{
    public async getHandys()
    {
        try 
        {
                let urls:string[] = []
                let handys = []
            
                const browser = await puppeteer.launch({headless: "new"});
                const page:Page = await browser.newPage();
                await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36')
                await page.setViewport({width: 0, height: 0, deviceScaleFactor: 1});
            
                // let test = await handyPage(page,"https://www.inside-digital.de/handys/apple-iphone-se-2024")
            
                // console.log(test)
            
                let maxPages = 10
                for(let i = 1; i <= maxPages; i++)
                {
                    console.log("Searching Page: " + i + " / " + maxPages)
                    await page.goto("https://www.inside-digital.de/handy-bestenliste/inside-digital-ranking/"+i)    
            
                    let cards = await page.$$(".item-details")
                    for (let card of cards)
                    {
                        let a = await card.$$("a")
                        urls.push(await a[0].evaluate(x => x.href))
                    }
                    await new Promise(f => setTimeout(f, 1000));
                }
            
                let index = 1
                for (let url of urls)
                {
                    console.log(url)
                    console.log(index + " / " + urls.length)
            
                    let handy = await this.handyPage(page,url)
                    handys.push(handy)
                    index++
                }
            
                let json = JSON.stringify(handys);
            
            
                fs.writeFile('handy.json', json, 'utf8', () => {} );
            
            
            
                browser.close();
                browser.disconnect();
            }
            catch (error)
            {
                     console.log(error)
                }
            }

            handyPage = async (page:Page,url:string) => {
                await page.goto(url)
            
                await new Promise(f => setTimeout(f, 1000));
                //Image 
                let header = await page.$$(".triple-columns")
                let imageblock = await header[0].$$("img")
                let imageUrl = await imageblock[0].evaluate(x => x.src)
            
                //Description
                let description:string[] = []
                var descriptionBlock = await page.$$(".product_description")
                let ps = await descriptionBlock[0].$$("p")
                for(let p of ps)
                {
                    description.push(await p.evaluate(x => x.innerText))
                }
            
                let dataSheets = await page.$$("table.datasheet_table")
                let general = await this.allgemein(dataSheets[0])
                let display = await this.findTypesAndValues(dataSheets[1], "display")
                let casing = await this.findTypesAndValues(dataSheets[1], "gehäuse")
                let hardware = await this.findTypesAndValues(dataSheets[1], "hardware")
                let connectors = await this.findTypesAndValues(dataSheets[1], "konnektivität")
                let connection = await this.findTypesAndValues(dataSheets[1], "anschlüsse & übertragung")
                let camera = await this.findTypesAndValues(dataSheets[1], "kamera")
                let frontcamera = await this.findTypesAndValues(dataSheets[1], "frontkamera")
                let miscellaneous = await this.findTypesAndValues(dataSheets[1], "sonstiges")
            
                
                let handy
                handy = {imageUrl, description, general, display, casing, hardware,connectors,connection, camera,frontcamera,miscellaneous}
            
                return handy
            } 
            
            allgemein = async (element:ElementHandle<HTMLTableElement>) => {
            
            
                let general = []
            
            
                let trs = await element.$$(".db_feature")
                for(let tr of trs)
                {
                    let tds = await tr.$$("td")
                    let type = (await tds[0].evaluate(x => x.innerText)).toLowerCase()
                    let value = await tds[1].evaluate(x => x.innerText)
            
                    general.push({type,value})
                }
                return general
            }
            
            findTypesAndValues = async (element:ElementHandle<HTMLTableElement>, searchParam:string) => {
                let beginIndex = 0
                let endIndex = 0
            
                let trs = await element.$$("tr")
            
                // console.log(trs.length)
            
                // for(let tr of trs)
                // {
                //     let id = await tr.evaluate(x => x.id)
                //     if (id.includes("dataSheet_kat_"))
                //     {
                //         console.log(beginIndex)
                //         console.log(await tr.evaluate(x => x.innerText))
                //     }
                //     beginIndex++
                // }
            
                beginIndex = await this.findStartIndex(trs,searchParam)
                
                endIndex = await this.findEndIndex(trs, beginIndex)
            
                // console.log(beginIndex)
                // console.log(endIndex)
            
                let result = []
            
                for (let index = beginIndex+1; index <= endIndex; index++) {
            
            
                    let id = await trs[index].evaluate(x => x.id)
            
                    if(id.includes("grp_"))
                    {
                        continue
                    }
                    let tds = await trs[index].$$("td")
                    
                    let type = await tds[0].evaluate(x => x.innerText)
                    let value = await tds[1].evaluate(x => x.innerText)
            
            
                    result.push({type,value})
                }
                return result
            }
            
            
            findStartIndex = async (elements:ElementHandle<HTMLTableRowElement>[], searchParam:string) => {
                let beginIndex = 0
                // Find start Index
                for (let tr of elements)
                    {
                        let id = await tr.evaluate(x => x.id)
                        if(id.includes("dataSheet_kat_"))
                        {
                            let header = (await tr.evaluate(x => x.innerText)).toLowerCase()
                            if (header == searchParam)
                            {
                                break
                            }    
                        }
                        beginIndex++
                    }
                    return beginIndex
            }
            
            findEndIndex = async (trs:ElementHandle<HTMLTableRowElement>[], beginIndex:number) => {
                let endIndex = beginIndex
                for (let index = beginIndex+1; index < trs.length; index++) {
                    
                    let end = await trs[index].evaluate(x => x.id)
                    
                    if(end.includes("dataSheet_kat_"))
                    {
                        return endIndex
                    }
                    endIndex++
                }
                return endIndex
            }
}

