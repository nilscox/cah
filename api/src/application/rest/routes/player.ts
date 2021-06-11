import { classToPlain, Expose } from 'class-transformer';
import { Router } from 'express';
import { Container } from 'typedi';

import { Choice } from '../../../domain/entities/Choice';
import { Player } from '../../../domain/entities/Player';
import { Authenticate } from '../../../domain/use-cases/Authenticate';
import { isPlayer } from '../guards/isPlayer';

declare module 'express-session' {
  interface SessionData {
    playerId: number;
  }
}

class ChoiceDto {
  constructor(values: Choice) {
    this.text = values.text;
  }

  @Expose()
  text: string;
}

class PlayerDto {
  constructor(values: Player) {
    this.nick = values.nick;
  }

  @Expose()
  nick: string;
}

class InGamePlayerDto extends PlayerDto {
  constructor(values: Player) {
    super(values);
    this.cards = values.cards.map((choice) => new ChoiceDto(choice));
  }

  @Expose()
  cards: ChoiceDto[];
}

export const router = Router();

const formatPlayer = (player: Player) => {
  const Cls = player.game ? InGamePlayerDto : PlayerDto;

  return classToPlain(new Cls(player));
};

router.post('/', async (req, res, next) => {
  try {
    const { player, created } = await Container.get(Authenticate).authenticate(req.body.nick);

    req.session.playerId = player.id;

    if (created) {
      res.status(201);
    }

    res.json(formatPlayer(player));
  } catch (error) {
    next(error);
  }
});

router.get('/me', isPlayer, (req, res) => {
  res.json(formatPlayer(req.player!));
});
