
      if (utility.gotoCorrectRoom(creep) == false) return;
      // determine if the creep has a locked repair target or
      //if (Room.creep.memory.lockTarget)
        if (creep.memory.lockTarget == null){
          console.log('Repairer: ' + creep.name);
        // if we need to search for a new lowest hits object for repairTarget
          var repairTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, {
              filter: (s) => (s.structureType != STRUCTURE_WALL)  && s.hits < s.hitsMax
          });
          console.log('Trap repairtarget after find: ' + JSON.stringify(repairTarget));
          //repairTarget.sort(function(a,b) {return(a.hits - b.hits)});
          //repairTarget = _.min(repairTarget, 'hits');
          creep.memory.lockTarget = repairTarget.id;
          console.log("resetting lock target: "+ creep.name + " in room " +
            creep.room.name + " to " +
            Game.getObjectById(creep.memory.lockTarget).structureType + " with " +
            Game.getObjectById(creep.memory.lockTarget).hits + " of " +
            Game.getObjectById(creep.memory.lockTarget).hitsMax + " hits");
          //The below code will use an alternative method to find a good target
          // in need of repair
          //if (repairTarget != undefined){
          //  var repairTarget = creep.pos.findInRange()

        //  }
        } else {
          repairTarget = Game.getObjectById(creep.memory.lockTarget);
          console.log ('Creep: ' + creep.name + ' Creep lockTarget ID: ' + creep.memory.lockTarget);
          if (repairTarget == null) {
              creep.memory.lockTarget = null;
              console.log('Repairtarget detected as null');
            }
          if (repairTarget != null) if (repairTarget.hits == repairTarget.hitsMax) creep.memory.lockTarget = '';
           //var errTrap = Game.getObjectById(creep.memory.lockTarget).hits;
           //console.log ('repairer error in repair target: ' + errTrap)
            //== Game.getObjectById(creep.memory.lockTarget).hitsMax) creep.memory.lockTarget = undefined;
        }
        //console.log('-');
        //console.log(JSON.stringify(repairTarget));
        //var repairTarget = _.min(repairTarget, 'hits');

        // If we find a structure in need of repair move to it
        // determine if neither the lock target nor the search returned any
        // structures in need of repairs
          if (repairTarget != undefined){
            var repairResult = creep.repair(repairTarget);
            switch (repairResult){
              case ERR_NOT_IN_RANGE:
                creep.moveTo(repairTarget);
                creep.say('R->');
                break;
              case OK:
                creep.say(':) ='+ creep.memory.lockTimer);
                // lock this target for 20 ticks or until
                // structure is fully repaired
                break;
              case ERR_NOT_ENOUGH_RESOURCES:
                console.log('Repairer out of energy! ');
                creep.memory.working = false;
                break;
              case ERR_INVALID_TARGET:
                creep.say('Target?');
                break;
              default:
                console.log('Unknow repair creep error:'+ creep.repair(repairTarget)+' Name: '+creep.name+
               ' TargetID: '+repairTarget.id);
                break;
              }
            } else {
              // no valid repair target
              //creep.say('->Build');
              //creep.memory.role = 'builder';
              // if no targets found to repair and energy less than 50% go get some energy
              if (creep.carry < creep.carryCapacity *.5) creep.memory.working = false;
            }
