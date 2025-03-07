import puppeteer, { Page } from "puppeteer";
import { save_image } from "../lib/helper";

let fs = require('fs');
export async function github_questions(url:string,filename:string,name:string,level:number,id:string,type:string,description:string)
{
    
    
    let browser = await puppeteer.launch({headless:'new'});
    const page:Page = await browser.newPage();
    page.goto(url)
    
    try {
        await new Promise(f => setTimeout(f, 10000));

        let questionBlocks = await page.$$('.markdown-heading')
        let answerBlocks = await page.$$('.contains-task-list')

        console.log(questionBlocks.length)
        console.log(answerBlocks.length)

        if(questionBlocks.length == 0)
        {
            console.log('Error')

            page.close()
            browser.close()
            return
        }

        let max = answerBlocks.length -1

        let questions = []

        for (let i = max; i >= 0; i--) {
            // Question
            let qb = await questionBlocks[i].$('h3')

            let question = await qb?.evaluate(x => x.innerText.trim())        

            // Answers and Check
            let abs = await answerBlocks[i].$$('li')
            let answers = []
            let n = 0
            for(let ab of abs)
                {
                    let answer = await ab.evaluate(x => x.innerText.trim())
                    let checkbox = await ab.$('input')
                    let checked = await checkbox?.evaluate(x => x.checked)

                    if(checked)
                        n++;

                    answers.push({'answer': answer, 'check':checked})
                }
            let single = true

            if(n > 1)
                single = false

            questions.push({'nr': i+1, 'question': question, 'answers':answers, 'single':single})
            console.log(`${max-i} / ${max}`)
        }

        let data = {name,level,id,type, description, questions}

        let json = JSON.stringify(data);
        fs.writeFile(filename, json, 'utf8', () => { });

        console.log('File saved!!!')


        // Bilder herunterladen

        let images = await page.$$('img')

        for(let image of images)
        {
            let src = await image.evaluate(x => x.src)

            let split = src.split('/')

            if(split[split.length-1].includes('question'))
            {
                let i = src.replace('https://github.com','https://raw.githubusercontent.com').replace('/raw/','/refs/heads/')

                console.log(i)
                await save_image(i, `images/${split[split.length-1]}`)
            }
        }
    } catch (error) {

    }
    finally
    {   
        page.close()
        browser.close()
    }
}