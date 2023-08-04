import { getMessage } from "../src/server/telegram";

console.log(getMessage({
    address: "Prenzlauer Berg, Berlin",
    id: "!23",
    link: "/expose/144691298",
    price: "123$",
    rooms: "1",
    size: "44m2"
}).replace(/\./g, "\\."))