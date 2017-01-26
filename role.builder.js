var roleUpgrader = require('role.upgrader');
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
      if (creep.memory.targetRoom != creep.room.name){
        var exit = creep.room.findExitTo(creep.memory.targetRoom);
        creep.moveTo(creep.pos.findClosestByRange(exit));
        creep.say('x->');
        return;
      } else {
        var constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
        if (constructionSite != undefined){
          if (creep.build(constructionSite) == ERR_NOT_IN_RANGE){
            creep.moveTo(constructionSite);
            creep.say('B->');
            }
          }else {
            // no construction sites...convert to repairer
            // perhaps change this to look in other rooms if there are any
            console.log('WARNING: Builder with no build targets! : ' + creep.name + ' in room ' + creep.room.name);
            //  creep.memory.role = 'repairer';
          }
        }

        }

      else {
        if(utility.gotoCorrectRoom(creep)== true){
          var errorCode = utility.getEnergy(creep);
          if(errorCode != 0) creep.say('s->');
          }
        }
      }
};
