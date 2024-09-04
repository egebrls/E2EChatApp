import crypto from "crypto";

export function hashUsername(username) {
    const hash = crypto.createHash("sha256");
    hash.update(username);
    return hash.digest("hex");
}

export const secretKey =
    process.env.SECRET_KEY ||
    "8c4638fe6e576629090b17c5092ea4bdff2ab931f3f0a646eb6fab388ef05b198c4638fe6e576629090b17c5092ea4bd";

export const key = crypto.scryptSync(secretKey, "salt", 32);

export function encrypt(text) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
    let encrypted = Buffer.concat([
        cipher.update(text, "utf8"),
        cipher.final(),
    ]);
    return iv.toString("hex") + ":" + encrypted.toString("hex");
}

export function decrypt(encrypted) {
    if (!encrypted) {
        return undefined;
    }

    const parts = encrypted.split(":");
    if (parts.length < 2) {
        throw new Error("Invalid encrypted data");
    }
    const iv = Buffer.from(parts.shift(), "hex");
    if (iv.length !== 16) {
        throw new Error("Invalid initialization vector");
    }
    const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
    let decrypted = Buffer.concat([
        decipher.update(Buffer.from(parts.join(":"), "hex")),
        decipher.final(),
    ]);
    return decrypted.toString("utf8");
}
