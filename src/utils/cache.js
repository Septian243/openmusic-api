import redis from 'redis';

class CacheService {
    constructor() {
        this.client = redis.createClient({
            socket: {
                host: process.env.REDIS_SERVER || 'localhost',
                port: 6379
            }
        });

        this.client.on('error', err => console.log('Redis Client Error', err));
        this.client.connect().catch(console.error)
    }

    async set(key, value, expirationInSecond = 1800) {
        await this.client.setEx(key, value, {
            EX: expirationInSecond
        });
    }

    async get(key) {
        const result = await this.client.get(key);
        return result;
    }

    async delete(key) {
        return await this.client.del(key);
    }
}

export default new CacheService();