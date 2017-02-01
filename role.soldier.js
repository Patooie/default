var utility = require('utility.Functions');

module.exports = {

run: function(creep, priorityTargets) {
var atWar = false;
if (utility.howManyOfRole('soldier')>= 3) atWar = true;

// first determine if at war state has been declared for invasion
    stagingFlag = Game.flags.staging;

    if (atWar == false) {
      // not at war...wait or go to staging area if one exists
      if (creep.pos.roomName != stagingFlag.pos.roomName){
        creep.moveTo(stagingFlag);
      } else
      {
        // no stating flag found just idle where you are
        creep.moveTo(stagingFlag);
        creep.say('staging..');

        return;
      }

    } else {
      creep.say('Peace!');
    //  we are at war....do war like stuff
    // Determine if we are in the right room (or not)
    let flag = Game.flags.attackFlag;
    if (flag) {
        if (creep) {
            if (creep.pos.roomName === flag.pos.roomName) {
                let spawn = creep.room.find(FIND_HOSTILE_CREEPS)[0];
                let outcome = creep.attack(spawn);
                if (outcome === ERR_NOT_IN_RANGE) creep.moveTo(spawn)
            }
            else {
                creep.moveTo(flag)
            }
        }
      }
      if (creep.memory.lockTarget != ''){
        // Creep has a target locked...go destroy it
        var lockTargetObject = Game.getObjectById(creep.memory.lockTarget);
        if (lockTargetObject != undefined){
          // object still exists as a valid target
          if (creep.attack(lockTargetObject)== ERR_NOT_IN_RANGE){
            // not close enough to hit it...move toward the target
            creep.say('ATK!');
            creep.moveTo(lockTargetObject);
            console.log('lock target object position: ' + lockTargetObject.pos);
            return;
          }

        } else {
          // object no longer exists...reset lock target id
          creep.memory.lockTarget = '';
          return;
        }
      }
      // no lock target in memory


      if (!creep.room.find(FIND_HOSTILE_SPAWNS)[0]){
        // spawn is gone or destroyed

      flag = Game.flags.wallFlag;
      // look for a wall point to breach and start whacking
      // first move toward the wallFlag as the position to breach
      if (creep.pos.roomName == flag.pos.roomName && creep.memory.lockTarget == ''){
        // ok in the right room

        rangeToFlag = creep.pos.getRangeTo(flag);
        console.log('range to flag: ' + rangeToFlag);
        if (rangeToFlag < 4){
          // close to target...find a weak wall and bang on it
          destructionTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, {
              filter: (n) => n.structureType == STRUCTURE_WALL
              });
          console.log('found a target!');
          creep.memory.lockTarget = destructionTarget.id;
          return;
        }
      } else {
        creep.moveTo(flag);
        console.log('Creep targeting: ' + creep.memory.lockTarget);
        return;
      }

      if (flag){
          if (creep) {
              if (creep.pos.roomName === flag.pos.roomName) {
                  let spawn = creep.room.find(FIND_STRUCTURES, {
                      filter: (n) => n.structureType == STRUCTURE_WALL
                      })[0];
                  let outcome = creep.attack(spawn);
                  if (outcome === ERR_NOT_IN_RANGE) creep.moveTo(spawn)
                  //console.log('Attack Outcome: ' + outcome);
              }
              else {
                  creep.moveTo(flag)
              }
          }
        }
      }
    }
  }
};
