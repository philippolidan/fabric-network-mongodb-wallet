const { Wallet } = require('fabric-network')
const { MongoDBWalletStore } = require('./MongoDBWalletStore');


exports.MongoDBWallet = async (url, dbName = 'fabric-wallets') => {
    const store = await MongoDBWalletStore.newInstance(url, dbName);
    return new Wallet(store);
}