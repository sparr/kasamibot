import * as OperationSpawnmove from "../operations/Spawnmove";

import * as IntelLib from "../lib/intel";

import {OperationType} from "../enums/operationtypes";

export function createSpawnmoveOperation(room: Room, basePos: RoomPosition) {
    let op: OperationSpawnmove.Data = new OperationSpawnmove.Data();
    op.operationtype = OperationType.Spawnmove;
    op.roomName = room.name;
    op.victoryCondition = OperationSpawnmove.VictoryCondition.Spawnmoved;
    op.victoryValue = basePos;
    if (Memory.operations === undefined) {
        Memory.operations = [];
    }
    Memory.operations.push(op);
    console.log("Starting a operation to move the spawn in room " + room.name + ". It will start when we have a storage at RCL 4.");
    return true;
}

export function findBaseLocation(roomName: string, firstRoom: boolean = false): {pos: RoomPosition, value: number} | undefined {
    let max = 10; // FIXME!!

    const dt = distanceTransform(walkablePixelsForRoom(roomName)); // a bare Uint8Array
    const cm = new PathFinder.CostMatrix();
    cm._bits = dt; // now we have a real CostMatrix for future use

    if (max < 5 && !firstRoom) {
        console.log("Did not find a spawnposition for room " + roomName);
        return undefined;
    }

    let perfect: RoomPosition[] = [];
    let okey: RoomPosition[] = [];
    let possible: RoomPosition[] = [];

    for (let x of _.range(7, 42)) {
        for (let y of _.range(7, 42)) {
            if (cm.get(x, y) > 4) { // quickly reject very-small spaces
                if (cm.get(x - 1, y) > 4 && cm.get(x + 1, y) > 4 &&
                    cm.get(x, y - 1) > 4 && cm.get(x, y + 1) > 4) {
                    // now there's room for all extensions but the outer 8
                    if (cm.get(x, y) > 5 &&
                        cm.get(x - 2, y) > 4 && cm.get(x + 2, y) > 4 &&
                        cm.get(x, y - 2) > 4 && cm.get(x, y + 2) > 4
                        ) {
                        // room for the whole bunker
                        perfect.push(new RoomPosition(x, y, roomName));
                        if (Game.rooms[roomName]) {
                            Game.rooms[roomName].visual.rect(x - 0.5, y - 0.5, 1, 1, {stroke: "#00FF00", opacity: 0.5});
                        }
                    } else if (
                        cm.get(x - 6, y + 2) > 0 &&
                        cm.get(x - 6, y - 2) > 0 &&
                        cm.get(x - 2, y - 6) > 0 &&
                        cm.get(x + 2, y - 6) > 0 &&
                        cm.get(x + 6, y - 2) > 0 &&
                        cm.get(x + 6, y    ) > 0 &&
                        cm.get(x    , y + 6) > 0 &&
                        cm.get(x - 2, y + 6) > 0
                        ) {
                        // room for the whole bunker except some defensive perimeter
                        okey.push(new RoomPosition(x, y, roomName));
                        if (Game.rooms[roomName]) {
                            Game.rooms[roomName].visual.rect(x - 0.5, y - 0.5, 1, 1, {stroke: "#FFFF00", opacity: 0.5});
                        }
                    }
                }
                // TODO track possible with alternate layouts?
            }
        }
    }

    if (firstRoom) {
        perfect = removeTrickyPositions(roomName, perfect);
        okey = removeTrickyPositions(roomName, okey);
        possible = removeTrickyPositions(roomName, possible);
    }

    perfect = filterDistanceToVitalPositions(roomName, perfect);

    if (perfect.length > 0) {
        if (perfect.length > 10) {
            perfect = _.sample(perfect, 10);
        }
        let chosen = findBestSpawnPosition(roomName, perfect);
        let spawnpos = new RoomPosition(chosen.x, chosen.y, chosen.roomName);
        console.log("Found perfect spawnlocation for " + roomName + ": " + spawnpos);
        return {pos: spawnpos, value: 20};
    }

    okey = filterDistanceToVitalPositions(roomName, okey);

    if (okey.length > 0) {
        if (okey.length > 10) {
            okey = _.sample(okey, 10);
        }
        let chosen = findBestSpawnPosition(roomName, okey);
        let spawnpos = new RoomPosition(chosen.x, chosen.y, chosen.roomName);
        console.log("Found okey spawnlocation for " + roomName + ": " + spawnpos);
        return {pos: spawnpos, value: 0};
    }

    possible = filterDistanceToVitalPositions(roomName, possible);

    if (possible.length > 0) {
        if (possible.length > 10) {
            possible = _.sample(possible, 10);
        }
        let chosen = findBestSpawnPosition(roomName, possible);
        let spawnpos = new RoomPosition(chosen.x, chosen.y, chosen.roomName);
        console.log("Found possible spawnlocation for " + roomName + ": " + spawnpos);
        return {pos: spawnpos, value: -20};
    }

    if (firstRoom === true) {
        for (let x of _.range(1, 49)) {
            for (let y of _.range(1, 49)) {
                if (cm.get(x, y) === max - 1) {
                    let spawnpos = new RoomPosition(x, y, roomName);
                    console.log("Found best spawnlocation for " + roomName + ": " + spawnpos);
                    return {pos: spawnpos, value: -100};
                }
            }
        }
    }

    console.log("Did not find a spawnposition for room " + roomName);
    return undefined;
}

