const { KmsKeyringNode, encrypt, decrypt } = require('@aws-crypto/client-node');
const { KMS_CONTEXT } = require('./Config');

class Logger {
    constructor(name) {
        this.name = name;
    }

    log(...msg) {
        console.log(`[${this.name}] ${msg}`);
    }
}


const KMS_ENCRYPTION = async plaintext => {
    const generatorKeyId = process.env.KmsKeyId;
    const keyring = new KmsKeyringNode({ generatorKeyId });
    const { result } = await encrypt(keyring, plaintext, { encryptionContext: KMS_CONTEXT });
    return result;
};

const KMS_DECRYPTION = async encryptedPlaintext => {
    const generatorKeyId = process.env.KmsKeyId;
    const keyring = new KmsKeyringNode({ generatorKeyId });
    const { plaintext, messageHeader } = await decrypt(keyring, encryptedPlaintext);
    const { encryptionContext } = messageHeader;
    Object
        .entries(KMS_CONTEXT)
        .forEach(([key, value]) => {
            if (encryptionContext[key] !== value) throw new Error('Encryption Context does not match expected values');
        });
    return plaintext.toString();
};

module.exports = { Logger, KMS_DECRYPTION, KMS_ENCRYPTION };
