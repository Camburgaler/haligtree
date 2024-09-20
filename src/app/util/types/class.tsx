import StatMap from "../interfaces/statMap";

type Class = {
    id: string;
    name: string;
    level: number;
    stats: StatMap;
    total?: number;
};

export default Class;
