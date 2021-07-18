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

  @ManyToOne(() => AnswerEntity, (answer) => answer.choices)
  answer!: AnswerEntity[];

  @ManyToOne(() => GameEntity, { nullable: false })
  game!: GameEntity;

  @Column()
  gameId!: string;

  @ManyToOne(() => PlayerEntity, (player) => player.cards)
  player!: PlayerEntity;

  static toPersistence(choice: Choice, gameId: string): ChoiceEntity {
    const entity = new ChoiceEntity();

    entity.id = choice.id;
    entity.text = choice.text;
    entity.gameId = gameId;

    return entity;
  }

  static toDomain(entity: ChoiceEntity): Choice {
    const choice = new Choice(entity.text);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    choice.id = entity.id;

    return choice;
  }
}
