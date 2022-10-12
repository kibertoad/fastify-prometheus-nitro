import { afterAll, afterEach, describe, expect, test } from '@jest/globals';
import fastify from 'fastify';
import promClient from 'prom-client';
import fastifyPlugin from '../';

describe('exports', () => {
  test('fastify plugin exported', async () => {
    expect(fastifyPlugin).toBeDefined();
  });
});

describe('plugin', () => {
  afterEach(() => {
    promClient.register.clear();
  });

  describe('registers with default name', () => {
    const app = fastify();

    afterAll(async () => {
      return app.close();
    });

    test('exposes prom-client api', async () => {
      await expect(app.register(fastifyPlugin)).resolves.toBeDefined();
      await expect(app.ready()).resolves.toBeDefined();
      expect(app.promNitro).toBeDefined();
      expect(app.promNitro.client).toBeDefined();
    });
  });
});
