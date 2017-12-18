import {Thing} from "./Thing";

export interface ThingsArray<Kind extends string,Data> {
    things: Thing<Kind,Data>[]
}