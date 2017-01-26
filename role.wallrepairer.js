// Import modules
var roleBuilder = require('role.builder');
var utility = require('utility.Functions');


module.exports = {
  run: function(creep) {
    // Set the state to working or not based on memory load and current state
    if (creep.memory.working == true && creep.carry.energy == 0){
      creep.memory.working = false;
    }
    else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity){
      creep.memory.working = true;
    }

    // Is the creep in working mode (e.g. full of energy)
    if (creep.memory.working == true){
      // Is creep in right room to work?
      if (utility.gotoCorrectRoom == false) console.log('wallRepiaring Creep in wrong room');

      // Get a list of stuff to repair and then go repair it
      var repairTargets = creep.room.find(FIND_STRUCTURES, {filter: (s) => (s.structureType == STRUCTURE_WALL || s.structureType == STRUCTURE_RAMPART) && s.hits < Memory.wallMax});
      if (repairTargets.length == 0) Memory.wallMax = Memory.wallMax + 10000;
      //Sort repairtargets from least to most in need of repairs
      //console.log('# Walls: '+ repairTargets.length+ '/' + Memory.wallMax);
      var repairTarget = _.min(repairTargets, 'hits');
      //console.log('repairTarget='+repairTarget.id);
      //console.log('repairTarget.hits= '+ repairTarget.hits);
      //console.log('repairTarget.loc= '+ repairTarget.pos);
      // return the lowest hits section of wall

      //Lock in a repair target 0 for a few ticks
      var maxLockTimer = 50;
      var lockTarget = repairTarget.id;
      //console.log('repairTarget.id: '+repairTarget.id);
      //console.log('Creep.lockTimer: '+creep.memory.lockTimer);
      if (creep.memory.lockTimer == maxLockTimer){
        // lock target timer has expired...get a new (hopefully close)
        // target to repair & reset lock timer
          creep.memory.lockTarget = lockTarget;
          creep.memory.lockTimer=0;
        } else {
          // Still locked on old target
          // set the repairTarget to the locked creep target
          // set the repairtarget to the creeps memorized target
          repairTarget = Game.getObjectById(creep.memory.lockTarget);
          }
        creep.memory.lockTimer++;
        switch (creep.repair(repairTarget)) {
          case ERR_NOT_IN_RANGE:
            creep.moveTo(repairTarget);
            creep.say("M!-LC: "+creep.memory.lockTimer);
            //console.log('Location Target: '+ repairTarget.pos + ' Hits: '+ repairTarget.hits+'/'+Memory.wallMax);
            break;
          case ERR_INVALID_TARGET:
            creep.memory.lockTimer = 50;
            break;
          case OK:
            creep.memory.lockTimer--;
            creep.say('R!-LC:'+creep.memory.lockTimer);
            break;
          default:
            // this should never happen
          }
          if (repairTarget != undefined && repairTarget.hits > Memory.wallMax) creep.memory.lockTimer = 50;
    } else {
        // creep not working...should go get some energy
        //creep.say('Need E!');
        if (utility.gotoCorrectRoom(creep)==true){

        var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        //console.log(creep.moveTo(source));
        if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
            //if (creep.moveTo(source)== ERR_NO_PATH) creep.say("Waiting...");
            creep.moveTo(source);
            creep.say('ReChrg!');
            creep.memory.lockTarget = lockTarget;
          } else {
            creep.memory.lockTimer=0;
            //creep.say('Nom!');
          }
        } else {
          creep.say('x->');
          //console.log('Wallrepairer: ' + creep.name + ' routing to proper room: ' + creep.memory.targetRoom );

        }
      }
    }
};
