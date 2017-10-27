import * as RoomPositionUtilities from "../utilities/RoomPosition";

Room.prototype.getHostileCreeps = function getHostileCreeps(): Creep[] {
    return this.find(FIND_HOSTILE_CREEPS) as Creep[];
};

Room.prototype.getHostileCreepsNotAtBorder = function getHostileCreepsNotAtBorder(): Creep[] {
    return _.filter(this.getHostileCreeps(), (c: Creep) => {return !c.isAtBorder(); });
};

Room.prototype.hasHostileCreeps = function hasHostileCreeps(): boolean {
    return this.getHostileCreeps().length > 0;
};

Room.prototype.getSpawns = function getSpawns(): Spawn[] {
    return this.find(FIND_MY_SPAWNS) as Spawn[];
};

Room.prototype.getSpawn = function getSpawn(): Spawn | undefined {
    let spawns = this.getSpawns();
    if (spawns.length === 0) {
        return undefined;
    }
    return spawns[0];
};

Room.prototype.getSources = function getSources(): Source[] {
    return this.find(FIND_SOURCES) as Source[];
};

Room.prototype.getMineral = function getMineral(): Mineral | undefined {
    let minerals = this.find(FIND_MINERALS) as Mineral[];
    if (minerals.length > 0) {
        return minerals[0];
    }
    return undefined;
};

Room.prototype.hasFreeSpawnCapacity = function hasFreeSpawnCapacity(): boolean {
    let spawns = this.getSpawns() as Spawn[];
    if (spawns === undefined || spawns.length < 1) {
        return false;
    }
    for (let spawn of spawns) {
        if (!spawn.spawning) {
            return true;
        }
    }
    return false;
};

Room.prototype.getFreeSpawn = function getFreeSpawn(): Spawn | undefined {
    let spawns = this.getSpawns() as Spawn[];
    if (spawns === undefined || spawns.length < 1) {
        return undefined;
    }
    for (let spawn of spawns) {
        if (!spawn.spawning) {
            return spawn;
        }
    }
    return undefined;
};

Room.prototype.getBoostLab = function getBoostLab(): StructureLab | undefined {
    if (this.memory.b === undefined) {
        return undefined;
    }
    let pos = RoomPositionUtilities.longPos(this.memory.b, this.name);
    let structures = (new RoomPosition(pos.x + 3, pos.y + 2, pos.roomName)).lookFor(LOOK_STRUCTURES) as Structure[];
    for (let s of structures) {
        if (s.structureType === STRUCTURE_LAB) {
            return s as StructureLab;
        }
    }
    return undefined;
};

Room.prototype.getPowerSpawn = function getPowerSpawn(): PowerSpawn | undefined {
    if (this.controller === undefined || this.controller.level < 8) {
        return undefined;
    }
    if (this.memory.powerspawn !== undefined) {
        let powerspawn = Game.getObjectById(this.memory.powerspawn);
        if (powerspawn instanceof StructurePowerSpawn) {
            return powerspawn;
        } else {
            this.memory.powerspawn = undefined;
        }
    }
    let powerspawn = this.find(FIND_MY_STRUCTURES, {filter: (s: Structure) => s.structureType === STRUCTURE_POWER_SPAWN}) as StructurePowerSpawn[];
    if (powerspawn.length > 0) {
        this.memory.powerspawn = powerspawn[0].id;
        return powerspawn[0];
    }
    return undefined;
};

Room.prototype.getNuker = function getNuker(): StructureNuker | undefined {
    if (this.controller === undefined || this.controller.level < 8) {
        return undefined;
    }
    if (this.memory.nuker !== undefined) {
        let nuker = Game.getObjectById(this.memory.nuker);
        if (nuker instanceof StructureNuker) {
            return nuker;
        } else {
            this.memory.nuker = undefined;
        }
    }
    let nuker = this.find(FIND_MY_STRUCTURES, {filter: (s: Structure) => s.structureType === STRUCTURE_NUKER}) as StructureNuker[];
    if (nuker.length > 0) {
        this.memory.nuker = nuker[0].id;
        return nuker[0];
    }
    return undefined;
};

Room.prototype.getObserver = function getObserver(): StructureObserver | undefined  {
    if (this.controller === undefined || this.controller.level < 8) {
        return undefined;
    }
    if (this.memory.observer !== undefined) {
        let observer = Game.getObjectById(this.memory.observer);
        if (observer instanceof StructureObserver) {
            return observer;
        } else {
            this.memory.observer = undefined;
        }
    }
    let observer = this.find(FIND_MY_STRUCTURES, {filter: (s: Structure) => s.structureType === STRUCTURE_OBSERVER}) as StructureObserver[];
    if (observer.length > 0) {
        this.memory.observer = observer[0].id;
        return observer[0];
    }
    return undefined;
};

Room.prototype.getBaseContainer = function getBaseContainer(): Container | undefined {
    let c = Game.getObjectById(this.memory["roomContainer"]);
    if (c instanceof StructureContainer) {
        return c;
    }
    return undefined;
};

Room.prototype.getBaseLink = function getBaseLink(): StructureLink | undefined {
    if (this.memory.b === undefined) {
        return undefined;
    }
    let pos = RoomPositionUtilities.longPos(this.memory.b, this.name);
    let structures = (new RoomPosition(pos.x, pos.y, pos.roomName)).lookFor(LOOK_STRUCTURES) as Structure[];
    for (let s of structures) {
        if (s.structureType === STRUCTURE_LINK) {
            return s as StructureLink;
        }
    }
    return undefined;
};

Room.prototype.hasLabArea = function hasLabArea(): boolean {
    if (this.memory.lab === undefined || this.memory.lab.operational === undefined) {
        return false;
    }
    return this.memory.lab.operational === true;
};
Room.prototype.getProcessingLabs = function getProcessingLabs(): Lab[] {
    let labs: Lab[] = [];
    if (this.memory.lab !== undefined && this.memory.lab.processingLabs !== undefined) {
        labs = _.map(this.memory.lab.processingLabs, (id: string) => {
            return Game.getObjectById(id) as Lab;
        });
    }

    let boostLab = this.getBoostLab();
    if (this.memory.boosting !== true && boostLab !== undefined) {
        labs.push(boostLab);
    }
    return labs;
};
Room.prototype.getSupplyingLabs = function getSupplyingLabs():  Lab[] {
    if (this.memory.lab === undefined || this.memory.lab.supplyingLabs === undefined) {
        return [];
    }
    return _.map(this.memory.lab.supplyingLabs, (id: string) => {
        return Game.getObjectById(id) as Lab;
    });
};

Room.prototype.isExpansion = function isExpansion(): boolean {
    return this.memory.isExpansion === true;
};

Room.prototype.hasExpansion = function hasExpansion(): boolean {
    return this.memory.expansion !== undefined;
};

Room.prototype.isAbandoned = function isAbandoned(): boolean {
    return this.memory.isBeingDismantled === true;
};

Room.prototype.isUnderSiege = function isUnderSiege(): boolean {
    return this.memory.defcon !== undefined && this.memory.defcon > 1;
};
