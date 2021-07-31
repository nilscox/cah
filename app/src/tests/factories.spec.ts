import expect from 'expect';

import { factory } from './factories';

describe('factories', () => {
  type Foo = {
    yo: number;
    plait: string;
    fraise: boolean;
  };

  const [createFoo, createFoos] = factory<Foo>((index) => ({
    yo: 0,
    plait: 'plait',
    fraise: index % 2 === 1,
  }));

  it('creates an object with default values', () => {
    const someFoo = createFoo();

    expect(someFoo).toEqual({ yo: 0, plait: 'plait', fraise: false });
  });

  it('creates an object with overrides', () => {
    const someFoo = createFoo({ yo: 2048 });

    expect(someFoo).toEqual({ yo: 2048, plait: 'plait', fraise: false });
  });

  it('creates multiple objects from an array factory', () => {
    const someFoos = createFoos(3, { plait: ['plait1', 'plait2'] });

    expect(someFoos).toEqual([
      { yo: 0, plait: 'plait1', fraise: false },
      { yo: 0, plait: 'plait2', fraise: true },
      { yo: 0, plait: 'plait', fraise: false },
    ]);
  });

  it('creates multiple objects from a partial array factory', () => {
    const someFoos = createFoos(2, { plait: ['plait1'] });

    expect(someFoos).toEqual([
      { yo: 0, plait: 'plait1', fraise: false },
      { yo: 0, plait: 'plait', fraise: true },
    ]);
  });

  it('creates multiple turns from a function factory', () => {
    const otherFoos = createFoos(3, { fraise: (n) => n % 3 === 0 });

    expect(otherFoos).toEqual([
      { yo: 0, plait: 'plait', fraise: true },
      { yo: 0, plait: 'plait', fraise: false },
      { yo: 0, plait: 'plait', fraise: false },
    ]);
  });

  it("'s even possible to compose factories!", () => {
    type Bar = {
      bestFoo: Foo;
      worstFoos: Foo[];
    };

    const [, createBars] = factory<Bar>((index) => ({
      bestFoo: createFoo(),
      worstFoos: createFoos(2, {
        yo: [6],
        plait: (n) => `${index + 1}-${n + 1}`,
        fraise: (n) => n !== index,
      }),
    }));

    const bars = createBars(2, { bestFoo: createFoo({ yo: 42 }) });

    expect(bars).toEqual([
      {
        bestFoo: { yo: 42, plait: 'plait', fraise: false },
        worstFoos: [
          { yo: 6, plait: '1-1', fraise: false },
          { yo: 0, plait: '1-2', fraise: true },
        ],
      },
      {
        bestFoo: { yo: 42, plait: 'plait', fraise: false },
        worstFoos: [
          { yo: 6, plait: '2-1', fraise: true },
          { yo: 0, plait: '2-2', fraise: false },
        ],
      },
    ]);
  });
});
