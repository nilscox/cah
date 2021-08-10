import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

import { Choice } from '../../../domain/models/Choice';

import { AnswerEntity } from './AnswerEntity';
import { GameEntity } from './GameEntity';
import { PlayerEntity } from './PlayerEntity';

@Entity({ name: 'choice' })
export class ChoiceEntity {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @Column()
  text!: string;

  @Column()
  caseSensitive!: boolean;

  @Column({ nullable: true })
  position!: number;

  @Column({ default: true })
  available!: boolean;

  @ManyToOne(() => AnswerEntity, (answer) => answer.choices)
  answer!: AnswerEntity[];

  @ManyToOne(() => GameEntity, { nullable: false })
  game!: GameEntity;

  @Column()
  gameId!: string;

  @ManyToOne(() => PlayerEntity, (player) => player.cards)
  player!: PlayerEntity;

  static toPersistence(choice: Choice, gameId: string, position?: number): ChoiceEntity {
    const entity = new ChoiceEntity();

    entity.id = choice.id;
    entity.text = choice.text;
    entity.caseSensitive = choice.caseSensitive;
    entity.available = choice.available;
    entity.gameId = gameId;

    if (position) {
      entity.position = position;
    }

    return entity;
  }

  static toDomain(entity: ChoiceEntity): Choice {
    const choice = new Choice(entity.text, entity.caseSensitive);

    // todo
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    choice.id = entity.id;
    choice.available = entity.available;

    return choice;
  }
}
