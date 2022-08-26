import { rainbow } from "as-rainbow/assembly";
import { Variant as __Variant } from "as-variant/assembly"

import "wasi"

class Vec2 {
    x: f32;
    y: f32;
}

/*
class PlayerData {
    name: string;
    pos: Vec2;
}*/

const vec: Vec2 = {
    x: 1.0,
    y: -3.1
}

/*
const player: PlayerData = {
    name: "TheJairus",
    pos: {
        x: 1.0,
        y: -3.1
    }
}*/

vec["x"]
// TODO: Use transform to add .get<T>() method to the end of bracket notations
console.log(rainbow.blueBright("vec[\"x\"] " + vec["x"].toString()))
console.log(rainbow.blueBright("vec[\"y\"] " + vec["y"].toString()))
console.log(rainbow.blueBright("vec[\"x\"] + vec[\"y\"] = " + (vec["x"] + vec["y"]).toString()))