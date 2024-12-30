import ko from "knockout";
import {Dictionary} from "underscore";

export type StoreInformation = { id: string, code: string, name: string, baseUrl: string };


const active: KnockoutObservable<StoreInformation> = ko.observable(null);
const counter: KnockoutObservable<Dictionary<number>> = ko.observable({});

export default {
    active,
    counter,
}
