import { createClient } from 'redis';

const client = createClient({
    username: 'default',
    password: 'eI6kwarE4KL91I4kuAaS31ZjStiil8a5',
    socket: {
        host: 'redis-10361.c264.ap-south-1-1.ec2.redns.redis-cloud.com',
        port: 10361
    }
})
client.on(
    'error',
    (err) => {
        console.log(err || "Redis connection failed!")
        return err
    })

client.connect();

export {
    client
};