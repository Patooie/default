
module.exports = {
  run: function(creep) {
    if (creep.memory.working == true && creep.carry.energy == 0){
      creep.memory.working = false;
    }
    else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity){
      creep.memory.working = true;

    }
    if (creep.memory.working == true){
      var structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        // find a receiving spawn, extension or tower that isn't at capacity
        filter: (s) => (s.structureType == STRUCTURE_SPAWN
                    ||  s.structureType == STRUCTURE_EXTENSION
                    ||  s.structureType == STRUCTURE_TOWER)
                    &&  s.energy < s.energyCapacity
                  });
      // if we can't find an empty main storage throw it in the storage unit
      if (structure == undefined){
        // Since this is a energy transporter don't take from the storage
        // If no available extensions, spawns or towers need power take
        // the energy to the controller


      }
      // if we found one
      if (structure != undefined) {
        // try to transfer energy, if it is in range
        if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
          // not in range...move to it
          if (structure) creep.moveTo(structure);
          creep.say('d->');
        }
      }

      }
      // Creep isn't in working mode meaning it should be seeking to get energy
      // from a storage tower or container
      else {
        var structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
          filter: (s) => (s.structureType == STRUCTURE_LINK)
                       && s.energy > 0
        });

        if (structure == undefined){
        var structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
          filter: (s) => (s.structureType == STRUCTURE_STORAGE
                       || s.structureType == STRUCTURE_CONTAINER)
                       && s.store[RESOURCE_ENERGY]>0
        });
      }
          //if (structure != undefined) console.log('Etrans Returns: '+creep.withdraw(structure,RESOURCE_ENERGY));
          if (creep.withdraw(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
              creep.moveTo(structure);
              creep.say('e->');
            }
          }
        }
  };
