import { expect } from 'chai';

import { Blank } from './Blank';
import { createChoice } from './Choice';
import { Question } from './Question';

describe('Question', () => {
  it('prevents from creating a question with an empty blanks array', () => {
    expect(() => new Question('Qui es-tu ?', [])).to.throw();
  });

  it("prints a question's text without blanks", () => {
    const question = new Question('Qui es-tu ?');

    expect(question.toString()).to.eql('Qui es-tu ? __');
  });

  it("prints a question's text without blanks with choices", () => {
    const choice = createChoice('Moi');
    const question = new Question('Qui es-tu ?');

    expect(question.toString([choice])).to.eql('Qui es-tu ? Moi');
  });

  it("prints a question's text, replacing blanks with __", () => {
    const question = new Question("J'aime beaucoup , mais je préfère .", [new Blank(16), new Blank(34)]);

    expect(question.toString()).to.eql("J'aime beaucoup __, mais je préfère __.");
  });

  it("prints a question's text, replacing blanks with choices", () => {
    const choices = [createChoice("L'infra"), createChoice('Coder')];
    const question = new Question("J'aime beaucoup , mais je préfère .", [new Blank(16), new Blank(34)]);

    expect(question.toString(choices)).to.eql("J'aime beaucoup l'infra, mais je préfère coder.");
  });

  it("correctly handles the choices' case sensitivity", () => {
    const choices = [createChoice('Patrick Sébastien', { caseSensitive: true }), createChoice('Regarder netflix')];
    const question = new Question("J'aime beaucoup , mais je préfère .", [new Blank(16), new Blank(34)]);

    expect(question.toString(choices)).to.eql("J'aime beaucoup Patrick Sébastien, mais je préfère regarder netflix.");
  });
});
