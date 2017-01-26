var utility = require('utility.Functions');

module.exports = {
// set the priority of all sources in the room


run: function(creep) {
  // function to determine the priority of what source to go too

// if this creep is too weak to be useful then move to the spawner and recycle yourself
  if (creep.memory.goDie == true){
    if (Game.spawns.Spawn1.recycleCreep(creep)==ERR_NOT_IN_RANGE){
      var structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
        filter: (s) => (s.structureType == STRUCTURE_SPAWN)
      });
      creep.moveTo(structure);
      return;
    }
  }
  if (creep.memory.working == true && creep.carry.energy == 0){
    creep.memory.working = false;
    // store the last trips round trip move count into the Last trip odometer memory
    creep.memory.lastTripOdometer = creep.memory.thisTripOdometer;
    creep.memory.thisTripOdometer = 0;
    // if the creep is unlikely to live long enough to complete another round
    // trip to the source
    if(creep.memory.lastTripOdometer >= creep.ticksToLive){
      // creep probably won't live  set to recycle itself
      creep.memory.goDie = true;
    }

  }
  else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity){
    creep.memory.working = true;

  }
  if (creep.memory.working == true){
    // if working time to bring that power back to the home room and deliver it
    if (creep.room.name == creep.memory.home){
      // first look for links
      var structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (s) => (s.structureType == STRUCTURE_LINK)
                     && s.energy < s.energyCapacity
      });
      // if no links then look for spawns, extensions and towers
      if (structure == undefined){
        var structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
          // find a receiving spawn, extension or tower that isn't at capacity
          filter: (s) => (s.structureType == STRUCTURE_SPAWN
                      ||  s.structureType == STRUCTURE_EXTENSION
                      ||  s.structureType == STRUCTURE_TOWER)
                      &&  s.energy < s.energyCapacity
          });

      }
      // if we can't find an empty main storage throw it in the storage unit
      if (structure == undefined){
        var structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
          filter: (s) => (s.structureType == STRUCTURE_STORAGE
                      ||  s.structureType == STRUCTURE_CONTAINER)
                      &&  _.sum(s.store) < s.storeCapacity
        });
      }

      // if we found one
      if (structure != undefined) {
        // try to transfer energy, if it is in range
        if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
          // not in range...move to it
          if (structure) creep.moveTo(structure);
          creep.memory.thisTripOdometer++;
          creep.say('D->');
        }
      }
    } else {
      // creep is not in the home room...move to the exit towards the home room
      //find exit to home then move to the exit
      var exit = creep.room.findExitTo(creep.memory.home);
      creep.moveTo(creep.pos.findClosestByRange(exit));
      creep.memory.thisTripOdometer++;
      creep.say('x->');
    }
  }
    // Creep isn't in working mode meaning it should be seeking to harvest
    else {
      // First see if there is enough lifespan to make it to the remote power
      // based on the tick cost of the last round trip to the source

      // if not drop any power you are carrying and move to recycle...set mode to recycle


      // check if we are in the target room for harvesting
      if (creep.room.name == creep.memory.target)  {

        errCode = utility.getEnergy(creep);
        if (errCode != ERR_NOT_IN_RANGE && errCode != OK) console.log('LD harvester returned code: ' + errCode + ' from getEnergy()');
        if (errCode == OK || errCode == ERR_NOT_IN_RANGE) return;
        //var source = creep.room.find(FIND_SOURCES_ACTIVE)[creep.memory.sourceIndex];
        var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        //onsole.log('moving to location ' + source.pos);
        creep.moveTo(source);
        //console.log("TryHarvest: "+creep.harvest(source)+" index: " + creep.memory.sourceIndex);
        var errCode = creep.harvest(source);
        //console.log('Creep: ' + creep.name + ' Error: ' + errCode  + ' in room ' + creep.room.name + ' For target: ' + source);
        if (errCode == ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
            //console.log('Moveto: '+ creep.say(creep.harvest(source)));
            creep.say('e->');
            creep.memory.idleCount++;
            creep.memory.thisTripOdometer++;
            // if excessive time has passed flip the sourceIndex and reset odometer
            if (creep.memory.thisTripOdometer > 130){
              creep.memory.lastTripOdometer = creep.memory.thisTripOdometer;
              creep.memory.thisTripOdometer = 0;
              if (creep.memory.sourceIndex == 1){
                creep.memory.sourceIndex = 0;
              } else creep.memory.sourceIndex = 1;
            }
        }
      }
      // if not in the right room we need to move to the target room for harvest
      else {
        var exit = creep.room.findExitTo(creep.memory.target);
        creep.moveTo(creep.pos.findClosestByRange(exit));
        creep.memory.thisTripOdometer++;
        //creep.say(creep.harvest(source)+ 'Index:'+creep.memory.sourceIndex);
        creep.say('x->');

      }
    }
  }
}
