
module.exports = {
  run: function(creep) {
    if (creep.memory.working == true && creep.carry.energy == 0){
      creep.memory.working = false;
    }
    else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity){
      creep.memory.working = true;

    }
    if (creep.room.name == creep.memory.target){
    //Main test for if creep has energy to work and build or not
    if (creep.memory.working == true){
      // first figure out if we are in the right room
      //
        var constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
        if (constructionSite != undefined){
          if (creep.build(constructionSite) == ERR_NOT_IN_RANGE){
            creep.moveTo(constructionSite);
            creep.say('B->');
            }
          }
          // no construction sites found...this creep is bored
          else {
              //roleUpgrader.run(creep);
              creep.say('Idle..');
          }
        }
      // creep is not working and needs energy to continue...get them to work
      else {
          var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
          // check if source has energy or will have energy soon

            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
              }
          }
        //End main test for if creep has energy to work or not

        } else {
          // not in the right room...go to the right room
          var exit = creep.room.findExitTo(creep.memory.target);
          creep.moveTo(creep.pos.findClosestByRange(exit));
          creep.say('x->');
        }
      }
};