function removeTrickyPositions(roomName: string, positions: RoomPosition[]): RoomPosition[] {
    let room = Game.rooms[roomName];
    if (room === undefined) {
        return positions;
    }
    let spawn = room.getSpawn();
    if (spawn === undefined) {
        return positions;
    }
    let allowed: RoomPosition[] = [];
    for (let p of positions) {
        if ((p.x !== spawn.pos.x || (p.y !== spawn.pos.y && p.y !== spawn.pos.y - 1)) &&
            (p.x !== spawn.pos.x - 2 || p.y !== spawn.pos.y + 1)) {
            allowed.push(p);
        } else {
            console.log("Filtered out tricky position from possible basepositions");
        }
    }
    return allowed;
}

function findBestSpawnPosition(roomName: string, positions: RoomPosition[]): RoomPosition {
    if (positions.length < 1) {
        console.log("ERROR: Trying to choose among zero spawnpositions in room " + roomName);
        return new RoomPosition(25, 25, roomName);
    }
    let chosen = positions[0];
    let distance = getTargetsDistance(roomName, chosen);
    for (let p of positions) {
        let d = getTargetsDistance(roomName, p);
        if (d < distance) {
            chosen = p;
            distance = d;
        }
    }
    return chosen;
}

function getTargetsDistance(roomName: string, basePos: RoomPosition): number {
    if (!IntelLib.hasIntel(roomName)) {
        return 100;
    }
    let distance = 0;

    for (let sId of IntelLib.sourceIds(roomName)) {
        distance += basePos.getRangeTo(IntelLib.sourcePos(roomName, sId));
    }

    let cPos = IntelLib.controllerPos(roomName);
    if (cPos !== null) {
        distance += basePos.getRangeTo(cPos);
    }
    return distance;
}

function filterDistanceToVitalPositions(roomName: string, positions: RoomPosition[]): RoomPosition[] {
    let filtered: RoomPosition[] = [];
    if (!IntelLib.hasIntel(roomName)) {
        return positions;
    }
    let vitalTargets: RoomPosition[] = [];

    for (let sId of IntelLib.sourceIds(roomName)) {
        vitalTargets.push(IntelLib.sourcePos(roomName, sId));
    }

    let mPos = IntelLib.mineralPos(roomName);
    if (mPos !== undefined) {
        vitalTargets.push(mPos);
    }

    for (let p of positions) {
        let validPosition = true;
        for (let v of vitalTargets) {
            if (p.getRangeTo(v) < 6) {
                validPosition = false;
            }
        }
        let cPos = IntelLib.controllerPos(roomName);
        if (cPos !== null) {
            if (p.getRangeTo(cPos) < 8) {
                validPosition = false;
            }
        }
        if (validPosition) {
            filtered.push(p);
        }
    }
    return filtered;
}

/**
 *   @param {Uint8Array(2500)} array - one entry per square in the room
 *   @param {Number} oob - value used for pixels outside image bounds
 *   @return {Uint8Array(2500)}
 *
 *   the oob parameter is used so that if an object pixel is at the image boundary
 *   you can avoid having that reduce the pixel's value in the final output. Set
 *   it to a high value (e.g., 255) for this. Set oob to 0 to treat out of bounds
 *   as background pixels.
 */
function distanceTransform(array: Uint8Array, oob = 255) {
    // Variables to represent the 3x3 neighborhood of a pixel.
    let A, B, C;
    let D, E, F;
    let G, H, I;

    let n, value;
    for (n = 0; n < 2500; n++) {
        if (array[n] !== 0) {
            A = array[n - 51]; B = array[n - 1];
            D = array[n - 50];
            G = array[n - 49];
            if (           n % 50  ===  0) { A = oob; B = oob; }
            if (           n % 50  === 49) { G = oob; }
            if (Math.floor(n / 50) ===  0) { A = oob; D = oob; G = oob; }

            array[n] = (Math.min(A, B, D, G, 254) + 1);
        }
    }

    for (n = 2499; n >= 0; n--) {
        ;                                  C = array[n + 49];
        ;                E = array[n    ]; F = array[n + 50];
        ;                H = array[n + 1]; I = array[n + 51];
        if (           n % 50  ===  0) { C = oob; }
        if (           n % 50  === 49) { H = oob; I = oob; }
        if (Math.floor(n / 50) === 49) { C = oob; F = oob; I = oob; }

        array[n] = Math.min(C + 1, E, F + 1, H + 1, I + 1);
    }

    return array;
}

/**
 *    @param {string} roomName
 *    @return {Number[2500]}
 */
function walkablePixelsForRoom(roomName: string) {
    const array = new Uint8Array(2500);
    for (let x = 0; x < 50; ++x) {
        for (let y = 0; y < 50; ++y) {
            if (Game.map.getTerrainAt(x, y, roomName) !== "wall") {
                array[x * 50 + y] = 1;
            } else {
                array[x * 50 + y] = 0;
            }
        }
    }
    return array;
}
