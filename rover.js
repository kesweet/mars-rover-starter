class Rover {
  constructor (position, generatorWatts = 110) {
    this.position = position,
    this.mode = 'NORMAL',
    this.generatorWatts = generatorWatts
  }
  receiveMessage(message) {
    let resultsArray = [];
    for (let i = 0; i < message.commands.length; i++) {
      if (message.commands[i].commandType === "MOVE") {
        if (this.mode === 'LOW_POWER') {
          resultsArray.push({completed: false, position: this.position})
        }
        else {resultsArray.push({completed: true, position: message.commands[i].value});
        this.position = this.position + message.commands[i].value;
        }
      }
      else if (message.commands[i].commandType === "STATUS_CHECK") {
        resultsArray.push({completed: true, mode: this.mode, generatorWatts: this.generatorWatts, position: this.position});
      }
      else if (message.commands[i].commandType === "MODE_CHANGE") {
        resultsArray.push({completed: true});
        this.mode = message.commands[i].value;
      }
      else {
        resultsArray.push({completed: false});
        message.name = message.name + " is an Unknown Command"
      }
    }
    
    return {
      messageFromRover: message.name,
      results: resultsArray
    };
  };

};


module.exports = Rover;