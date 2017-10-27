export function shortPos(roomPos: RoomPosition): string {
    return String.fromCharCode(roomPos.y * 50 + roomPos.x + 1);
};

export function shortPosRoom(roomPos: RoomPosition): string {
    return String.fromCharCode(roomPos.y * 50 + roomPos.x + 1) + roomPos.roomName;
};

export function shortPosMaker(x: number, y: number): string {
    return String.fromCharCode(y * 50 + x + 1);
};

export function shortPosRoomMaker(x: number, y: number, roomName: string): string {
    return String.fromCharCode(y * 50 + x + 1) + roomName;
};

export function longPosRoom(shortPosRoom: string): RoomPosition {
    const coord = shortPosRoom.charCodeAt(0) - 1;
    return new RoomPosition(coord % 50, Math.floor(coord / 50), shortPosRoom.slice(1));
};

export function longPos(shortPos: string, roomName: string): RoomPosition {
    const coord = shortPos.charCodeAt(0) - 1;
    return new RoomPosition(coord % 50, Math.floor(coord / 50), roomName);
};

export function xyPos(shortPos: string): {x: number, y: number} {
    const xyPos: {x: number, y: number} = {x: 0, y: 0};
    const coord = shortPos.charCodeAt(0) - 1;
    xyPos.y = Math.floor(coord / 50);
    xyPos.x = coord % 50;
    return xyPos;
};
