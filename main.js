require('prototype.spawn')();
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleWallRepairer = require('role.wallrepairer');
var roleLongDistanceHarvester = require('role.longDistanceHarvester');
var roleRoomClaimer = require('role.roomClaimer');
var roleResourceCleaner = require('role.resourceCleaner');
var defendRoom = require('defendRoom');
var roleBuildHere = require('role.buildHere');
var roleRepairHere = require('role.repairHere');
var roleEnergyTransporter = require('role.energyTransporter');
var utility = require('utility.Functions');

var queuedBuild = '';

var minNum = {

}

var HOME = 'W89N54';
var REMOTE1 = 'W89N53';
var REMOTE2 = 'W88N53';

var claimRoomTarget = '';
// function to determine the priority of what source to go too

module.exports.loop = function() {

// build an array of all rooms that I control
    var controlledRooms = new Array();
    var z = 0;
    for (var name in Game.rooms){
    //  console.log('Main: '+name);
      controlledRooms[z] = name;
      z++;
    }
    // clear memory of dead creeps
    for (let name in Memory.creeps) {
        if (Game.creeps[name] == undefined) {
            //console.log("Deleted: " + Game.creeps[name]);
            delete Memory.creeps[name];
        }
    }
    var localFlags = Game.flags;
    var spawnIdle = false;
    var spawnPreLoad = '';
    var spawnPreLoadTarget = '';

    // Code below controls upper and lower limit of count for each type of creep
    // Set minimum & maximum numbers for each creep type
    var minimumNumberOfHarvesters = 3;
    var maxHarvesters = 6;
    var minimumNumberOfUpgraders = 1;
    var maxUpgraders = 2;
    var minimumNumberOfBuilders = 0;
    var maxBuilders = 1;
    var minimumNumberOfRepairers = 1;
    var maxRepairers = 2;
    var minimumNumberOfWallRepairers = 1;
    var maxWallRepairers = 2;
    var minimumNumberOfLongDistanceHarvesters = 4;
    var maxLongDistanceHarvesters = 4 ;
    var remoteLongDistanceHarvester = 0;
    var minimumNumberOfUtilityDestroyers = 0;
    var maxUtilityDestroyers = 0;
    var minimumNumberOfRemoteRepairers = 0;
    var minimumNumberOfRemoteBuilders = 0;
    var minimumNumberofEnergyTransporters =1;
    var maxEnergyTransporters = 1;
    var minimumNumberOfResourceCleaners = 0;

    // get actual counts for each creep type

    //var numberOfHarvesters = _.sum(Game.creeps, (c) => c.memory.role == 'harvester');
    var numberOfHarvesters = utility.howManyOfRole('harvester');
    var numberOfUpgraders = utility.howManyOfRole('upgrader');
    var numberOfBuilders = utility.howManyOfRole('builder');
    var numberOfRepairers = utility.howManyOfRole('repairer');
    var numberOfWallRepairers = utility.howManyOfRole('wallRepairer');
    var numberOfUtilityDestroyers = utility.howManyOfRole('utilityDestroyer');
    var numberOfLongDistanceHarvesters = utility.howManyOfRole('longDistanceHarvester');
    var numberOfRoomClaimers = utility.howManyOfRole('roomClaimer');
    var numberOfResourceCleaners = utility.howManyOfRole('resourceCleaner');
    var numberOfRemoteBuilders = utility.howManyOfRole('remoteBuilders');
    var numberOfRemoteRepairers = utility.howManyOfRole('remoteRepairers');
    var numberOfEnergyTransporters = utility.howManyOfRole('energyTransporter');


    var energy = Game.spawns.Spawn1.room.energyCapacityAvailable;
    var energyAvailable = Game.spawns.Spawn1.room.energyAvailable;
    //console.log('Main: Energy: '+ energyAvailable +'('+energy+')');
    var energyStored = 0;
/*
    var structure = Game.room.find(FIND_STRUCTURES, {
      filter: (s) => (s.structureType == STRUCTURE_STORAGE
                  ||  s.structureType == STRUCTURE_CONTAINER)
                  &&  _.sum(s.store) < s.storeCapacity
      });

    if (structure != undefined){
      for (i = 0; i > structures.length; i++){
        energyStored = energyStored + structures[i].store[RESOURCE_ENERGY];
      }
    }
*/

// spawn is idle....if energy is full look for the next expiring creep
// to pre-cache in the queue
  if (Game.spawns.Spawn1.spawning == undefined){
    spawnIdle = true;
  }
// every 10 ticks do the following actions
  if ((Game.time/10) == (Math.floor(Game.time/10))){
    console.log('Energy: '+ energyAvailable +'/'+energy);
    if (Game.spawns.Spawn1.spawning == undefined) console.log('Spawn idle...');
    //If (energyStored > 0) console.log ('Stored Energy: ' + energyStored);
    // Get a current count of all of the different creep types and post to console
    for (var dd = 0; dd < controlledRooms.length; dd++){
    console.log(" ROOM: ("+ controlledRooms[dd]+") Rep: " + utility.howManyOfRole('repairer', controlledRooms[dd]) + "(" + minimumNumberOfRepairers + "/"+  maxRepairers +")"+
      " Harv: "+ utility.howManyOfRole('harvester', controlledRooms[dd]) + "(" + minimumNumberOfHarvesters + "/"+  maxHarvesters +")"+
      " Upgrd: "+ utility.howManyOfRole('upgrader', controlledRooms[dd]) + "(" + minimumNumberOfUpgraders + "/"+  maxUpgraders +")"+
      " Bldr: " + utility.howManyOfRole('builder', controlledRooms[dd]) + "(" + minimumNumberOfBuilders + "/"+  maxBuilders +")"+
      " EnTrans: "+ utility.howManyOfRole('energyTransporter', controlledRooms[dd]) + "(" + minimumNumberofEnergyTransporters + "/"+  maxEnergyTransporters +")"+
      " WalRep: "+ utility.howManyOfRole('wallRepairer', controlledRooms[dd]) + "(" + minimumNumberOfWallRepairers + "/"+  maxWallRepairers +")"+
      " LDHarv: "+ utility.howManyOfRole('longDistanceHarvester') + "(" + minimumNumberOfLongDistanceHarvesters + ")"+
      " RmtHarv: "+ utility.howManyOfRole('remoteLongDistanceHarvester') + "("+ remoteLongDistanceHarvester +")"+
      " RsrcClean: "+ utility.howManyOfRole('resourceCleaner', controlledRooms[dd]) + "(1)"+
      " Dstryr: "+ utility.howManyOfRole('utilityDestroyer', controlledRooms[dd]) + "(" + minimumNumberOfUtilityDestroyers + ")" );
    }
  }
  // main loop for link transfers
  var linkFrom = Game.spawns.Spawn1.room.lookForAt('structure', 26,47)[0];
  var linkTo = Game.spawns.Spawn1.room.lookForAt('structure',26,29)[0];
  var linkResult = linkFrom.transferEnergy(linkTo);

  // main loop to run each role through their assigned functions
    for (let cname in Game.creeps) {
        var creep = Game.creeps[cname];
        // if the creep is still spawning iterate the for loop
        if (creep.spawning) continue;

        // look around you...if there is dropped energy pick that shit up!
        var droppedEnergy = creep.pos.findClosestByPath(FIND_DROPPED_ENERGY);
        if (droppedEnergy) creep.pickup(droppedEnergy);

        // fix a location bug where the roomTarget was filling blank for some reason
        if (creep.memory.roomTarget == '') creep.memory.roomTarget = 'W89N54';

        //depending on the role setting of each creep run the appropriate role script
        if (creep.memory.role == 'harvester') {
            // role is harvester so go harvest energy and return it to the spawn
            roleHarvester.run(creep);
        } else if (creep.memory.role == 'upgrader') {
            // role is upgrader so go harvest energy and use to upgrade controller
            roleUpgrader.run(creep);
        } else if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        } else if (creep.memory.role == 'repairer') {
            roleRepairer.run(creep);
        } else if (creep.memory.role == 'utilityDestroyer') {
            roleUtilityDestroyer.run(creep);
        } else if (creep.memory.role == 'longDistanceHarvester' || creep.memory.role == 'remoteLongDistanceHarvester') {
            roleLongDistanceHarvester.run(creep);
        } else if (creep.memory.role == 'wallRepairer') {
            roleWallRepairer.run(creep);
        } else if (creep.memory.role == 'resourceCleaner') {
                roleResourceCleaner.run(creep);
        } else if (creep.memory.role == 'roomClaimer') {
              roleRoomClaimer.run(creep);
        } else if (creep.memory.role == 'remoteBuilder') {
                    roleBuildHere.run(creep);
        } else if (creep.memory.role == 'energyTransporter') {
                  roleEnergyTransporter.run(creep);
        } else if (creep.memory.role == 'remoteRepairer') {
                          roleRepairHere.run(creep);
        }
        // If a creep is about to die drop the energy it has on hand
        if (creep.ticksToLive < 5 && creep.carry > 0){

          creep.drop(RESOURCES_ALL);
          creep.suicide();
        }
        if (creep.ticksToLive < 100 && creep.ticksToLive > 95 && (Game.time/10) == (Math.floor(Game.time/10))) {
            console.log('WARNING! Creep ' + creep.name + ' of type: ' + creep.memory.role + ' Has ~100 ticks to live');
        }
        if (creep.ticksToLive < 50 && creep.ticksToLive > 45 && (Game.time/10) == (Math.floor(Game.time/10))){
           console.log('WARNING! Creep ' + creep.name + '(' + creep.memory.role + ') In Room: ' + creep.room.name + ' Has ~50 ticks to live');
           spawnPreLoad = creep.memory.role;
           spawnPreLoadTarget = creep.memory.targetRoom;
        }
    }
    // If there is a creep and a tower Enable our Tower to defend/repairer
    if (creep != undefined) defendRoom(HOME);

    if (creep != undefined) var walls = creep.room.find(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_WALL});
    //console.log('Energy Available: '+ Game.spawns.Spawn1.room.energyAvailable);

    // Check if not at max energy and if there are no harvesters...rescue with largest possible creep to harvest
    if (utility.howManyOfRole('harvester', HOME) == 0) {
        var name = Game.spawns.Spawn1.createCustomCreep(
            Game.spawns.Spawn1.room.energyAvailable, 'harvester', HOME);
            console.log('EMERGENCY: Spawning harvester type creep with remaining energy');
    }
    defendRoom('W89N53');
    // temporary code to build remote workers for new room but only if energy is maxed out
    // add this to the if statement below to only try when the spawn is idle)

   if (Game.spawns.Spawn1.room.energyAvailable >=1200 && spawnIdle) {
    if (utility.howManyOfRole('harvester' , HOME) < minimumNumberOfHarvesters) {
      var name = Game.spawns.Spawn1.createCustomCreep(energyAvailable, 'harvester', HOME);
      console.log('Spawning harvester type creep');
    } else
    if (utility.howManyOfRole('upgrader',REMOTE1) < (maxUpgraders - minimumNumberOfUpgraders) && numberOfUpgraders < maxUpgraders && numberOfUpgraders >= minimumNumberOfUpgraders){
       var name = Game.spawns.Spawn1.createCustomCreep(energyAvailable, 'upgrader',REMOTE1);
       console.log('spawn remote upgrader from: '+ energyAvailable +' energy for  ' + REMOTE1);
     } else
       if (utility.howManyOfRole('upgrader', HOME) < maxUpgraders) {
       var name = Game.spawns.Spawn1.createCustomCreep(energyAvailable, 'upgrader', HOME);
             console.log('Spawning upgrader type creep');
    } else
    if (utility.howManyOfRole('builder',REMOTE1) < 1 && numberOfBuilders < maxBuilders && numberOfBuilders >= minimumNumberOfBuilders ){
       var name = Game.spawns.Spawn1.createCustomCreep(energyAvailable, 'builder','W89N53');
       console.log('spawn remote builder from: '+ energyAvailable +' energy for  ' + REMOTE1);
    } else
    if (utility.howManyOfRole('repairer','W89N53') < 1 && numberOfRepairers < maxRepairers && numberOfRepairers >= minimumNumberOfRepairers ){
       var name = Game.spawns.Spawn1.createCustomCreep(energyAvailable, 'repairer','W89N53');
       console.log('spawn remote repairer from: '+ energyAvailable +' energy for  ' + REMOTE1);
     } else
     if (numberOfHarvesters < maxHarvesters && numberOfHarvesters >= minimumNumberOfHarvesters ){
        var name = Game.spawns.Spawn1.createCustomCreep(energyAvailable, 'harvester', REMOTE1);
        console.log('spawn remote harvester from: '+ energyAvailable +' energy for  ' + REMOTE1);
      } else
      if (utility.howManyOfRole('energyTransporter',REMOTE1)<1 && numberOfEnergyTransporters < maxEnergyTransporters && numberOfEnergyTransporters >= minimumNumberofEnergyTransporters ){
         var name = Game.spawns.Spawn1.createEnergyTransporterCreep(energyAvailable, 'energyTransporter',REMOTE1);
         console.log('spawn remote energyTransporter from: '+ energyAvailable +' energy for  ' + REMOTE1);
      } else
      if (utility.howManyOfRole('longDistanceHarvester') < minimumNumberOfLongDistanceHarvesters){
         var name = Game.spawns.Spawn1.createLongDistanceHarvester(energyAvailable,'longDistanceHarvester', 4, HOME, REMOTE1,0);
         console.log('Spawning longDistanceHarvester type creep targeting  ' + HOME);
      } else
      if(numberOfRoomClaimers < 1 && claimRoomTarget != ''){
        var name = Game.spawns.Spawn1.createClaimer(HOME, claimRoomTarget);
        console.log('spawn remote roomClaimer from: '+ energyAvailable +' energy in HOME targeting ' + claimRoomTarget);
      } else
        if ((numberOfRepairers < minimumNumberOfRepairers) || (utility.howManyOfRole('repairer', HOME) < minimumNumberOfRepairers)) {
        var name = Game.spawns.Spawn1.createCustomCreep(energyAvailable, 'repairer', HOME);
              console.log('Spawning repairer type creep');
      } else
        if (numberOfEnergyTransporters < minimumNumberofEnergyTransporters){
        var name = Game.spawns.Spawn1.createEnergyTransporterCreep(energyAvailable, 'energyTransporter', HOME);
              console.log('Spawning energyTransporter type creep');
      } else
        if (numberOfWallRepairers >= minimumNumberOfWallRepairers && numberOfWallRepairers < maxWallRepairers) {
        var name = Game.spawns.Spawn1.createCustomCreep(energyAvailable, 'wallRepairer', REMOTE1)
        console.log('Spawning wallRepairer type creep targeting  ' + REMOTE1);
      } else
        if (numberOfResourceCleaners < minimumNumberOfResourceCleaners) {
        var name = Game.spawns.Spawn1.createResourceCleaner(energyAvailable,'resourceCleaner', HOME);
        console.log('Spawning resourceCleaner type creep' );
      } else
        if (numberOfBuilders < minimumNumberOfBuilders){
        var name = Game.spawns.Spawn1.createCustomCreep(energyAvailable, 'builder', HOME);
        console.log('Spawning builder type creep in ' + HOME);
      } else if (numberOfWallRepairers < minimumNumberOfWallRepairers && walls != undefined) {
        var name = Game.spawns.Spawn1.createCustomCreep(energyAvailable, 'wallRepairer', HOME)
        console.log('Spawning wallRepairer type creep in ' + HOME);
      } else if (numberOfLongDistanceHarvesters < minimumNumberOfLongDistanceHarvesters) {
        var name = Game.spawns.Spawn1.createLongDistanceHarvester(energyAvailable,'longDistanceHarvester', 4, HOME, REMOTE1,0);
         console.log('Spawning longDistanceHarvester type creep targeting  ' + REMOTE1);
      } else if (numberOfRemoteBuilders < minimumNumberOfRemoteBuilders) {
        var name = Game.spawns.Spawn1.createCustomCreep(energyAvailable, 'remoteBuilder',REMOTE1);
        console.log('Spawning remoteBuilder type creep in  ' + REMOTE1);
      } else if (numberOfBuilders < minimumNumberOfRemoteRepairers) {
         var name = Game.spawns.Spawn1.createCustomCreep(energyAvailable, 'remoteRepairer', REMOTE1);
         console.log('Spawning remoteRepairer type creep in  ' + REMOTE1);
       } else if (numberOfHarvesters < maxHarvesters) {
         var name = Game.spawns.Spawn1.createCustomCreep(energyAvailable, 'harvester', HOME);
         console.log('Spawning harvester type creep in ' + HOME);
       } else if (numberOfBuilders < maxBuilders) {
         var name = Game.spawns.Spawn1.createCustomCreep(energyAvailable, 'builder', HOME);
         console.log('Spawning builder type creep in '+ HOME);
       }
    }
}
