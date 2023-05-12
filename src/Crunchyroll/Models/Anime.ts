import { Episode } from "./Episode";

export class Anime
{
    public id:string = "";
    public title:string = "";
    public url: string = "";
    public information:string = "";
    public genres:string[] = [];
    public publisher:string = "";
    public audio: string[] = [];
    public subtitle:string[] = [];
    public imageUrl:string = "";
    public rating:number = 0;

    public episodes:Episode[] = [];
}