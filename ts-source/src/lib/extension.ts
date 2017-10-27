"use strict";
import * as BaseLib from "../lib/base";
import * as IntelLib from "../lib/intel";

import * as RoomPositionUtilities from "../utilities/RoomPosition";

export function initExtensionMemory(room: Room, basePos: RoomPosition) {
    if (room.memory.extPos === undefined || room.memory.extRoads === undefined) {
        let posInfo = getRoomExtensionPositionInfo(basePos);
        room.memory.extPos = JSON.stringify(_.map(posInfo.ext, RoomPositionUtilities.shortPos).join(""));
        room.memory.extRoads = JSON.stringify(_.map(posInfo.roads, RoomPositionUtilities.shortPos).join(""));
    }
}

export function simExtensions(basePos: RoomPosition) {
    // let cpu = Game.cpu.getUsed();
    let extensionPositionInfo = getRoomExtensionPositionInfo(basePos);
    const rv = new RoomVisual(basePos.roomName);
    // console.log('Extensionmath: ' + (Game.cpu.getUsed() - cpu));
    // console.log('Number of extensions: ' + extensionInfo.ext.length);
    for (let e of extensionPositionInfo.ext) {
        rv.rect(e.x - 0.5, e.y - 0.5, 1, 1);
    }
    for (let e of extensionPositionInfo.roads) {
        rv.rect(e.x - 0.5, e.y - 0.5, 1, 1, {fill: "#0000FF"});
    }
    rv.rect(basePos.x - 2.5, basePos.y - 2.5, 5, 5, {fill: "#FFFF00"});
}

export function getExtensionPositions(room: Room, basePos: RoomPosition): RoomPosition[] {
    initExtensionMemory(room, basePos);
    function expand(shortPos: string) {
        return RoomPositionUtilities.longPos(shortPos, room.name);
    }
    return _.map(JSON.parse(room.memory.extPos), expand);
}

export function getExtensions(room: Room, basePos: RoomPosition): StructureExtension[] {
    initExtensionMemory(room, basePos);
    function expand(shortPos: string) {
        return RoomPositionUtilities.longPos(shortPos, room.name);
    }
    let positions = _.map(JSON.parse(room.memory.extPos), expand);
    let exts: StructureExtension[] = [];
    for (const position of positions) {
        let atpos = position.lookFor(LOOK_STRUCTURES) as Structure[];
        for (let s of atpos) {
            if (s.structureType === STRUCTURE_EXTENSION) {
                exts.push(s as StructureExtension);
            }
        }
    }
    return room.find(FIND_MY_STRUCTURES, {filter: (s: Structure) => s.structureType === STRUCTURE_EXTENSION});
    // FIXME ^^ needed to not dismantle misplaced extensions, for now
    // return exts;
}

export function getExtensionRoads(room: Room, basePos: RoomPosition): StructureRoad[] {
    initExtensionMemory(room, basePos);
    function expand(shortPos: string) {
        return RoomPositionUtilities.longPos(shortPos, room.name);
    }
    let positions = _.map(JSON.parse(room.memory.extRoads), expand);
    let extroads: StructureRoad[] = [];
    for (const position of positions) {
        let atpos = position.lookFor(LOOK_STRUCTURES) as Structure[];
        for (let s of atpos) {
            if (s.structureType === STRUCTURE_ROAD) {
                extroads.push(s as StructureRoad);
            }
        }
    }
    return extroads;
}

export function destroyExtensionsNotCorrectlyPlaced(room: Room, basePos: RoomPosition) {
    initExtensionMemory(room, basePos);
    let count = 0;
    function expand(shortPos: string) {
        return RoomPositionUtilities.longPos(shortPos, room.name);
    }
    let positions = _.map(JSON.parse(room.memory.extPos), expand);    let extensions = room.find(FIND_MY_STRUCTURES, {filter: (s: Structure) => s.structureType === STRUCTURE_EXTENSION}) as Structure[];
    for (let e of extensions) {
        if (!_.contains(positions, e.pos)) {
            count++;
            e.destroy();
        }
    }
    if (count > 0) {
        console.log("Running destroy extensions in room " + room.name);
        console.log("Room " + room.name + " destroyed " + count + " extensions.");
    }
}

export function getRoadPositions(room: Room, basePos: RoomPosition): RoomPosition[] {
    initExtensionMemory(room, basePos);
    function expand(shortPos: string) {
        return RoomPositionUtilities.longPos(shortPos, room.name);
    }
    return _.map(JSON.parse(room.memory.extRoads), expand);
}

export function getRoomExtensionPositionInfo(basePos: RoomPosition): {ext: Array<{x: number, y: number}>, roads: Array<{x: number, y: number}>} {
    let roadPositions: RoomPosition[] = [];
    let extPositions: RoomPosition[] = [];

    let tempExtPositionsRelative: Array<{x: number, y: number}> = [];
    // get the extensions in the order we should build them
    for (const char of ["1", "2", "3", "4", "5", "6", "7", "8"]) {
        tempExtPositionsRelative = tempExtPositionsRelative.concat(BaseLib.getPositions(BaseLib.bunkerExtensionOrder, char));
    }
    for (let relPos of tempExtPositionsRelative) {
        const pos = new RoomPosition(relPos.x + basePos.x, relPos.y + basePos.y, basePos.roomName);
        if (Game.map.getTerrainAt(pos.x, pos.y, pos.roomName) !== "wall") {
            extPositions.push(pos);
        }
    }
    extPositions = _.uniq(extPositions);

    if (extPositions.length < 60) {
        // addLowerWings(basePos, extPositions, roadPositions);
    }

    // removeExtensionToVitalTargets(basePos, extPositions);

    if (extPositions.length > 60) {
        extPositions = extPositions.slice(0, 60);
    } else
    if (extPositions.length < 60) {
        addSingleExtensions(basePos, extPositions);
    }
    return {ext: extPositions, roads: roadPositions};
}

