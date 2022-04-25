import { CommandHandler } from '../../../ddd/CommandHandler';
import { SessionStore } from '../../interfaces/SessionStore';

export class LogoutCommand {}

export class LogoutHandler implements CommandHandler<LogoutCommand, void, SessionStore> {
  async execute(_: LogoutCommand, session: SessionStore) {
    session.player = undefined;
  }
}
