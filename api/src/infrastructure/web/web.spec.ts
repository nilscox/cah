import { expect } from 'chai';
import { IsInt } from 'class-validator';
import request from 'supertest';

import { StubEventPublisher } from '../stubs/StubEventPublisher';

import { HttpUnauthorizedError } from './errors';
import { bootstrapServer } from './index';
import { Route } from './Route';

describe('web', () => {
  it('registers a handler returning nothing', async () => {
    const app = bootstrapServer([new Route('get', '/nothing')]);

    const { status } = await request(app).get('/nothing');

    expect(status).to.eql(200);
  });

  it('registers a handler executing a command and returning an output', async () => {
    const publisher = new StubEventPublisher();

    const execute = () => {
      publisher.publish({ 42: true });
      return { yolo: false };
    };

    const app = bootstrapServer([new Route('get', '/test').use({ execute })]);

    const { body } = await request(app).get('/test');

    expect(body).to.eql({ yolo: false });
    expect(publisher.events).to.deep.include({ 42: true });
  });

  it("validates the handler's input", async () => {
    class InputDto {
      @IsInt({ message: 'not an int' })
      saw!: number;

      constructor(body: unknown) {
        Object.assign(this, body);
      }
    }

    const routes = [
      new Route('post', '/test')
        .dto((body) => new InputDto(body))
        .use({
          execute(input: { saw: number }) {
            expect(input.saw).to.eql(6);
          },
        }),
    ];

    const app = bootstrapServer(routes);

    const { body } = await request(app).post('/test').expect(400);

    expect(body).to.shallowDeepEqual({
      message: 'Validation errors',
      errors: [
        {
          property: 'saw',
          constraints: { isInt: 'not an int' },
        },
      ],
    });

    await request(app).post('/test').send({ saw: 6 }).expect(200);
  });

  it('terminates the request when the handler throws', async () => {
    const routes = [
      new Route('post', '/private').use({
        execute() {
          throw new HttpUnauthorizedError('dont do that');
        },
      }),
      new Route('post', '/not-working').use({
        execute() {
          throw new Error('nope.');
        },
      }),
    ];

    const app = bootstrapServer(routes);

    await request(app).post('/private').expect(401).expect({ message: 'dont do that' });
    await request(app).post('/not-working').expect(500).expect({ message: 'nope.' });
    await request(app).post('/nowhere').expect(404);
  });
});
