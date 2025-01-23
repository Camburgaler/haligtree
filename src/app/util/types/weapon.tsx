import InfusionMap from "../interfaces/infusionMap";
import StatMap from "../interfaces/statMap";
import Equippable from "./equippable";
import WeaponInfusion from "./weaponInfusion";

type Weapon = Equippable & {
    requirements: StatMap<number>;
    category: string;
    unique: boolean;
    paired: boolean;
    "glintstone-staff": boolean;
    "sacred-seal": boolean;
    infusions: InfusionMap<WeaponInfusion>;
};

export default Weapon;
