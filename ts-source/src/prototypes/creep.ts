/**
 * Extends the creep prototype
 */

import {traveler} from "../utilities/Traveler";

Creep.prototype.hasState = function hasState() {
    return this.memory.state !== undefined;
};

Creep.prototype.getState = function getState() {
    return this.memory.state;
};

Creep.prototype.setState = function setState(state: number) {
    this.memory.state = state;
};

Creep.prototype.getHomeroom = function getHomeroom(): string  {
    return this.memory.homeroom;
};

Creep.prototype.isInHomeroom = function isInHomeroom(): boolean  {
    return this.memory.homeroom === this.room.name;
};

Creep.prototype.isPrioritized = function isPrioritized(): boolean  {
    return this.memory.prioritized === true;
};

Creep.prototype.setPrioritized = function setPrioritized(): void  {
    this.memory.prioritized = true;
};

Creep.prototype.setNotPrioritized = function setNotPrioritized(): void  {
    this.memory.prioritized = false;
};

Creep.prototype.travelTo = function travelTo(destination: {pos: RoomPosition}, options?: any, enemyCheck?: boolean) {
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

Creep.prototype.travelToRoom = function travelToRoom(roomName: string, options?: any, enemyCheck?: boolean) {
    if (options) {
        options.range = 20;
    } else {
        options = {range: 20};
    }
    return this.travelTo({pos: new RoomPosition(25, 25, roomName)}, options, enemyCheck);
};

Creep.prototype.missingHits = function missingHits(): number {
  return this.hitsMax - this.hits;
};

Creep.prototype.isHurt = function isHurt(): boolean {
  return this.hits < this.hitsMax;
};

Creep.prototype.isRenewing = function isRenewing(): boolean {
  return this.memory.renewing === true;
};

Creep.prototype.startRenewing = function startRenewing(): void {
  this.memory.renewing = true;
};

Creep.prototype.stopRenewing = function stopRenewing(): void {
  this.memory.renewing = false;
};

Creep.prototype.isEmpty = function isEmpty(): boolean {
  return this.carry.energy === 0;
};

Creep.prototype.isFull = function isFull(): boolean {
  return _.sum(this.carry) === this.carryCapacity;
};

Creep.prototype.isDumping = function isDumping(): boolean {
  return this.memory.dumping === true;
};

Creep.prototype.isFinishedDumping = function isFinishedDumping(): boolean {
  return this.isDumping() && this.isEmpty();
};

Creep.prototype.isFinishedMining = function isFinishedMining(): boolean {
  return !this.isDumping() && this.isFull();
};

Creep.prototype.startDumping = function startDumping(): void {
  this.memory.dumping = true;
};

Creep.prototype.stopDumping = function stopDumping(): void {
  this.memory.dumping = false;
};

Creep.prototype.isTanking = function isTanking(): boolean {
  return this.memory.tanking === true;
};

Creep.prototype.isFinishedTanking = function isFinishedTanking(): boolean {
  return this.isTanking() && this.isFull();
};

Creep.prototype.isInNeedOfTanking = function isInNeedOfTanking(): boolean {
  return !this.isTanking() && this.isEmpty();
};

Creep.prototype.startTanking = function startTanking(): void {
  this.memory.tanking = true;
};

Creep.prototype.stopTanking = function stopTanking(): void {
  this.memory.tanking = false;
};

Creep.prototype.getWorkerParts = function getWorkerParts(): number {
  return this.getActiveBodyparts(WORK);
};

Creep.prototype.isDisabled = function isDisabled(): boolean {
  return this.memory.disabled;
};

Creep.prototype.disable = function disable(): void {
  this.memory.disabled = true;
};

Creep.prototype.enable = function enable(): void {
  this.memory.disabled = undefined;
};

Creep.prototype.isAtBorder = function isAtBorder(): boolean {
  return this.pos.x === 0 || this.pos.x === 49 || this.pos.y === 0 || this.pos.y === 49;
};
