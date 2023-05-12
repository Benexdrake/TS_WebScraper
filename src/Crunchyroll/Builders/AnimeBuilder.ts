import { Anime } from "../Models/Anime";
import { Episode } from "../Models/Episode";

export class AnimeBuilder
{
    private anime:Anime = new Anime();
    
    public id(id:string) : AnimeBuilder
    {
        this.anime.id = id;
        return this;
    }

    public title(title:string) : AnimeBuilder
    {
        this.anime.title = title;
        return this;
    }

    public url(url:string) : AnimeBuilder
    {
        this.anime.url = url;
        return this;
    }

    public information(information:string) : AnimeBuilder
    {
        this.anime.information = information;
        return this;
    }

    public genres(genres:string[]) : AnimeBuilder
    {
        this.anime.genres = genres;
        return this;
    }

    public publisher(publisher:string) : AnimeBuilder
    {
        this.anime.publisher = publisher;
        return this;
    }

    public audio(audio:string[]) : AnimeBuilder
    {
        this.anime.audio = audio;
        return this;
    }

    public subtitle(subtitle:string[]) : AnimeBuilder
    {
        this.anime.subtitle = subtitle;
        return this;
    }

    public imageUrl(imageUrl:string) : AnimeBuilder
    {
        this.anime.imageUrl = imageUrl;
        return this;
    }

    public rating(rating:number) : AnimeBuilder
    {
        this.anime.rating = rating;
        return this;
    }

    public episodes(episodes:Episode[]) : AnimeBuilder
    {
        this.anime.episodes = episodes;
        return this;
    }

    public build() : Anime
    {
        return this.anime;
    }
}