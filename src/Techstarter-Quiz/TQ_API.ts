import axios from "axios";

let fs = require('fs');


    export async function getQuiz(url: string, filename: string, max: number)
    {
        let questions: any[] = []

        for (let index = 0; index < max; index++) {
            console.log(`Loading Question ${index + 1} / ${max}`)
            await axios.get(url + index).then(x => {
                let q = x.data;

                let id = q.id + 1 + ""
                let explenation = replace_string(q.explanation)
                let question = replace_string(q.question)
                let answers: any = []

                for (let i = 0; i < q.answers.length; i++) {
                    if (i == q.correct[0] - 1)
                        answers.push([replace_string(q.answers[i]), true])
                    else
                        answers.push([replace_string(q.answers[i]), false])
                }

                questions.push({ id, explenation, question, answers })

            })
            await new Promise(f => setTimeout(f, 2000));

            let json = JSON.stringify(questions);
            fs.writeFile(filename + '.json', json, 'utf8', () => { });
        }
    }

    function replace_string(text:string)
    {
        return text.replace(/<[^>]*>/g, "").trim()
    }
