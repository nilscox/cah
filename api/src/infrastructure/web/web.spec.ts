import { expect } from 'chai';
import { IsInt } from 'class-validator';
import { Request } from 'express';
import request from 'supertest';

import { StubEventPublisher } from '../stubs/StubEventPublisher';

import { HttpUnauthorizedError } from './errors';
import { context, dto, errorHandler, guard, handler, middleware, status } from './middlewaresCreators';
import { FallbackRoute, Route } from './Route';
import { createServer, Route as RouteInterface } from './web';
import { WebsocketServer } from './websocket';

describe('web', () => {
  const defaultHandler = handler({ execute: () => {} });

  const createAgent = (routes: RouteInterface[]) => {
    return request.agent(createServer(routes, new WebsocketServer()));
  };

  it('registers a route doing nothing', async () => {
    const route = new Route('get', '/nothing').use(defaultHandler);
    const agent = createAgent([route]);

    await agent.get('/nothing').expect(200);
  });

  it('executes a middleware', async () => {
    const publisher = new StubEventPublisher();
    const execute = (req: Request) => void publisher.publish(req.body);

    const route = new Route('post', '/test').use(middleware({ execute })).use(defaultHandler);
    const agent = createAgent([route]);

    await agent.post('/test').send({ bo: 'dy' }).expect(200);

    expect(publisher.events).to.deep.include({ bo: 'dy' });
  });

  it('protects a route execution with a guard', async () => {
    const routes = [
      new Route('post', '/ko').use(guard(() => false)).use(defaultHandler),
      new Route('post', '/ok').use(guard(() => true)).use(defaultHandler),
      new Route('post', '/message').use(guard(() => 'nope')).use(defaultHandler),
    ];

    const agent = createAgent(routes);

    await agent.post('/ok').expect(200);
    await agent.post('/ko').expect(401);
    await agent.post('/message').expect(401).expect({ message: 'nope' });
  });

  it("validates the handler's input", async () => {
    class InputDto {
      @IsInt({ message: 'not an int' })
      saw!: number;

      constructor(body: unknown) {
        Object.assign(this, body);
      }
    }

    const execute = (input: InputDto) => {
      expect(input.saw).to.eql(6);
    };

    // prettier-ignore
    const route = new Route('post', '/test')
      .use(dto(({ body }) => new InputDto(body)))
      .use(handler({ execute }));

    const agent = createAgent([route]);

    await agent.post('/test').send({ saw: 6 }).expect(200);

    const { body } = await agent.post('/test').expect(400);

    expect(body).to.shallowDeepEqual({
      message: 'Validation errors',
      errors: [{ property: 'saw', constraints: { isInt: 'not an int' } }],
    });
  });

  it('provides a context to the handler', async () => {
    const route = new Route('get', '/test')
      .use(context((req) => req.query))
      .use(handler({ execute: (_, context) => context }));

    const agent = createAgent([route]);

    await agent.get('/test').query({ pa: 'ram' }).expect(200).expect({ pa: 'ram' });
  });

  it('specifies a status code', async () => {
    const route = new Route('get', '/test').use(status(421)).use(defaultHandler);
    const agent = createAgent([route]);

    await agent.get('/test').expect(421);
  });

  it('triggers a handler returning an output', async () => {
    const execute = () => ({ yolo: true });

    const route = new Route('get', '/test').use(handler({ execute }));
    const agent = createAgent([route]);

    await agent.get('/test').expect({ yolo: true });
  });

  it('terminates the request when the handler throws', async () => {
    const routes = [
      new Route('post', '/private').use(() => {
        throw new HttpUnauthorizedError('dont do that');
      }),
      new Route('post', '/not-working').use(() => {
        throw new Error('nope.');
      }),
    ];

    const agent = createAgent(routes);

    await agent.post('/private').expect(401).expect({ message: 'dont do that' });
    await agent.post('/not-working').expect(500).expect({ message: 'nope.' });
    await agent.post('/nowhere').expect(404);
  });

  it('registers a fallback route', async () => {
    const route = new FallbackRoute().use((req, res) => void res.json({ fall: 'back' }));
    const agent = createAgent([route]);

    await agent.get('/nowhere').expect(200).expect({ fall: 'back' });
  });

  it('registers an error handler', async () => {
    const routes = [
      new Route('get', '/fail').use(() => {
        throw new Error('catch me');
      }),
      new FallbackRoute().use(errorHandler({ execute: (error: Error) => ({ message: error.message }) })),
    ];

    const agent = createAgent(routes);

    await agent.get('/fail').expect(200).expect({ message: 'catch me' });
  });
});
