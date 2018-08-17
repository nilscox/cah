describe('test', () => {
  it('socketio', function() {
    return this.app
      .get('/socket.io')
      .expect(200);
  });
});
