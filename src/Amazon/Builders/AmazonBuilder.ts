import { Amazon } from "../Models/Amazon";

export class AmazonBuilder
{
    private amazon:Amazon = new Amazon();

    public id(id:string) : AmazonBuilder
    {
        this.amazon.id = id;
        return this;
    }

    public title(title:string) : AmazonBuilder
    {
        this.amazon.title = title;
        return this;
    }

    public price(price:number) : AmazonBuilder
    {
        this.amazon.price = price;
        return this;
    }

    public releaseDate(releaseDate:string) : AmazonBuilder
    {
        this.amazon.releaseDate = releaseDate;
        return this;
    }

    public plattform(plattform:string) : AmazonBuilder
    {
        this.amazon.plattform = plattform;
        return this;
    }

    public imageUrl(imageUrl:string) : AmazonBuilder
    {
        this.amazon.imageUrl = imageUrl;
        return this;
    }

    public information(information:string[]) : AmazonBuilder
    {
        this.amazon.information = information;
        return this;
    }

    public build() : Amazon
    {
        return this.amazon;
    }
}