function addSingleExtensions(basePos: RoomPosition, extPositions: RoomPosition[]) {
    const roomName = basePos.roomName;
    let cm = new PathFinder.CostMatrix();

    for (let x of _.range(0, 50)) {
        for (let y of _.range(0, 50)) {
            let terrain = Game.map.getTerrainAt(x, y, roomName);
            if (terrain === "wall") {
                cm.set(x, y, 1);
            } else
            if (x < 3 || x > 46 || y < 3 || y > 46) {
                cm.set(x, y, 1);
            }
        }
    }
    for (let x of _.range(-3, 3)) {
        for (let y of _.range(-3, 3)) {
            cm.set(basePos.x + x, basePos.y + y, 1);
        }
    }
    // TODO don't overwrite labs!

    for (let p of extPositions) {
        cm.set(p.x, p.y, 1);
    }

    let room = Game.rooms[roomName];
    if (room !== undefined) {
        if (room.controller !== undefined) {
            let controllerPos = room.controller.getContainerPosition();
            if (controllerPos !== undefined) {
                cm.set(controllerPos.x, controllerPos.y, 1);
            }
        }
        let sources = room.getSources();
        if (sources.length > 0) {
            for (let s of sources) {
                let scontpos = s.getContainerPosition();
                if (scontpos !== undefined) {
                    cm.set(scontpos.x, scontpos.y, 1);
                }
            }
        }
    }

    let possiblePositions: RoomPosition[] = [];

    for (let x of _.range(3, 47)) {
        for (let y of _.range(3, 47)) {
            if (cm.get(x, y) === 0 && x % 2 === y % 2 && posOnlyHasOneNeighbour(x, y, cm)) {
                if (!_.contains(extPositions, {x, y, roomName})) {
                    let p = new RoomPosition(x, y, roomName);
                    if (getRangeToClosestVital(p) > 2) {
                        possiblePositions.push(p);
                    }
                }
            }
        }
    }
    if (IntelLib.hasIntel(roomName)) {
        let extcm = new PathFinder.CostMatrix();

        for (let p of extPositions) {
            extcm.set(p.x, p.y, 0xFF);
        }

        let counter = 50;
        while (extPositions.length < 60 && counter > 0 && possiblePositions.length > 0) {
            let bestPos = basePos.findClosestByRange(possiblePositions);
            let pathDistance = PathFinder.search(basePos, {pos: bestPos, range: 1}, {plainCost: 1, swampCost: 1, maxRooms: 1, roomCallback: (r: string) => {
                if (Game.rooms[r] === undefined) {
                    return extcm;
                }
                return extcm;
            }}).path.length - 1;
            let range = basePos.getRangeTo(bestPos);
            if (pathDistance <= range * 1.5) {
                extPositions.push(bestPos);
            }
            _.pull(possiblePositions, bestPos);
            counter--;
        }
    }
}

function getRangeToClosestVital(p: RoomPosition): number {
    let vitalTargets: RoomPosition[] = [];

    if (!IntelLib.hasIntel(p.roomName)) {
        return 25;
    }
    for (let sId of IntelLib.sourceIds(p.roomName)) {
        vitalTargets.push(IntelLib.sourcePos(p.roomName, sId));
    }

    let mPos = IntelLib.mineralPos(p.roomName);
    if (mPos !== undefined) {
        vitalTargets.push(mPos);
    }

    let cPos = IntelLib.controllerPos(p.roomName);
    if (cPos !== null) {
        vitalTargets.push(cPos);
    }

    let range = 10;
    for (let t of vitalTargets) {
        let r = p.getRangeTo(t);
        if (r < range) {
            range = r;
        }
    }
    return range;
}

function posOnlyHasOneNeighbour(x: number, y: number, cm: CostMatrix): boolean {
    if (cm.get(x - 1, y) === 1 && cm.get(x + 1, y) === 1) {
        return false;
    }
    if (cm.get(x, y - 1) === 1 && cm.get(x, y + 1) === 1) {
        return false;
    }
    return true;
}

function removeExtensionToVitalTargets(basePos: RoomPosition, extPositions: RoomPosition[]) {
    let roomName = basePos.roomName;
    if (!IntelLib.hasIntel(roomName)) {
        return;
    }
    let vitalTargets: RoomPosition[] = [];

    for (let sId of IntelLib.sourceIds(roomName)) {
        vitalTargets.push(IntelLib.sourcePos(roomName, sId));
    }

    let cPos = IntelLib.controllerPos(roomName);
    if (cPos !== null) {
        vitalTargets.push(cPos);
    }

    let mPos = IntelLib.mineralPos(roomName);
    if (mPos !== undefined) {
        vitalTargets.push(mPos);
    }

    // TODO: Add exits

    let cm = getExtensionRoomCallback(extPositions);
    for (let vital of vitalTargets) {
        let ret = PathFinder.search(basePos, {pos: vital, range: 1}, {
            plainCost: 1,
            swampCost: 1,
            roomCallback: () => cm,
            maxRooms: 1,
        } );
        if (ret.cost > 200) {
            for (let p of ret.path) {
                _.pull(extPositions, p);
            }
        }
    }
}

function getExtensionRoomCallback(extPositions: RoomPosition[]): CostMatrix {
    let costs = new PathFinder.CostMatrix();

    for (let p of extPositions) {
        costs.set(p.x, p.y, 0xfe);
    }
    return costs;
}
