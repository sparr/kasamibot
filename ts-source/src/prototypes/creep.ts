/**
 * Extends the creep prototype
 */

import {traveler} from "../utilities/Traveler";

Creep.prototype.hasState = () => {
    return this.memory.state !== undefined;
};

Creep.prototype.getState = () => {
    return this.memory.state;
};

Creep.prototype.setState = (state: number) => {
    this.memory.state = state;
};

Creep.prototype.getHomeroom = (): string  => {
    return this.memory.homeroom;
};

Creep.prototype.isInHomeroom = (): boolean  => {
    return this.memory.homeroom === this.room.name;
};

Creep.prototype.isPrioritized = (): boolean  => {
    return this.memory.prioritized === true;
};

Creep.prototype.setPrioritized = (): void  => {
    this.memory.prioritized = true;
};

Creep.prototype.setNotPrioritized = (): void  => {
    this.memory.prioritized = false;
};

Creep.prototype.travelTo = (destination: {pos: RoomPosition}, options?: any, enemyCheck?: boolean) => {
    if (options) {
        if (options.allowHostile !== false) {
            options.allowHostile = true;
        }
        if (options.maxOps === undefined) {
            options.maxOps = 10000;
        }
    } else {
        options = {allowHostile: true, maxOps: 10000};
    }
    return traveler.travelTo(this, destination, options, enemyCheck);
};

Creep.prototype.travelToRoom = (roomName: string, options?: any, enemyCheck?: boolean) => {
    if (options) {
        options.range = 20;
    } else {
        options = {range: 20};
    }
    return this.travelTo({pos: new RoomPosition(25, 25, roomName)}, options, enemyCheck);
};

Creep.prototype.missingHits = (): number => {
  return this.hitsMax - this.hits;
};

Creep.prototype.isHurt = (): boolean => {
  return this.hits < this.hitsMax;
};

Creep.prototype.isRenewing = (): boolean => {
  return this.memory.renewing === true;
};

Creep.prototype.startRenewing = (): void => {
  this.memory.renewing = true;
};

Creep.prototype.stopRenewing = (): void => {
  this.memory.renewing = false;
};

Creep.prototype.isEmpty = (): boolean => {
  return this.carry.energy === 0;
};

Creep.prototype.isFull = (): boolean => {
  return _.sum(this.carry) === this.carryCapacity;
};

Creep.prototype.isDumping = (): boolean => {
  return this.memory.dumping === true;
};

Creep.prototype.isFinishedDumping = (): boolean => {
  return this.isDumping() && this.isEmpty();
};

Creep.prototype.isFinishedMining = (): boolean => {
  return !this.isDumping() && this.isFull();
};

Creep.prototype.startDumping = (): void => {
  this.memory.dumping = true;
};

Creep.prototype.stopDumping = (): void => {
  this.memory.dumping = false;
};

Creep.prototype.isTanking = (): boolean => {
  return this.memory.tanking === true;
};

Creep.prototype.isFinishedTanking = (): boolean => {
  return this.isTanking() && this.isFull();
};

Creep.prototype.isInNeedOfTanking = (): boolean => {
  return !this.isTanking() && this.isEmpty();
};

Creep.prototype.startTanking = (): void => {
  this.memory.tanking = true;
};

Creep.prototype.stopTanking = (): void => {
  this.memory.tanking = false;
};

Creep.prototype.getWorkerParts = (): number => {
  return this.getActiveBodyparts(WORK);
};

Creep.prototype.isDisabled = (): boolean => {
  return this.memory.disabled;
};

Creep.prototype.disable = (): void => {
  this.memory.disabled = true;
};

Creep.prototype.enable = (): void => {
  this.memory.disabled = undefined;
};

Creep.prototype.isAtBorder = (): boolean => {
  return this.pos.x === 0 || this.pos.x === 49 || this.pos.y === 0 || this.pos.y === 49;
};
