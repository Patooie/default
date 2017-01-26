module.exports = {
run: function(creep) {
  if (creep.memory.working == true && creep.carry.energy == creep.carryCapacity){
    creep.memory.working = false;
  }
  else if (creep.memory.working == false && creep.carry.energy == 0){
    creep.memory.working = true;

  }
  if (creep.memory.working == true){
      // find any energy just laying around
      var droppedEnergy = creep.pos.findClosestByPath(FIND_DROPPED_ENERGY);
      // if we found one
      if (droppedEnergy != undefined) {
        // try to transfer energy, if it is in range
        switch(creep.pickup(droppedEnergy)){
          case ERR_NOT_IN_RANGE:
            // not in range...move to it
            creep.moveTo(droppedEnergy);
            creep.say('Get!');
            creep.memory.idleCount = 0;
            break;
          case ERR_FULL:
            creep.memory.working = false;
            break;
          case OK:
            creep.say('Got!');
            break;
          default:
            console.log('Untrapped Cleaner Resource payload error!'+ creep.pickup(droppedEnergy));
        }

      } else {
        // no dropped energy found in range...increment idleCount and
        // if above 50 run whatever energy you have back to a structure
        creep.memory.idleCount++;
        creep.say('Idle:'+creep.memory.idleCount);
        if (creep.memory.idleCount > 20 && creep.carry.energy > 0){
         creep.memory.working = false;
         creep.memory.idleCount = 0;
       }
      }
    }
    // Creep isn't in working mode meaning it should move toward the idle spot
    else {

        // First look at storage for putting items
          var structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            // find a receiving spawn, extension or tower that isn't at capacity
            filter: (s) => (s.structureType == STRUCTURE_STORAGE)
                      &&  _.sum(s.store) < s.storeCapacity
                    });
                    //console.log('cleaner targeting storage');

          // if no storage found look for spawn/extension or tower
          if (structure == undefined){
            var structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
              // find a receiving spawn, extension or tower that isn't at capacity
              filter: (s) => (s.structureType == STRUCTURE_SPAWN
                ||  s.structureType == STRUCTURE_EXTENSION
                ||  s.structureType == STRUCTURE_TOWER
                ||  s.structureType == STRUCTURE_CONTAINER)
                &&  s.energy < s.energyCapacity
              });
              //if (structure) console.log ('cleaner targeting spawn, extensions or tower');
          }

        // if we found a reciever for the energy we've got
        if (structure != undefined) {
          // try to transfer energy, if it is in range
          //console.log('Cleanup transfer: '+creep.transfer(structure, RESOURCE_ENERGY));
          for (var resourceType in creep.carry){
          if (creep.transfer(structure, resourceType) == ERR_NOT_IN_RANGE){
            // not in range...move to it
            if (structure) creep.moveTo(structure);
          }
            creep.say('Rtrn!');
          }
        }
      }
    }
  };
