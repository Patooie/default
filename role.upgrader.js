var utility = require('utility.Functions');

module.exports = {
  run: function(creep) {
    if (creep.memory.working == true && creep.carry.energy == 0){
      creep.memory.working = false;
    }
    else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity){
      creep.memory.working = true;

    }
    if (creep.memory.working == true){
      // see if this creep is in the right room and if not move to it
      if(creep.room.name != creep.memory.targetRoom){
        var exit = creep.room.findExitTo(creep.memory.targetRoom);
        creep.moveTo(creep.pos.findClosestByRange(exit));
        creep.say('REMOTE!');
        return;
        console.log('ERROR IN UPGRADER ROOM ROUTING CODE!!');
      }

        if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE){
            creep.moveTo(creep.room.controller);
            creep.say('u->');
          }
        } else {
          // find energy...use the utility function (declared above)
          // Test external Functions
        var errorCode = utility.getEnergy(creep);
        switch(errorCode){
          case OK:
            return;
            break;
          case -9:
            return;
            break;
          default:
            console.log ('Upgrader: Get Energy errorCode Returned: '+ errorCode + ' for creep: ' + creep.name);
        }
      }
    }
};
