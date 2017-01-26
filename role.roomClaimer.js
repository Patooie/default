module.exports = {
run: function(creep) {
      // Confirm creep is in target room for controller claiming
      if (creep.room.name == creep.memory.target)  {
        var controllerTarget = creep.room.controller;
        //console.log("target: "+ controllerTarget.pos);
        if (creep.claimController(controllerTarget) == ERR_NOT_IN_RANGE) {
            creep.moveTo(controllerTarget);
            console.log('Controller: '+ controllerTarget.pos);
            console.log('Target: '+ creep.memory.target);
            creep.say('c->'+creep.claimController(controllerTarget));
        }
      }
      // if not in the right room we need to move to the target room for harvest
      else {
        var exit = creep.room.findExitTo(creep.memory.target);
        creep.moveTo(creep.pos.findClosestByRange(exit));
        creep.say('c->'+ creep.claimController(controllerTarget));
      }
  }
}
