import StatMap from "../interfaces/statMap";

type Equippable = {
    id: string;
    name: string;
    stats?: StatMap;
    total?: number;
};

export default Equippable;
