class Command {
  constructor(commandType, value) {
    this.commandType = commandType,
    this.value = value
    if (!commandType) {
      throw Error("Command required");
    }
  }
}

module.exports = Command;