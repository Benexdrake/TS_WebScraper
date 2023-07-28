import { ElementHandle, Page } from "puppeteer";
import { Pokemon } from "./Models/Pokemon";
import { Ability } from "./Models/Ability";

export class Pokemon_API
{
    constructor(private page:Page){}

    public async getPokemon(nr:number) : Promise<Pokemon[]>
    {
        const pokemons:Pokemon[] = [];

        await this.page.goto(`https://www.pokemon.com/us/pokedex/${nr}`,{waitUntil: 'networkidle2'});
        
        const title = await this.page.$$('div.pokedex-pokemon-pagination-title');
        if(title.length >0)
        {
            const name = (await title[0].evaluate(x => x.innerText)).split(' ')[0];

            const variantHeader = await this.page.$$('div.custom-select-menu')
            if(variantHeader.length > 0)
            {
                const variants = await variantHeader[0].$$('li');
                if(variants.length > 0)
                {
                    for (let i = 0; i < variants.length; i++) 
                    {
                        const variantName = await variants[i].evaluate(x => x.innerText);
                        const p = await this.getPokemonDetails(i, variantName, this.page);
                        if(i > 0)
                            p.variant = true
                        
                        p.nr = nr;
                        pokemons.push(p);
                    }
                }
            }
            else
            {
                const p = await this.getPokemonDetails(0,name,this.page);
                p.nr = nr;
                pokemons.push(p);
            }
        }
        return pokemons;
    }

    private async getPokemonDetails(i:number, name:string, page:Page) : Promise<Pokemon>
    {
        const p = new Pokemon();
        p.name = name;
        p.imageUrl = await this.getImageUrl(page, i);
        p.hp = await this.getStat(page,i,0);
        p.attack = await this.getStat(page,i,1);
        p.defense = await this.getStat(page,i,2);
        p.specialAttack = await this.getStat(page,i,3);
        p.specialDefense = await this.getStat(page,i,4);
        p.speed = await this.getStat(page,i,5);
        p.descriptions = await this.getDescription(page,i);
        
        const pokemonAbilityInfo = await page.$$('div.pokemon-ability-info');
        if(pokemonAbilityInfo.length > 0)
        {
            const lis = await pokemonAbilityInfo[i].$$('li');
            if(lis.length > 0)
            {   
                p.height = await this.getAttribute(lis, 0);
                p.weight = await this.getAttribute(lis,1);
                p.category = await this.getAttribute(lis,3);
                p.genders = await this.getGenders(lis,2);
                p.abilities = await this.getAbilities(pokemonAbilityInfo[i]);
            }
        }    
            
        const pokemonAttributes = await page.$$('div.pokedex-pokemon-attributes');
        
        if(pokemonAttributes.length > 0)
        {
            p.types = await this.getTypesOrWeaknesses(pokemonAttributes[i],'div.dtm-type');
            p.weaknesses = await this.getTypesOrWeaknesses(pokemonAttributes[i],'div.dtm-weaknesses');
            p.evolutionIds = await this.getEvolutions(page);
        }

        return p;
    }

    private async getEvolutions(page: Page): Promise<number[]> 
    {
        const evolutions:number[] = [];
        const evolutionHeader = await page.$$('section.pokedex-pokemon-evolution');
        if(evolutionHeader.length > 0)
        {
            const numbers = await evolutionHeader[0].$$('span.pokemon-number');
            for(const n of numbers)
            {
                const text = (await n.evaluate(x => x.innerText)).replace('#','');
                const number = parseInt(text);
                evolutions.push(number);
            }
        }
        return evolutions;
    }

    private async getTypesOrWeaknesses(pokemonAttributes: ElementHandle<HTMLDivElement>, search:string): Promise<string[]> 
    {
        const dtm = await pokemonAttributes.$$(search);
        const types:string[] = []; 
        if(dtm.length > 0)
        {
            const dtmNodes = await dtm[0].$$('a');
            for(const tn of dtmNodes)
            {
                const text = (await tn.evaluate(x => x.innerText)).trim();
                types.push(text);
            }
        }
        return types;
    }

    private async getAbilities(pokemonAbilityInfo: ElementHandle<HTMLDivElement>): Promise<Ability[]> 
    {
        const abilities:Ability[] = [];
        const pokemonAbilities = await pokemonAbilityInfo.$$('div.pokemon-ability-info-detail');
        if(pokemonAbilities.length > 0)
        {
            const h3s = await pokemonAbilities[0].$$('h3');
            const ps = await pokemonAbilities[0].$$('p');

            for(let j = 0; j < h3s.length; j++)
            {
                const ability:Ability = new Ability();
                const h3Text = await h3s[j].evaluate(x => x.innerText);
                const pText = await ps[j].evaluate(x => x.innerText);
                ability.name = h3Text;
                ability.description = pText;
                abilities.push(ability);
            }
        }
        return abilities;
    }

    private async getGenders(lis: ElementHandle<HTMLLIElement>[], n: number): Promise<string[]> 
    {
        const genders:string[] = []
        const value = await lis[n].$$('i.icon');
        if(value.length > 0)
        {
            for(const v of value)
            {
                const icon = await v.evaluate(x => x.getAttribute('class'));
                if(icon?.includes('female'))
                genders.push('female')
                else if(icon?.includes('male'))
                genders.push('male')
            }
        }
        else
        {
            genders.push('unknown');
        }
        return genders;
    }

    private async getDescription(page: Page, i: number): Promise<string[]> 
    {
        const pokedexDetailsRight = await page.$$('div.pokedex-pokemon-details-right');
        if(pokedexDetailsRight.length > 0)
        {
            const versionDescriptions = await pokedexDetailsRight[0].$$('div.version-descriptions');
            if(versionDescriptions.length > 0)
            {
                const text = await versionDescriptions[i].$$('p');
                if(text.length > 0)
                {
                    const descriptions:string[] = []

                    for(const t of text)
                    {
                        const desc = (await t.evaluate(x => x.innerText)).trim();
                        descriptions.push(desc);
                    }
                    return descriptions;
                }
            }
        }
        return [];
    }

    private async getStat(page: Page, i: number, n: number): Promise<number> 
    {
        const pokemonStatsInfo = await page.$$('div.pokemon-stats-info');
        if(pokemonStatsInfo.length > 0)
        {
            const gauge = await pokemonStatsInfo[i].$$('ul.gauge');
            
            // Get Status Methode 1-6 HP, Atk and more
            const meter = await gauge[n].$$('li.meter');
            if(meter.length > 0)
            {
                const value = await meter[0].evaluate(x => x.getAttribute('data-value')) || "";
                return parseInt(value);
            }
        }
        return 0;
    }

    private async getImageUrl(page: Page, i:number) :Promise<string>
    {
        const imageHeader = await page.$$('div.pokedex-pokemon-profile');
        if(imageHeader.length > 0)
        {
            const images = await imageHeader[0].$$('img');
            if(images.length > 0)
            {
                const imageUrlSplit = (await images[i].evaluate(x => x.outerHTML)).split('"');
                if(imageUrlSplit.length > 0)
                {
                    for(const image of imageUrlSplit)
                    {
                        if(image.includes('https://assets.pokemon.com'))
                        {
                            return image;
                        }
                    }
                }
            }
        }
        return "";
    }
    
    private async getAttribute(lis:  ElementHandle<HTMLLIElement>[], n:number): Promise<string> 
    {
        const value = await lis[n].$$('span.attribute-value');
        if(value.length > 0)
        {
            const valueText = (await value[0].evaluate(x => x.innerText)).trim().replace('+', '');
            return valueText;
        }
        return ""   
    }
}