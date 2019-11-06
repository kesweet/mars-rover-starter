const assert = require('assert');
const Rover = require('../rover.js');
const Message = require('../message.js');
const Command = require('../command.js');

describe("Rover class", function() {

  it('constructor sets position and default values for mode and generatorWatts', function() {
    let object1 = new Rover ("Position");
    assert.strictEqual(object1.position, "Position");
    assert.strictEqual(object1.mode, "NORMAL");
    assert.strictEqual(object1.generatorWatts, 110)
  });

  it("response returned by receiveMessage contains name of message", function() {
    let commands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('STATUS_CHECK')];
    let message = new Message('e1', commands);
    let rover = new Rover(98382);
    let response = rover.receiveMessage(message);
    assert.strictEqual(response.messageFromRover, "e1");
  });

  it("response returned by receiveMessage includes two results, if two commands are sent in message", function() {
    let commands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('STATUS_CHECK')];
    let message = new Message('e1', commands);
    let rover = new Rover(98382);
    let response = rover.receiveMessage(message);
    assert.strictEqual(response.results.length, 2);
  });

  it("responds correctly to status check", function () {
    let commands = [new Command('STATUS_CHECK')];
    let message = new Message('e1', commands);
    let rover = new Rover(98382);
    let response = rover.receiveMessage(message);
    assert.deepStrictEqual(response, {messageFromRover: 'e1', results: [{completed: true, mode: 'NORMAL', generatorWatts: 110, position: 98382}]});
    assert.strictEqual(response.results[0].completed, true);
    assert.strictEqual(response.results[0].mode, 'NORMAL');
    assert.strictEqual(response.results[0].generatorWatts, 110);
    assert.strictEqual(response.results[0].position, 98382);
  });

  it("responds with correct status after MODE_CHANGE", function() {
    let commands = [new Command('MODE_CHANGE', 'LOW_POWER')];
    let message = new Message('e1', commands);
    let rover = new Rover(98382);
    let response = rover.receiveMessage(message);
    assert.strictEqual(rover.mode, 'LOW_POWER');
  });

  it("responds with false completed value, if attempt to move while in LOW_POWER mode", function() {
    let commands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command ('MOVE', 350)];
    let message = new Message('e1', commands);
    let rover = new Rover(98382);
    let response = rover.receiveMessage(message);
    assert.strictEqual(response.results[1].completed, false);
  });

  it("responds with position for move command", function() {
    let commands = [new Command ('MOVE', 350)];
    let message = new Message('e1', commands);
    let rover = new Rover(98382);
    let response = rover.receiveMessage(message);
    assert.strictEqual(response.results[0].position, 98732);
  });

  it("Responds with completed false and a message for an unknown command", function() {
    let commands = [new Command ('RETRACT', 300)];
    let message = new Message('e1', commands);
    let rover = new Rover(98382);
    let response = rover.receiveMessage(message);
    assert.strictEqual(response.results[0].completed, false);
    assert.strictEqual("e1 is an Unknown Command", response.messageFromRover)
  });

});