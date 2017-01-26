module.exports = {
run: function(creep) {

    if (creep.room.name == creep.memory.target){

      var killTarget = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (s) => s.structures == STRUCTURE_CONTROLLER
      });

      //if (killTarget != undefined) creep.say('huh? - '+ creep.attack(killTarget[0]));
      //console.log('Claim: '+ creep.claimController(killTarget[0]));
      if (killTarget != undefined) {
        if (creep.claimController(killTarget[0]) == ERR_NOT_IN_RANGE){
          creep.moveTo(killTarget[0]);
          creep.say('Kill!');
        }
      }
    } else {
      // creep is not in the home room...move to the exit towards the home room
      //find exit to home then move to the exit
      var exit = creep.room.findExitTo(creep.memory.target);
      creep.moveTo(creep.pos.findClosestByRange(exit));
      creep.say('->');
    }
  }
}
