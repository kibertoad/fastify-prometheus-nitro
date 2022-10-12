const fastify = require('fastify');
const fastifyMetrics = require('../dist');

const app = fastify({
    ignoreTrailingSlash: true,
    trustProxy: true,
});

void (async () => {
    await app.register(fastifyMetrics, { endpoint: '/metrics' });

    app.get('/', async () => {
        return { foo: 'bar' };
    });

    app.get('/foo-bar', async () => {
        return { foo: 'bar' };
    });

    await app.ready();
    await app.listen({ port: 3001 });
})();
