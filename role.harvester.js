

module.exports = {
run: function(creep) {
  var utility = require('utility.Functions');
  if (creep.memory.working == true && creep.carry.energy == 0){
    creep.memory.working = false;
  }
  else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity){
    creep.memory.working = true;

  }
  // if there is a STORAGE or a CONTAINER put the energy there
  // otherwise put the energy into the extensions and spawns

  if (creep.memory.working == true){
    // first look for towers to put the energy in
    if (structure == undefined){
    var structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      // find a receiving spawn, extension or tower that isn't at capacity
      filter: (s) => (s.structureType == STRUCTURE_TOWER)
                  &&  s.energy < s.energyCapacity
                });
    }

    // then look for spanwns and extensions to put energy in
    if (structure == undefined){
      var structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        // find a receiving spawn, extension or tower that isn't at capacity
        filter: (s) => (s.structureType == STRUCTURE_SPAWN
                    ||  s.structureType == STRUCTURE_EXTENSION)
                    &&  s.energy < s.energyCapacity
                  });
      }
      // if no towers were found next determine if there are energyTransporters
      // and if so put the energy into the storage
      //if (structure == undefined && utility.howManyOfRole('energyTransporter',creep.room.roomName)>0){

      // replaced condition above for energy transporter to just look for
      // storage and containers if now spawns, extensions, or towers found
      if (structure == undefined){
        var structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
          filter: (s) => (s.structureType == STRUCTURE_STORAGE ||
                          s.structureType == STRUCTURE_CONTAINER)
                          && _.sum(s.store) < s.storeCapacity
        });
      }

      // if no energytransporters exist to move it or there is no storage or towers
      // then put the energy directly into spawns & extensions
      if (structure == undefined) {
        var structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
          // find a receiving spawn, extension or tower that isn't at capacity
          filter: (s) => (s.structureType == STRUCTURE_SPAWN
                      ||  s.structureType == STRUCTURE_EXTENSION)
                      &&  s.energy < s.energyCapacity
                    });
        }

      // if we found one
      if (structure != undefined) {
        // try to transfer energy, if it is in range
        if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
          // not in range...move to it
          if (structure) creep.moveTo(structure);
          creep.say('D->');
        }
      }

      // Introduce code to repair roads on the fly while moving

      var repairTargets = creep.pos.findInRange(FIND_STRUCTURES, 1, {
          filter: function(object) {
              return object.hits < object.hitsMax
                  && object.hitsMax - object.hits > REPAIR_POWER;
          }
      });
      repairTargets.sort(function (a,b) {return (a.hits - b.hits)});
      if (repairTargets.length > 0) {
          creep.repair(repairTargets[0]);
          creep.say('ROTF!');
        }
      // end repair roads on the fly code
   }
    // Creep isn't in working mode meaning it should be seeking to harvest
    else {
      if (creep.memory.targetRoom != creep.room.name && creep.memory.targetRoom != undefined){
        var exit = creep.room.findExitTo(creep.memory.targetRoom);
        creep.moveTo(creep.pos.findClosestByRange(exit));
        creep.say('x->');
        return;
      }
      var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
            creep.say('H->');
          }
        }
      }
   }
