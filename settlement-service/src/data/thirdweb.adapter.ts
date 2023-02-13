import { NFTCollection, ThirdwebSDK } from "@thirdweb-dev/sdk";

const CHARS = [
    "Character_CyberPunk_Male_01",
    "Character_Junky_Female_01",
    "Character_Medical_Male_01",
    "Character_Monk_Male_01"
];

export default class ThirdWebAdapter {


    static _instance: ThirdWebAdapter;
    sdk: ThirdwebSDK;
    agentsContract: NFTCollection;
    creditsContract: any;


    static Instance(): ThirdWebAdapter {
        if (!ThirdWebAdapter._instance)
            ThirdWebAdapter._instance = new ThirdWebAdapter();

        return ThirdWebAdapter._instance;
    }

    private async lazyInit() {

        this.sdk = ThirdwebSDK.fromPrivateKey(process.env.PRIVATE_KEY, "mumbai");
        this.agentsContract = await this.sdk.getContract("0x11c6D5FA9c3099372545D0a353Fd9243Ed75Fd67", "nft-collection");
        this.creditsContract = await this.sdk.getContract("0x92136AF7136D75248dAEAFA677b06a7f4C46eE08", "token");
    }


    async transferCredits(to: string, amount: number): Promise<boolean> {

        await this.lazyInit();

        await this.creditsContract.mintTo(to, amount);
        return true;
    }

    async mintAgentNFT(to: string, id: string = null): Promise<boolean> {

        if (id == null) {
            id = CHARS[Math.floor(Math.random() * CHARS.length)];
        }


        const images = {
            Character_Monk_Male_01: "https://bafkreic65vfbow6ox3rijcjhigwf25lziqd5j27mwsreru3whutc36csc4.ipfs.nftstorage.link/",
            Character_Medical_Male_01: "https://bafkreiaglyrrknr6iw2ermrg7kepgvluzkuefdfqoutk43ec7lhxv5vypa.ipfs.nftstorage.link/",
            Character_CyberPunk_Male_01: "https://bafkreie722dxmfrqyyg4g5tl2yfl7cmxrk7t2f56wv2myi4nhbenmxfghe.ipfs.nftstorage.link/",
            Character_Junky_Female_01: "https://bafkreiekklp4jm7nlx7xwnflfh3k5jahjcdcrxgga34cfm2knoex34b4ry.ipfs.nftstorage.link/",
        }

        const imgUri = images[id];

        await this.lazyInit();

        const result = await this.agentsContract.erc721.mintTo(to, {
            name: `${id}_${Math.round(Math.random() * 1000)}`,
            description: "Space Frontier Agent",
            image: imgUri,
            attributes: [{ trait_type: "prefab", value: id }],
            properties: {
                files: [
                    {
                        type: 'image/png',
                        uri: imgUri,
                    },
                ]
            }
        });

        console.log(result);

        return true;


    }

    async getTokenAccounts(wallet: string) {

        // return [];
        //quick debug
        return ["Character_CyberPunk_Male_01",
        "Character_Junky_Female_01",
        "Character_Medical_Male_01",
        "Character_Monk_Male_01"];

        await this.lazyInit();
        const nfts = await this.agentsContract.erc721.getOwned(wallet);
        return nfts.map(nft=>nft.metadata.attributes?.find((a: { trait_type: string; })=>a.trait_type == "prefab")?.value);


    }
}
