import { Ability } from "./Ability";

export class Pokemon
{
    nr:number = 0;
    name:string ="";
    imageUrl:string = "";
    descriptions:string[] = [];
    height:string = "";
    category:string = "";
    weight:string = "";
    abilities:Ability[] = [];
    genders:string[] = [];
    types:string[] = [];
    weaknesses:string[] = [];
    evolutionIds:number[] = [];

    hp:number = 0;
    attack:number = 0;
    defense:number = 0;
    specialAttack:number = 0;
    specialDefense:number = 0;
    speed:number = 0;
}