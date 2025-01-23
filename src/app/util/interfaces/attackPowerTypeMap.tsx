/**
 * Maps attack power types (e.g. physical, magic, fire, etc.) to their respective values
 */
export default interface AttackPowerTypeMap<T> {
    [key: string]: T | undefined;
    physical: T;
    magic: T;
    fire: T;
    lightning: T;
    holy: T;
    bleed?: T;
    poison?: T;
    frost?: T;
    "scarlet-rot"?: T;
    madness?: T;
    sleep?: T;
}
