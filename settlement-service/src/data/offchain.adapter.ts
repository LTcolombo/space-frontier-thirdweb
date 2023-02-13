import fs from 'fs';


const STARTING_BALANCE = 500;


//temporary impl. would be replaced with a custorial wallet or at least a K-V db 
export default class OffChainAdapter {


    static _instance: OffChainAdapter;

    static Instance(): OffChainAdapter {
        if (!OffChainAdapter._instance)
            OffChainAdapter._instance = new OffChainAdapter;

        return OffChainAdapter._instance;
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() {
        this.init()
    }

    async init(){
        this._balance = await OffChainAdapter._load('balances');
    }


    _balance = {};

    async getBalance(id: string): Promise<number> {
        if (this._balance[id] === undefined)
            this._balance[id] = STARTING_BALANCE;

        console.log(this._balance[id]);
        return this._balance[id];
    }

    async amendBalance(id: string, value: number): Promise<boolean> {
        if (this._balance[id] === undefined)
            this._balance[id] = STARTING_BALANCE;

        if (this._balance[id] + value < 0)
            return false;

        this._balance[id] += value;

        OffChainAdapter._save('balances', this._balance);
        return true;
    }

    private static async _load<T>(id: string): Promise<T> {
        const path = `./data/${id}`;
        return fs.existsSync(path) ? JSON.parse(await fs.promises.readFile(path, "utf-8")) : {};
    }

    private static async _save<T>(id: string, value: T): Promise<void> {
        if (!fs.existsSync("./data"))
            fs.mkdirSync("./data");

        const path = `./data/${id}`;
        await fs.promises.writeFile(path, JSON.stringify(value, null, 2));
    }

}