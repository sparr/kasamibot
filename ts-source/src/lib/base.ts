import * as RoomRepository from "../repository/Room";

export function getPossibleExtensionsCount(room: Room): number {
    if (room === undefined || room.controller === undefined) {
        return 0;
    }
    return CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][room.controller.level];
}

export function getExtensionPositions(): number[][] {
    let positions = [
        [-2, -2], [ 2, -2], [-1, -3], [ 0, -3], [ 1, -3],
        [-3, -2], [ 3, -2], [-2, -4], [ 0, -4], [ 2, -4],
        [-3, -3], [-4, -3], [-4, -4], [-3, -5], [-2, -5],
        [ 3, -3], [ 4, -3], [ 4, -4], [ 3, -5], [ 2, -5],
        [-5, -4], [-5, -5], [-5, -6], [-4, -6], [-3, -6],
        [ 5, -4], [ 5, -5], [ 5, -6], [ 4, -6], [ 3, -6],
        [-1, -5], [-1, -6], [ 0, -6], [ 1, -6], [ 1, -5],
        [-4, 0], [-5, 0], [-6, 0], [-4, 1], [-6, 1],
        [-5, 2], [-6, 2], [-4, 3], [-6, 3],
        [-4, 4], [-5, 4], [-6, 4],
        [ 4, 0], [ 5, 0], [ 6, 0], [ 4, 1], [ 6, 1],
        [ 5, 2], [ 6, 2], [ 4, 3], [ 6, 3],
        [ 4, 4], [ 5, 4], [ 6, 4], // After this is reserves
        [ 5, -1], [-5, -1], [ 6, -1], [-6, -1],
        [ 7, -2], [-7, -2], [ 8, -3], [-8, -3],
        [-5, 6], [-6, 7], [-5, 7], [-4, 7], [-5, 8],
        [ 5, 6], [ 6, 7], [ 5, 7], [ 4, 7], [ 5, 8],
        ];
    return positions;
}

export function getPossibleTowerCount(room: Room): number {
    if (room === undefined || room.controller === undefined) {
        return 0;
    }
    return CONTROLLER_STRUCTURES[STRUCTURE_TOWER][room.controller.level];
}
export function getTowerPositions(): number[][] {
    let positions = [
        [ 2, 1], [-2, 1], [ 3, 2], [-3, 2], [-3, 3], [ 3, 3],
        ];
    return positions;
}

export function getPossibleSpawnCount(room: Room): number {
    if (room === undefined || room.controller === undefined) {
        return 0;
    }
    return CONTROLLER_STRUCTURES[STRUCTURE_SPAWN][room.controller.level];
}

export function getPossibleLinkCount(room: Room): number {
    if (room === undefined || room.controller === undefined) {
        return 0;
    }
    return CONTROLLER_STRUCTURES[STRUCTURE_LINK][room.controller.level];
}

export function getSpawnPositions(): number[][] {
    let positions = [
        [ 0, 0], [ 1, -1], [-1, -1],
        ];
    return positions;
}

export function getColonyRoadPositions(): number[][] {
    let positions = [
        [ 0, -1], [ 0, 1], [ 0, 4],
        [-1, -2], [-1, 2],
        [ 1, -2], [ 1, 2],
        [-1, 0], [ 1, 0], [-1, 3],
        [-1, 1], [ 1, 1], [ 1, 3],
        ];
    return positions;
}

export function getCityRoadPositions(): number[][] {
    let positions = [
        [-2, -1], [ 2, -1], [-2, 0], [ 2, 0],
        [ 0, 2], [ 0, 6], [ 1, 5], [ 2, 4],
        ];
    return positions;
}

export function getAllBaseRoads(basepos: RoomPosition): StructureRoad[] {
    let roads: StructureRoad[] = [];
    let positions = getColonyRoadPositions().concat(getCityRoadPositions());
    for (let a of positions) {
        let pos = new RoomPosition(basepos.x + a[0], basepos.y + a[1], basepos.roomName);
        for (let s of pos.lookFor(LOOK_STRUCTURES) as Structure[]) {
            if (s.structureType === STRUCTURE_ROAD) {
                roads.push(s as StructureRoad);
            }
        }
    }
    return roads;
}

export function getFortressWallPositions(): number[][] {
    let positions = [
        [-3, -1], [-2, -1], [-1, -1], [ 0, -1], [ 1, -1], [ 2, -1], [ 3, -1],
        [-3, 0], [ 3, 0],
        [-3, 1], [ 3, 1],
        [-3, 2], [ 3, 2],
        [-3, 3], [ 3, 3],
        [-3, 4], [ 3, 4],
        [-3, 5], [-2, 5], [-1, 5], [ 0, 5], [ 1, 5], [ 2, 5], [ 3, 5],
        ];
    return positions;
}

export function getImportantBuildingPositions(room: Room): number[][] {
    let positions: number[][] = [];
    let structures = room.find(FIND_MY_STRUCTURES, {filter: (s: Structure) =>
        s.structureType === STRUCTURE_SPAWN || s.structureType === STRUCTURE_TOWER || s.structureType === STRUCTURE_STORAGE}) as Structure[];
    for (let s of structures) {
        positions.push([s.pos.x, s.pos.y]);
    }
    return positions;
}

export function getShellWallPositions(): number[][] {
    let positions = [
        [ 0, 0], [-2, 1], [-2, 2], [ 2, 1], [ 2, 2], [ 0, 3], [ 1, 4],
        ];
    return positions;
}

export function getFortressRamparts(room: Room): Rampart[] {
    let ramparts: Rampart[] = [];
    let positions = getFortressWallPositions().concat(getShellWallPositions());
    let basepos = RoomRepository.getBasePosition(room);
    if (basepos !== undefined) {
        for (let posInfo of positions) {
            let pos = new RoomPosition(basepos.x + posInfo[0], basepos.y + posInfo[1], basepos.roomName);
            let structures = pos.lookFor(LOOK_STRUCTURES) as Structure[];
            for (let s of structures) {
                if (s.structureType === STRUCTURE_RAMPART) {
                    ramparts.push(s as Rampart);
                }
            }
        }
    }
    return ramparts;
}
