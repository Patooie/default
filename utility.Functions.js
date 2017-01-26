// this function returns how many of global creeps are of a certin role type
// based on the role name that is passed in 'roleType'
 module.exports = {

   howManyOfRole: function (roleType, roomName){
    var roleCount = 0;
    //console.log('Function: howManyOfRole -'+roleType);
    for (let cname in Game.creeps) {
      var creep = Game.creeps[cname];
      // if the role matches then increment the rolecounter
      if (creep.memory.role == roleType) {
        if (roomName == undefined){
           roleCount++;
         } else {
           // if the optional param for room name was provided and it
           // it matches then increment the rolecounter
           //console.log('tripped role specific count')
           if (creep.memory.targetRoom == roomName) roleCount++;
         }
      }
    }
  return roleCount;
},


    getEnergy: function(creep) {
      var errorCode = OK;

      // search for storage and containers
      var source = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (s) => (s.structureType == STRUCTURE_LINK)
                     && s.energy > 0
      });

      // then search for containers and storage
      if (source == undefined){
        var source = creep.pos.findClosestByPath(FIND_STRUCTURES, {
          filter: (s) => (s.structureType == STRUCTURE_CONTAINER
                      || s.structureType == STRUCTURE_STORAGE) &&
                      s.store[RESOURCE_ENERGY] > 600

                  });
        if (source != undefined){
          // found a qualified storage or container
          errorCode = creep.withdraw(source, RESOURCE_ENERGY);
          if (errorCode == ERR_NOT_IN_RANGE){
            creep.moveTo(source);
          }
          return errorCode;
        }
      }
      // then search for
      if (source != undefined){
        // found a Storage or Container with Energy
        //console.log('Upgrader storage transfer returns: '+ creep.transfer(source, RESOURCE_ENERGY));
        if (creep.withdraw(source, RESOURCE_ENERGY)== ERR_NOT_IN_RANGE){
          creep.moveTo(source);
          creep.say('S->');
          return errorCode;
        }
       }
       // now check for energy just laying around on the ground
       var droppedEnergy = creep.pos.findClosestByPath(FIND_DROPPED_ENERGY);
       // if we found one
       if (droppedEnergy != undefined) {
         // try to transfer energy, if it is in range
          if (creep.pickup(droppedEnergy) == ERR_NOT_IN_RANGE){
            creep.moveTo(droppedEnergy);
            creep.say('GET!');
            return errorCode;
          }
        }

       // we didn't find energy in links, containers or storage
       // or just laying about on the ground so...
      // find the closest harvest point and start mining for it
      var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
      if (source != undefined){
        if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
            creep.say('H->')
        }
        return errorCode;
      }
    creep.say('util:err');
    return ERR_NOT_ENOUGH_RESOURCES;

  },

howMuchEnergyStored: function(roomName){
   // returns energyStored
   //a function to figure out how much energy is in storage
   // (not including extensions) and spawns themselves
   // this function will be used to determine if energyTransporter type creeps
   // are needed and eventually other power management purposes
   var energyStored = 0;
   var structures = Game.room.find(STRUCTURES, {
    filter: (s) => (s.structureType == STRUCTURE_STORAGE ||
                    s.structureType == STRUCTURE_CONTAINER)
    });
   // iterate through all structures and add up total energy stored
   for (i = 0; i > structures.length; i++){
     energyStored = energyStored + structures[i].store[RESOURCE_ENERGY];
   }
 return energyStored;
 },

 gotoCorrectRoom: function (creep){
   if (creep.memory.targetRoom == creep.room.name){
     return true;
   } else {
     var exit = creep.room.findExitTo(creep.memory.targetRoom);
     creep.moveTo(creep.pos.findClosestByRange(exit));
     return false;
   }
 },


// a function to figure out what is needed for any specific room
  buildWhat: function(roomName){

    // how much energy remains on the sources in the room
    // what is the level of the controller
    // How many of each type creep do I already have
    // who is closest to dying (least amount of life)
    // how many constructionsites do I have up
    // How many walls do I have up and how tough are they (against a target toughness)
    var roleTypes = ["harvester","upgrader","repairer","builder",
                "wallRepairer","LongDistanceHarvester", "resourceCleaner",
                "energyTransporter", "utilityDestroyer"];

    // Figure out the weighting based on a series of analysis for each room
    var harvesterWeight = 30;
    var repairerWeight = 10;
    var builderWeight = 20;
    var longDistanceHarvesterWeight = 20;
    var energyTransporterWeight = 20;
    var resourceCleaner = 10;
    var utilityDestroyerWeight = 30;
    var upgraderWeight = 25;

    // Are the containers and spawn full?
    if (room.energyAvailable < (room.energyCapacity*.2)) hDecision = hDecision+harvesterWeight;
    //structures = room.find()
    //if (room.find())

    //loop through all the roles and determine if they are at capacity

    }


};
