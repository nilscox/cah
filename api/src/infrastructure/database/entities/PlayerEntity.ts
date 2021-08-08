import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';

import { Player } from '../../../domain/models/Player';

import { ChoiceEntity } from './ChoiceEntity';
import { GameEntity } from './GameEntity';

@Entity({ name: 'player' })
export class PlayerEntity {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @Column()
  nick!: string;

  @Column()
  hasFlushed!: boolean;

  @ManyToOne(() => GameEntity, (game) => game.players)
  game?: GameEntity;

  @Column({ nullable: true })
  gameId?: string;

  @OneToMany(() => ChoiceEntity, (choice) => choice.player)
  cards!: ChoiceEntity[];

  static toPersistence(player: Player): PlayerEntity {
    const gameId = player.gameId;
    const entity = new PlayerEntity();

    entity.id = player.id;
    entity.nick = player.nick;
    entity.hasFlushed = player.hasFlushed;
    entity.gameId = gameId;

    if (gameId && player.cards) {
      entity.cards = player.cards.map((choice) => ChoiceEntity.toPersistence(choice, gameId));
    } else {
      entity.cards = [];
    }

    return entity;
  }

  static toDomain(entity: PlayerEntity): Player {
    const player = new Player(entity.nick);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    player.id = entity.id;
    player.hasFlushed = entity.hasFlushed;
    player.cards = entity.cards?.map(ChoiceEntity.toDomain);
    player.gameId = entity.gameId;

    return player;
  }
}
