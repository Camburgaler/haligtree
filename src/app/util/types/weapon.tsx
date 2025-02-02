import InfusionMap from "../interfaces/infusionMap";
import StatMap from "../interfaces/statMap";
import Equippable from "./equippable";
import WeaponInfusion from "./weaponInfusion";

interface Aux {
    [key: string]: { effect: [number, number] };
}

type Weapon = Equippable & {
    requirements: StatMap<number>;
    category: string;
    paired: boolean;
    "glintstone-staff": boolean;
    "sacred-seal": boolean;
    infusions: InfusionMap<WeaponInfusion>;
};

export default Weapon;
