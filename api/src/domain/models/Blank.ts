import { ValueObject } from '../../ddd/ValueObject';
import { creatorsFactory } from '../../utils/entityCreators';

export class Blank extends ValueObject<number> {
  get place() {
    return this.value;
  }
}

type BlankProps = {
  text: string;
  blanks: Blank[];
};

const blankCreators = creatorsFactory<Blank, BlankProps>((index) => {
  return new Blank(index);
});

export const { createOne: createBlank, createMany: createBlanks } = blankCreators;
