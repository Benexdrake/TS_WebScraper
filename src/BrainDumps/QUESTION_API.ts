import puppeteer, { Page } from "puppeteer";

let fs = require('fs');

let id = 1

export async function getQuestions(url: string, filename:string)
{
    let questions:any = []

    const browser = await puppeteer.launch({headless: 'new'});
    const page:Page = await browser.newPage();

    
    for (let index = 2; index <= 999999; index++) {
        console.log(`Site ${index-1}`)

        await page.goto(url + "?p=" + index)
        await new Promise(f => setTimeout(f, 2000));
        
        let run = await get_question(page,questions)
        if(!run)
            break
        
        let json = JSON.stringify(questions);
        fs.writeFile(filename+'.json', json, 'utf8', () => { });
    }
    page.close()
    browser.close()
        
}

let get_question = async (page:Page, questions:any) => {
    let main = await page.$("#main-container")

    let title = await main?.$(".text-center")

    if (main == null)
        return false

    if (title == null)
        return false

    let questionBlocks = await main.$$(".panel-default")

    if (questionBlocks.length == 0)
        return

    

    for(let qb of questionBlocks)
    {
    // Question
        // content
        let contentBlock = await qb.$(".lead")
        let content = await contentBlock?.evaluate(x => x.textContent?.replace("Note:","").trim())

        // answers // Check for data-correct=True
        let answerBlocks = await qb.$$("li.ui-selectee")
        let answers = []
        if(answerBlocks.length > 1)
        {
            for(let answerBlock of answerBlocks)
            {
                let answer = await answerBlock.evaluate(x => x.textContent)
                let correct = await answerBlock.evaluate(x => x.outerHTML.split(" ")[1])
                let check = correct.includes("True")
                answers.push({answer,check})
            }
        }
        else
        {
            continue
        }

        // Explanation
        let explanationBlocks = await qb.$$(".bg-light-yellow")
        let explanation = ""
        let references:any = []
        if(explanationBlocks.length > 0)
        {
            for(let eb of explanationBlocks)
            {
                let value = await eb.evaluate(x => x.textContent)+""

                if(value.split(":")[0].includes("Explanation"))
                    explanation = value.replace("Explanation:","").split("References:")[0]
                else if(value.split(":")[0].includes("Reference"))
                    references = value.replace("Reference:","").replace("References:","").split(" ")
            }
        }
        let question = {id, content, answers, explanation,references}
        questions.push(question)

        id++
    }
    return true
}