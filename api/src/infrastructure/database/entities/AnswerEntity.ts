import _ from 'lodash';
import { Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';

import { Answer } from '../../../domain/models/Answer';

import { ChoiceEntity } from './ChoiceEntity';
import { GameEntity } from './GameEntity';
import { PlayerEntity } from './PlayerEntity';
import { QuestionEntity } from './QuestionEntity';
import { TurnEntity } from './TurnEntity';

@Entity({ name: 'answer' })
export class AnswerEntity {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @ManyToOne(() => PlayerEntity, { nullable: false })
  player!: PlayerEntity;

  @ManyToOne(() => QuestionEntity, { nullable: false })
  question!: QuestionEntity;

  @OneToMany(() => ChoiceEntity, (choice) => choice.answer, { nullable: false })
  choices!: ChoiceEntity[];

  @ManyToOne(() => GameEntity, (game) => game.currentAnswers, { nullable: true })
  current_of_game!: GameEntity;

  @ManyToOne(() => TurnEntity, (turn) => turn.answers, { nullable: true })
  current_of_turn!: TurnEntity;

  static toPersistence(answer: Answer, gameId: string): AnswerEntity {
    const entity = new AnswerEntity();

    entity.id = answer.id;
    entity.player = PlayerEntity.toPersistence(answer.player);
    entity.question = QuestionEntity.toPersistence(answer.question, gameId);
    entity.choices = answer.choices.map((choice, index) => ChoiceEntity.toPersistence(choice, gameId, index + 1));

    return entity;
  }

  static toDomain(entity: AnswerEntity): Answer {
    const answer = new Answer(
      PlayerEntity.toDomain(entity.player),
      QuestionEntity.toDomain(entity.question),
      _.orderBy(entity.choices, 'position').map(ChoiceEntity.toDomain),
    );

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    answer.id = entity.id;

    return answer;
  }
}
