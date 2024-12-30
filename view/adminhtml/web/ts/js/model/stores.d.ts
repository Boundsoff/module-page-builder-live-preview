import {Dictionary} from "underscore";

export type StoreInformation = { id: string, code: string, name: string, baseUrl: string };

declare const active: KnockoutObservable<StoreInformation | null>;
declare const counter: KnockoutObservable<Dictionary<number>>;
