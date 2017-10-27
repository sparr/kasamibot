import * as RoomRepository from "../repository/Room";

// maps letters in the layout arrays to structures and vice versa
export const layoutKey = {
    "A": STRUCTURE_SPAWN, [STRUCTURE_SPAWN]: "A",
    "N": STRUCTURE_NUKER, [STRUCTURE_NUKER]: "N",
    "K": STRUCTURE_LINK, [STRUCTURE_LINK]: "K",
    "L": STRUCTURE_LAB, [STRUCTURE_LAB]: "L",
    "E": STRUCTURE_EXTENSION, [STRUCTURE_EXTENSION]: "E",
    "S": STRUCTURE_STORAGE, [STRUCTURE_STORAGE]: "S",
    "T": STRUCTURE_TOWER, [STRUCTURE_TOWER]: "T",
    "O": STRUCTURE_OBSERVER, [STRUCTURE_OBSERVER]: "O",
    "M": STRUCTURE_TERMINAL, [STRUCTURE_TERMINAL]: "M",
    "P": STRUCTURE_POWER_SPAWN, [STRUCTURE_POWER_SPAWN]: "P",
    ".": STRUCTURE_ROAD, [STRUCTURE_ROAD]: ".",
    "C": STRUCTURE_CONTAINER, [STRUCTURE_CONTAINER]: "C",
    "R": STRUCTURE_RAMPART, [STRUCTURE_RAMPART]: "R",
    "W": STRUCTURE_WALL, [STRUCTURE_WALL]: "W",
};

// the preferred layout, if there"s enough room
export const bunkerLayout = [
    "  ..E...E..  ",
    " .EE.EEE.EE. ",
    ".EE.E.E.E.EE.",
    ".E.EEA.EEE.E.",
    "E.EEE.T.EEE.E",
    ".E.E.T.T.A.E.",
    ".EE.NSKMP.E.E",
    ".E.E.T.T.E.E.",
    "E.EEE.T.OLL..",
    ".E.EEA.ELL.L.",
    ".EE.E.E.L.LL.",
    " .EE.E.E.LL. ",
    "  ..E.E....  ",
];

export const bunkerExtensionOrder = [
    "    3   7    ",
    "  43 447 78  ",
    " 43 2 4 7 78 ",
    " 3 24  887 7 ",
    "3 242   887 7",
    " 4 2       7 ",
    " 44       8 8",
    " 5 5     8 8 ",
    "5 566        ",
    " 5 56  6     ",
    " 65 5 6      ",
    "  65 5 6     ",
    "    6 6      ",
];

export const bunkerRoadOrder = [
    "  .. ... ..  ",
    " .  2   7  . ",
    ".  2 2 7 7  .",
    ". 2   2   7 .",
    " 2   2 3   7 ",
    ". 2 2 3 7 7 .",
    ".  2     7 8 ",
    ". 5 5 . . 8 .",
    " 5   5 .   ..",
    ". 5   5   . .",
    ".  5 5 6 .  .",
    " .  5 6 .  . ",
    "  .. . ....  ",
];

export const bunkerRampartOrder = [
    "  555555555  ",
    " 55777777755 ",
    "5577777777755",
    "57777   77775",
    "5777  3  7775",
    "577  333  775",
    "577 33333 775",
    "577  333  775",
    "5777  3  7775",
    "57777   77775",
    "5577777777755",
    " 55777777755 ",
    "  555555555  ",
];

// just the core of the bunker, plus two spawns
export const coreLayout = [
    "   .   ",
    "  AT.  ",
    " .T.T. ",
    ".NSKMP.",
    " .T.T. ",
    "  .TAO ",
    "   .   ",
];

// just the lab block, for placement elsewhere if necessary
export const labLayout = [
    " LL.",
    "LL.L",
    "L.LL",
    ".LL ",
];

// rapid-fill extension block, if there"s room
export const extensionLayout = [
    "     EEE   ",
    "   EErrEE  ",
    "  EErEErEE ",
    " EErEEErrEE",
    "EErECECEErE",
    " rEEEKEEEr ",
    "ErEECECErEE",
    "EErrEEErEE ",
    " EErEErEE  ",
    "  EErrEE   ",
    "   EEE     ",
];

