const MongoClient = require('mongodb').MongoClient;

class MongoDBWalletStore {
    constructor(db) {
        this.db = db;
    }
    static async newInstance(config, dbName = 'fabric-wallets') {
        const db = await MongoClient.connect(config);
        let dbo = db.db(dbName);
        dbo = dbo.collection('wallet');
        return new MongoDBWalletStore(dbo);
    }
    async remove(label) {
        const document = await this.getDocument(label);
        if (document) {
            await this.db.deleteOne({
                key: document.key,
                _rev: document._rev
            });
        }
    }
    async get(label) {
        const document = await this.getDocument(label);
        return document ? Buffer.from(document.data) : undefined;
    }
    async list() {
        const response = await this.db.find({});
        return response.rows.map((row) => row.key);
    }
    async put(label, data) {
        const newDocument = {
            key: label,
            data: data.toString(),
        };
        // Overwrite any existing document revision instead of creating a new revision
        const existingDocument = await this.getDocument(label);
        if (existingDocument) {
            newDocument._rev = existingDocument._rev;
        }
        await this.db.insertOne(newDocument);
    }
    async getDocument(label) {
        try {
            return await this.db.findOne({ key: label });
        }
        catch (error) {
            // TODO: Log error
        }
        return undefined;
    }
}

exports.MongoDBWalletStore = MongoDBWalletStore;