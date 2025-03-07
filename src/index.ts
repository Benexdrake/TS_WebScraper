import puppeteer, { Browser, ElementHandle, Page } from "puppeteer";
import { Crunchyroll_API } from "./Crunchyroll/Controller/Crunchyroll_API";
import { Pokemon_API } from "./Pokemon/Pokemon_API";
import { Pokemon } from "./Pokemon/Models/Pokemon";
import { Amazon_API } from "./Amazon/Amazon_API";
import { AniDb_API } from "./AniDb/Controller/AniDb_API";
import { getQuiz } from "./Techstarter-Quiz/TQ_API";
import { getQuestions } from "./BrainDumps/QUESTION_API";
import { github_questions } from "./Github";
import { save_image } from "./lib/helper";

import axios from "axios";

import fs from 'fs';

import pokemons from './Pokemon.json'

let main = async () =>
{

}

main();