/**
 * Get all the positions from a layout, grouped by character
 * @param  {String[]} layout
 * @return {[char: string]: Array<{x: number, y: number}>} map of structure types to arrays of coordinate objects
 */
export function getAllPositions(layout: string[]): {[char: string]: Array<{x: number, y: number}>} {
    const height = layout.length;
    const width = layout[0].length;
    const top = Math.trunc(height / 2);
    const left = Math.trunc(width / 2);
    const positions: {[char: string]: Array<{x: number, y: number}>} = {};
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const iChar = layout[y][x];
            positions[layoutKey[iChar]] = positions[layoutKey[iChar]] || [];
            positions[layoutKey[iChar]].push({x: x - left, y: y - top});
        }
    }
    return positions;
}

/**
 * Get all the positions for a certain structure/letter from a layout
 * @param  {String[]} layout
 * @param  {String|String[]} char letter or structure to return, optional
 * @return {{x:Number,y:Number}[]} array of coordinate objects
 */
export function getPositions(layout: string[], char: string | string[]): Array<{x: number, y: number}> {
    if (typeof(char) === "string") {
        char = [char];
    }
    const height = layout.length;
    const width = layout[0].length;
    const top = Math.trunc(height / 2);
    const left = Math.trunc(width / 2);
    const positions = [];
    for (let c of char) {
        if (c.length > 1) {
            if (c in layoutKey) {
                c = layoutKey[c];
            } else {
                continue;
            }
        }
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                if (layout[y][x] === c) {
                    positions.push({x: x - left, y: y - top});
                }
            }
        }
    }
    return positions;
};

export function getPossibleExtensionsCount(room: Room): number {
    if (room === undefined || room.controller === undefined) {
        return 0;
    }
    return CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][room.controller.level];
}

export function getPossibleTowerCount(room: Room): number {
    if (room === undefined || room.controller === undefined) {
        return 0;
    }
    return CONTROLLER_STRUCTURES[STRUCTURE_TOWER][room.controller.level];
}
export function getTowerPositions(): Array<{x: number, y: number}> {
    return getPositions(bunkerLayout, STRUCTURE_TOWER) as Array<{x: number, y: number}>;
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

export function getSpawnPositions() {
    return _.sortBy(getPositions(bunkerLayout, STRUCTURE_SPAWN), (pos) => pos.x * 50 + pos.y);
}

export function getColonyRoadPositions() {
    return getPositions(bunkerRoadOrder, "2");
}

export function getCityRoadPositions() {
    return getPositions(bunkerLayout, STRUCTURE_ROAD);
}

export function getAllBaseRoads(basepos: RoomPosition): StructureRoad[] {
    let roads: StructureRoad[] = [];
    let positions = getCityRoadPositions();
    for (let a of positions) {
        let pos = new RoomPosition(basepos.x + a.x, basepos.y + a.y, basepos.roomName);
        for (let s of pos.lookFor(LOOK_STRUCTURES) as Structure[]) {
            if (s.structureType === STRUCTURE_ROAD) {
                roads.push(s as StructureRoad);
            }
        }
    }
    return roads;
}

export function getFortressWallPositions() {
    return getPositions(bunkerRampartOrder, "3");
}

export function getImportantBuildingPositions(room: Room): RoomPosition[] {
    let positions: RoomPosition[] = [];
    let structures = room.find(FIND_MY_STRUCTURES, {filter: (s: Structure) =>
        s.structureType === STRUCTURE_SPAWN || s.structureType === STRUCTURE_TOWER || s.structureType === STRUCTURE_STORAGE}) as Structure[];
    for (let s of structures) {
        positions.push(s.pos);
    }
    return positions;
}

export function getShellWallPositions() {
    return getPositions(bunkerRampartOrder, ["5"]);
}

export function getFortressRamparts(room: Room): Rampart[] {
    let ramparts: Rampart[] = [];
    let positions = getFortressWallPositions().concat(getShellWallPositions());
    let basepos = RoomRepository.getBasePosition(room);
    if (basepos !== undefined) {
        for (let position of positions) {
            let pos = new RoomPosition(basepos.x + position.x, basepos.y + position.y, basepos.roomName);
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
