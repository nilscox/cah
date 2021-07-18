import io, { Socket } from 'socket.io-client';

export class WSAdapter {
  private io?: Socket;

  async connect(url: string): Promise<void> {
    this.io = io(url);

    await new Promise<void>((resolve) => this.io?.on('connect', resolve));
  }
}
