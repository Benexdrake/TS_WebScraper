let fs = require('fs');
import https from 'https';

export async function save_image(url:string, filepath:string)
{
    
    const urlSplit = url.split('/')
    const fileName = urlSplit[urlSplit.length-1]

    const file = fs.createWriteStream(filepath+'/'+fileName);

    return await new Promise((res) => {

        https.get(url, (response) => {
            response.pipe(file);
            
            file.on('finish', () => {
                file.close();
                console.log('Download completed!');
                res(fileName)
            });
        }).on('error', (err) => {
            console.error(err);
        });
    })
}