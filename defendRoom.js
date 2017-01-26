module.exports = function(roomName) {
    var hostiles = Game.rooms[roomName].find(FIND_HOSTILE_CREEPS);
    var repairCount = 0;
    if (hostiles.length > 0) {
        var username = hostiles[0].owner.username;
        Game.notify(`User ${username} spotted in room ${roomName}`);
        var towers = Game.rooms[roomName].find(
            FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
        towers.forEach(tower => tower.attack(hostiles[0]));
    } else {
        // no hostiles  find something to repair
        var towers = Game.rooms[roomName].find(
            FIND_MY_STRUCTURES, {
                filter: {
                    structureType: STRUCTURE_TOWER}});
        var repairTarget = Game.rooms[roomName].find(FIND_STRUCTURES, {
            filter: {structureType: STRUCTURE_WALL}});

        if (repairTarget != undefined) {
             //step through all the identified repairtargets and repair them if they are under 70%
            for (var i = 0; i < repairTarget.length; i++) {
                //if (repairTarget[i].hits < (repairTarget[i].hitsMax * .1) && repairTarget[i] == STRUCTURE_RAMPART)
                //console.log('Tower Target: ' + repairTarget[i].structureType);
                    if (repairTarget[i].hits < 175000){
                      if (towers[0].repair(repairTarget[i]) == OK) {
                          //console.log("Repairing road.");
                          repairCount++;
                    }
                  }
             }

          }

            // now look at walls to repair
            var towers = Game.rooms[roomName].find(
                FIND_MY_STRUCTURES, {
                    filter: {structureType: STRUCTURE_TOWER}});
            var repairTarget = Game.rooms[roomName].find(FIND_STRUCTURES, {
                filter: {structureType: !STRUCTURE_WALL}});

            if (repairTarget != undefined) {
                // step through all the identified repairtargets and repair them if they are under 20%
                for (var i = 0; i < repairTarget.length; i++) {
                    if (repairTarget[i].hits < (repairTarget[i].hitsMax * .001))
                        towers[0].repair(repairTarget[i]);
                }
            }
        }
    };
