import mongoose from "mongoose";

export function connect(username: string, password: string, 
        hostname: string, option?: string) {
    const url = createUrl(`${username}:${password}`, `${hostname}/?${option}`);
    return mongoose.connect(url, {
        dbName: 'gamble',
    })
    .then(() => console.log("🍃 connected to mongodb"))
    .catch(() => console.error("error to connect mongodb"));
}

function createUrl(authenticate: string, hostOption: string): string {
    return `mongodb+srv://${authenticate}@${hostOption}`;
}
