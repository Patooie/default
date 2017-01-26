
module.exports = function() {
  StructureSpawn.prototype.createCustomCreep =
    function(energy, roleName, targetRoom){
      var numberOfParts = Math.floor(energy / 200);
      var body = [];
      for (let i = 0; i< numberOfParts; i++){
        body.push(WORK);
      }
      for (let i = 0; i< numberOfParts; i++){
        body.push(CARRY);
      }
      for (let i = 0; i< numberOfParts; i++){
        body.push(MOVE);
        }
      return this.createCreep(body, undefined, { role: roleName,
        working: false,
        idleCount: 0,
        lockTarget: '',
        targetRoom: targetRoom,
        sourceID: 0,
        lockTimer: 0});
    }
  StructureSpawn.prototype.createEnergyTransporterCreep =
      function(energy, roleName, targetRoom){
        var numberOfParts = Math.floor(energy / 100);
        var body = [];

        for (let i = 0; i< numberOfParts; i++){
          body.push(CARRY);
        }
        for (let i = 0; i< numberOfParts; i++){
          body.push(MOVE);
          }
        return this.createCreep(body, undefined, { role: roleName,
          working: false,
          idleCount: 0,
          lockTarget: 0,
          targetRoom: targetRoom,
          sourceID: 0,
          lockTimer: 0});
      }
  StructureSpawn.prototype.createLongDistanceHarvester =
    function (energy, roleName, numberOfWorkParts, home, target, sourceIndex){
      var body = [];
      for (let i = 0; i< numberOfWorkParts; i++){
        body.push(WORK);
      }
      // reduce available energy by the energy needed for each work parts before
      // building the carry and move portions of the body
      energy -= 150 * numberOfWorkParts;
      var numberOfParts = Math.floor(energy /100);
      for (let i = 0; i< numberOfParts; i++){
        body.push(CARRY);
      }
      for (let i = 0; i< numberOfParts + numberOfWorkParts; i++){
        body.push(MOVE);
        }
        // now assemble the entire body and create the creep
        return this.createCreep(body, undefined, { role: roleName,
        home: home,
        target: target,
        working: false,
        idleCount: 0,
        lockTarget: 0,
        sourceIndex: sourceIndex,
        thisTripOdometer: 0,
        lastTripOdometer: 0,
        goDie: false,
        lockTimer: 0});
    }
    StructureSpawn.prototype.createClaimer =
      function (home, target){
          // create a disposable controller claimer (this is a one way trip)
          // now assemble the entire body and create the creep
          return this.createCreep([CLAIM, MOVE, MOVE, MOVE], undefined, { role: 'roomClaimer',
          home: home,
          target: target,
          working: false
        });
      }
      StructureSpawn.prototype.createResourceCleaner =
        function (energy, roomName){
            // create a disposable creeper that runs around and vaccums up dropped
            // energy and returns it to the closest container or spawn
            var numberOfParts = Math.floor(energy / 100);
            // cap the resource cleaner size at 10 parts max
            if (numberOfParts > 5) numberOfParts = 5;
            var body = [];
            for (let i = 0; i< numberOfParts; i++){
              body.push(CARRY);
            }
            for (let i = 0; i< numberOfParts; i++){
              body.push(MOVE);
            }
            return this.createCreep(body, undefined, { role: 'resourceCleaner',
            working: false,
            idleCount: 0,
            targetRoom: roomName,
            idle: false
          });
        }

};
