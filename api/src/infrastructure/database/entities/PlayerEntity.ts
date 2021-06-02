import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { ChoiceEntity } from './ChoiceEntity';
import { GameEntity } from './GameEntity';

@Entity({ name: 'player' })
export class PlayerEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  nick!: string;

  @ManyToOne(() => GameEntity, (game) => game.players)
  game?: GameEntity;

  @OneToMany(() => ChoiceEntity, (choice) => choice.player, { eager: true })
  cards!: ChoiceEntity[];

  is(other?: PlayerEntity) {
    return this.id === other?.id;
  }
}
