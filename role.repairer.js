// Import modules
var roleBuilder = require('role.builder');
var utility = require('utility.Functions');

module.exports = {
  run: function(creep) {
    // Flip creeps to working mode if they are full energy and to not working mode if they are empty
    if (creep.memory.working == true && creep.carry.energy == 0){
      creep.memory.working = false;
      // reset the currently locked repair target
      creep.memory.lockTarget = '';
    }
    else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity){
      creep.memory.working = true;

    }

    // Is the creep in working mode (e.g. has some energy)
    if (creep.memory.working == true){
      //  first find something to repair
      var repairTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, {
          filter: (s) => (s.structureType != STRUCTURE_WALL)  && s.hits < (s.hitsMax *.9) && s.hits < 50000
      });
      //_.sort(repairTarget

      // next move to the something and fucking repair it
      var mover = creep.repair(repairTarget);
      //console.log('repairer detail ' + JSON.stringify(repairTarget));
      if (repairTarget != undefined){
        //console.log(creep.name + ' is repairing: ' + repairTarget.structureType + ' result code: ' + mover);
        creep.memory.lockTarget = repairTarget.id;
        creep.memory.lockTimer++;
      }
      // if target not in range move to it
      if (mover == ERR_NOT_IN_RANGE) creep.moveTo(repairTarget);

      // not a valid target to repair...go find something else
      if (mover == ERR_INVALID_TARGET) {
        creep.memory.lockTarget = '';
        creep.memory.lockTimer = 0;
      }
      // reached 20 pulses on the repair target...go find something else
      if (lockTimer => 20){
        creep.memory.lockTarget = '';
        creep.memory.lockTimer = 0;
      }

    } else {
        // If this creep isn't in the right room send it to it's correct room
        if (creep.memory.targetRoom != creep.room.name){
          var exit = creep.room.findExitTo(creep.memory.targetRoom);
          creep.moveTo(creep.pos.findClosestByRange(exit));
          creep.say('x->');
          return;
        }
        // in the case that this creeep is "not working" have it go fill up it's energy
        var errorCode = utility.getEnergy(creep);
        }
      }
};
