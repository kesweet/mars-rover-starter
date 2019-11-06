const assert = require('assert');
const Message = require('../message.js');
const Rover = require('../rover.js');
const Command = require('../command.js');

describe("Message class", function() {

  it("throws error if name NOT passed into constructor", function() {
    assert.throws(
      function() {
        new Message();
      },
      {
        message: 'Name required'
      }
    );
  });

  it('constructor sets name', function() {
    let object1 = new Message("Name");
    assert.strictEqual(object1.name, "Name")
  });

  it('contains commands passed into constructor as 2nd argument', function() {
    let commands = ["pick up x", "put"]
    let object1 = new Message("Name", commands);
    assert.strictEqual(object1.commands, commands);
  });

});