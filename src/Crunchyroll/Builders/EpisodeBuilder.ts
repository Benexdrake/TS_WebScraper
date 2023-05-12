import { Episode } from "../Models/Episode";

export class EpisodeBuilder
{
    private episode:Episode = new Episode();

    public id(id:string) : EpisodeBuilder
    {
        this.episode.id = id;
        return this;
    }

    public season(season:string) : EpisodeBuilder
    {
        this.episode.season = season;
        return this;
    }

    public url(url:string) : EpisodeBuilder
    {
        this.episode.url = url;
        return this;
    }

    public imageUrl(imageUrl:string) : EpisodeBuilder
    {
        this.episode.imageUrl = imageUrl;
        return this;
    }

    public title(title:string) : EpisodeBuilder
    {
        this.episode.title = title;
        return this;
    }

    public dub(dub:string) : EpisodeBuilder
    {
        this.episode.dub = dub;
        return this;
    }

    public build() : Episode
    {
        return this.episode;
    }
}