import io, { Socket } from 'socket.io-client';

export class WSAdapter {
  private io?: Socket;

  async connect(url: string): Promise<void> {
    this.io = io(url, { transports: ['websocket', 'polling'] });

    await new Promise<void>((resolve) => this.io?.on('connect', resolve));
  }

  onMessage<T>(listener: (message: T) => void) {
    this.io?.on('message', listener);
  }
}
