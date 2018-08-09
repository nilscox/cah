const validate = require('./validator-validate.test');
const game = require('./validator-game.test');
const player = require('./validator-player.test');

describe('validator', () => {

  describe('validate', () => {

    it('should validate a model with a missing required field', validate.missingField);
    it('should validate a model with a given read only field', validate.readOnlyField);
    it('should validate a model with a failing field', validate.failure);
    it('should validate a model', validate.success);

  });

  describe('player', () => {

    describe('crud', () => {

      it('should not create a new player without a nick');
      it('should not create a new player with nick null');
      it('should not create a new player with nick a number');
      it('should not create a new player with nick of length < 3');
      it('should not create a new player with nick of length > 64');
      it('should not create a new player with a reserved nick');
      it('should not create a new player with an already existing nick');
      it('should not create a new player with an avatar');

      it('should not update an existing player\'s nick');

    });

  });

  describe('game', () => {

    describe('crud', () => {

      it('should not create a game with lang is missing');
      it('should not create a game with a language of type number');
      it('should not create a game with an invalid language');
      it('should not create a game with a state');

      it('should not update a game\'s language');

    });

    describe('loop', () => {

      it('should not submit an answer when choiceIds is missing');
      it('should not submit an answer when choiceIds are not numbers');
      it('should not submit an answer when player dont have the cards');
      it('should not submit an answer when choices number dont match');

      it('should not select an answer when answerId is missing');
      it('should not select an answer when answerId is not a number');
      it('should not select an answer when choice is not within propositions');

    });

  });

});
