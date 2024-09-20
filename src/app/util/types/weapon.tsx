import InfusionMap from "../interfaces/infusionMap";
import StatMap from "../interfaces/statMap";
import Equippable from "./equippable";
import WeaponInfusion from "./weaponInfusion";

interface Aux {
    [key: string]: { effect: [number, number] };
}

type Weapon = Equippable & {
    requirements: StatMap;
    category: string;
    unique: boolean;
    infusions: InfusionMap<WeaponInfusion>;
    aux?: Aux;
};

export default Weapon;
