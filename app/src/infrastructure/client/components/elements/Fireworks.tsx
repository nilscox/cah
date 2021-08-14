import React, { useEffect, useRef, useState } from 'react';

import { FullScreen } from '../layout/FullScreen';

type Listener = () => void;

class EventEmitter {
  listeners: { [event: string]: Listener[] } = {};

  addListener(event: string, listener: Listener) {
    this.listeners[event] = [...(this.listeners[event] ?? []), listener];
  }

  emit(event: string) {
    this.listeners[event]?.forEach((listener) => listener());
  }
}

export class Color {
  red: number;
  green: number;
  blue: number;
  alpha: number;

  constructor(red: number, green: number, blue: number, alpha = 255) {
    this.red = ~~red;
    this.green = ~~green;
    this.blue = ~~blue;
    this.alpha = ~~alpha;
  }

  static fromString(hex: string) {
    const match = /^#([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})?/.exec(hex);

    if (!match) {
      throw new Error(`Invalid color format "${hex}"`);
    }

    return new Color(
      parseInt(match[1], 16),
      parseInt(match[2], 16),
      parseInt(match[3], 16),
      parseInt(match[4] ?? 'FF', 16),
    );
  }

  toString() {
    return '#' + [this.red, this.green, this.blue, this.alpha].map((c) => c.toString(16).padStart(2, '0')).join('');
  }

  clone() {
    return new Color(this.red, this.green, this.blue, this.alpha);
  }

  transparentize(factor: number): Color {
    return new Color(this.red, this.green, this.blue, this.alpha * (1 - factor));
  }
}

class V {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  get angle() {
    return Math.atan2(this.y, this.x);
  }

  clone() {
    return new V(this.x, this.y);
  }

  add(o: V): V {
    const { x, y } = this;

    return new V(x + o.x, y + o.y);
  }

  mult(s: number): V {
    const { x, y } = this;

    return new V(x * s, y * s);
  }

  dist(o: V) {
    const a = this.x - o.x;
    const b = this.y - o.y;

    return Math.sqrt(a * a + b * b);
  }
}

class Pixel {
  position: V;
  color: Color;

  constructor(position: V, color: Color) {
    this.position = position;
    this.color = color;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color.toString();
    ctx.fillRect(this.position.x, this.position.y, 2, 2);
  }
}

class Particle {
  position: V;
  velocity: V;
  color: Color;

  start: V;
  pixels: Pixel[] = [];

  constructor(position: V, velocity: V, color: Color) {
    this.position = position;
    this.velocity = velocity;
    this.color = color;

    this.start = position.clone();
  }

  update() {
    this.position = this.position.add(this.velocity);

    this.pixels.push(new Pixel(this.position, this.color.clone()));

    for (const pixel of this.pixels) {
      pixel.color = pixel.color.transparentize(0.1);

      if (pixel.color.alpha < 1) {
        this.pixels.splice(this.pixels.indexOf(pixel), 1);
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    for (const pixel of this.pixels) {
      pixel.draw(ctx);
    }
  }
}

const now = () => new Date().getTime();

class Explosion extends EventEmitter {
  center: V;
  size: number;

  start: number;
  particles: Particle[] = [];

  constructor(center: V, size: number) {
    super();

    this.center = center;
    this.size = size;

    this.start = now();

    for (let i = 0; i < 30; ++i) {
      this.particles.push(new Particle(this.center, randomVector().mult(size), new Color(255, 255, 255)));
    }
  }

  update() {
    const stop = now() - this.start > 1000 * this.size;
    let end = false;

    for (const particle of this.particles) {
      particle.velocity.y += 0.01;
      particle.update();

      if (stop) {
        particle.color = particle.color.transparentize(0.05);

        if (particle.color.alpha < 1) {
          end = true;
        }
      }
    }

    if (end) {
      this.emit('end');
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    for (const particles of this.particles) {
      particles.draw(ctx);
    }
  }
}

class Firework extends EventEmitter {
  center: V;

  riser?: Particle;
  explosion?: Explosion;

  constructor(center: V, height: number) {
    super();

    this.center = center;

    this.riser = new Particle(new V(center.x, height), new V(0, -1).mult(rand(2, 5)), Color.fromString('#FFFFFF66'));
  }

  update() {
    if (this.riser) {
      this.riser.update();

      if (this.riser.position.y < this.center.y) {
        this.riser = undefined;

        this.explosion = new Explosion(this.center, rand(0.8, 1.4));
        this.explosion.addListener('end', () => this.emit('end'));
      }
    }

    if (this.explosion) {
      this.explosion.update();
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.riser?.draw(ctx);
    this.explosion?.draw(ctx);
  }
}

const rand = (min: number, max: number) => Math.random() * (max - min) + min;

const randomVector = () => {
  const angle = rand(0, 2 * Math.PI);

  return new V(Math.sin(angle), Math.cos(angle));
};

const rad2deg = (rad: number) => (rad * 180) / Math.PI;

const setup = (canvas: HTMLCanvasElement | null) => {
  if (canvas === null) {
    return;
  }

  const { width, height } = canvas;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return;
  }

  const fireworks: Firework[] = [];

  const addFirework = () => {
    const firework = new Firework(new V(rand(20, canvas.width - 20), rand(50, canvas.height - 200)), canvas.height);

    firework.addListener('end', () => {
      fireworks.splice(fireworks.indexOf(firework), 1);
    });

    fireworks.push(firework);
  };

  const interval = setInterval(() => {
    if (fireworks.length < 6) {
      addFirework();
    }
  }, 1000);

  let af = requestAnimationFrame(function frame() {
    ctx.clearRect(0, 0, width, height);

    for (const firework of fireworks) {
      firework.update();
      firework.draw(ctx);
    }

    af = requestAnimationFrame(frame);
  });

  return () => {
    clearInterval(interval);
    cancelAnimationFrame(af);
  };
};

export const Fireworks: React.FC = () => {
  const [size, setSize] = useState<[number, number]>();
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (size && ref.current) {
      return setup(ref.current);
    }
  }, [size, ref]);

  return (
    <FullScreen ref={(ref) => ref && !size && setSize([ref.clientWidth, ref.clientHeight])}>
      <canvas ref={ref} width={size?.[0]} height={size?.[1]} />
    </FullScreen>
  );
};
