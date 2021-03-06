import * as _Common from "../rolelib/common";

export function run(creep: Creep) {
    if (creep.memory.targetRoom === undefined) {
        let mineral = Game.getObjectById(creep.memory.target) as Mineral;
        if (mineral !== null) {
            creep.memory.targetRoom = mineral.room.name;
        }
    }

    if (_Common.stayAwayFromSourceKeeper(creep, 20, 6)) {
        return;
    }

    if (Game.time % 2 === 0) {
        let mineral = Game.getObjectById(creep.memory.target);
        if (!(mineral instanceof Mineral)) {
            _Common.moveOffRoad(creep);
            return;
        }
        if (creep.pos.getRangeTo(mineral.pos) > 1) {
            creep.moveTo(mineral);
        }
    }

    // Only harvest every 6. tick
    if (Game.time % 6 === 0) {
        let mineral = Game.getObjectById(creep.memory.target);
        if (!(mineral instanceof Mineral)) {
            _Common.moveOffRoad(creep);
            return;
        }
        if (mineral instanceof Mineral && (mineral.mineralAmount === 0 || mineral.mineralAmount === undefined)) {
            creep.suicide();
        }
        if (creep.carryCapacity > _.sum(creep.carry)) {
            let response = creep.harvest(mineral);
            if (response === OK) {
                if (Memory.stats["mineralmined." + mineral.mineralType] === undefined) {
                    Memory.stats["mineralmined." + mineral.mineralType] = 0;
                }
                Memory.stats["mineralmined." + mineral.mineralType] += creep.getActiveBodyparts(WORK);
            }
        }
    }
    if (Game.time % 6 === 1 || creep.ticksToLive < 3) {
        if (creep.memory.container === undefined) {
            setMyContainer(creep);
            if (creep.memory.container === undefined) {
                return;
            }
        }

        if (creep.memory.mineralType === undefined) {
            setMyMineralType(creep);
            if (creep.memory.mineralType === undefined) {
                return;
            }
        }

        let container = Game.getObjectById(creep.memory.container) as Container;
        if (container === null) {
            creep.memory.container = undefined;
            return;
        }
        if (creep.pos.getRangeTo(container) > 0) {
            creep.moveTo(container);
        }

        creep.transfer(container, creep.memory.mineralType);
    }
}

function setMyMineralType(creep: Creep) {
    let mineral = Game.getObjectById(creep.memory.target) as Mineral;
    if (!(mineral instanceof Mineral)) {
        return;
    }
    creep.memory.mineralType = mineral.mineralType;
}

function setMyContainer(creep: Creep) {
    let mineral = Game.getObjectById(creep.memory.target) as Mineral;
    if (!(mineral instanceof Mineral)) {
        return;
    }
    let container = mineral.getMiningContainer();
    if (!(container instanceof StructureContainer)) {
        // console.log("MineralMiner without container! " + creep.name + " " + creep.room.name);
        return;
    }
    creep.memory.container = container.id;
}
