import { TbBeach, TbMountain, TbPool } from "react-icons/tb";
import {
    GiBarn,
    GiBoatFishing,
    GiCastle,
    GiForestCamp,
    GiWindmill,
} from "react-icons/gi";
import {
    FaSkiing,
    FaPumpSoap,
    FaShower,
    FaFireExtinguisher,
    FaUmbrellaBeach,
    FaKey,
    FaSwimmingPool,
} from "react-icons/fa";
import { FaHouseUser, FaPeopleRoof, FaKitchenSet } from "react-icons/fa6";
import {
    BiSolidWasher,
    BiSolidDryer,
    BiSolidFirstAid,
    BiWifi,
    BiSolidFridge,
    BiWorld,
} from "react-icons/bi";
import { BsSnow, BsFillDoorOpenFill, BsPersonWorkspace } from "react-icons/bs";
import { IoDiamond } from "react-icons/io5";
import { MdOutlineVilla, MdMicrowave, MdBalcony, MdYard, MdPets } from "react-icons/md";
import {
    PiBathtubFill,
    PiCoatHangerFill,
    PiTelevisionFill,
} from "react-icons/pi";
import { TbIroning3 } from "react-icons/tb";
import {
    GiHeatHaze,
    GiCctvCamera,
    GiBarbecue,
    GiToaster,
    GiCampfire,
} from "react-icons/gi";
import { AiFillCar } from "react-icons/ai";

export const categories = [
    {
        label: "Toate",
        icon: <BiWorld />,
    },
    {
        img: "assets/beach_cat.jpg",
        label: "La malul mării",
        icon: <TbBeach />,
        description: "This property is close to the beach!",
    },
    {
        img: "assets/windmill_cat.webp",
        label: "Moară de vânt",
        icon: <GiWindmill />,
        description: "This property is has windmills!",
    },
    {
        img: "assets/modern_cat.webp",
        label: "Orașe populare",
        icon: <MdOutlineVilla />,
        description: "This property is modern!",
    },
    {
        img: "assets/countryside_cat.webp",
        label: "La munte",
        icon: <TbMountain />,
        description: "This property is in the countryside!",
    },
    {
        img: "assets/pool_cat.jpg",
        label: "Piscine uimitoare",
        icon: <TbPool />,
        description: "This is property has a beautiful pool!",
    },

    {
        img: "assets/lake_cat.webp",
        label: "Lângă lac",
        icon: <GiBoatFishing />,
        description: "This property is near a lake!",
    },
    {
        img: "assets/skiing_cat.jpg",
        label: "Ski",
        icon: <FaSkiing />,
        description: "This property has skiing activies!",
    },
    {
        img: "assets/castle_cat.webp",
        label: "Castele",
        icon: <GiCastle />,
        description: "This property is an ancient castle!",
    },
    {
        img: "assets/camping_cat.jpg",
        label: "Camping",
        icon: <GiForestCamp />,
        description: "This property offers camping activities!",
    },

    {
        img: "assets/barn_cat.jpg",
        label: "Rustic",
        icon: <GiBarn />,
        description: "This property is in a barn!",
    },
    {
        img: "assets/lux_cat.jpg",
        label: "De lux",
        icon: <IoDiamond />,
        description: "This property is brand new and luxurious!",
    },
];

export const types = [
    {
        name: "Întreaga casă",
        description: "Oaspeții au întregul spațiu la dispoziție.",
        icon: <FaHouseUser />,
    },
    {
        name: "Camere proprii",
        description:
            "Oaspeții au propria lor cameră într-o casă, plus acces la spații comune.",
        icon: <BsFillDoorOpenFill />,
    },
    {
        name: "Camere comune",
        description:
            "Oaspeții dorm într-o cameră sau zonă comună care poate fi împărtășită cu tine sau cu alții.",
        icon: <FaPeopleRoof />,
    },
];

export const facilities = [
    {
        name: "Cadă de baie",
        icon: <PiBathtubFill />,
    },
    {
        name: "Produse de îngrijire personală",
        icon: <FaPumpSoap />,
    },
    {
        name: "Duș în aer liber",
        icon: <FaShower />,
    },
    {
        name: "Mașină de spălat",
        icon: <BiSolidWasher />,
    },
    {
        name: "Uscător de rufe",
        icon: <BiSolidDryer />,
    },
    {
        name: "Umerașe",
        icon: <PiCoatHangerFill />,
    },
    {
        name: "Fier de călcat",
        icon: <TbIroning3 />,
    },
    {
        name: "Televizor",
        icon: <PiTelevisionFill />,
    },
    {
        name: "Spațiu de lucru dedicat",
        icon: <BsPersonWorkspace />
    },
    {
        name: "Aer condiționat",
        icon: <BsSnow />,
    },
    {
        name: "Încălzire",
        icon: <GiHeatHaze />,
    },
    {
        name: "Camere de securitate",
        icon: <GiCctvCamera />,
    },
    {
        name: "Extinctor",
        icon: <FaFireExtinguisher />,
    },
    {
        name: "Trusă de prim ajutor",
        icon: <BiSolidFirstAid />,
    },
    {
        name: "Wifi",
        icon: <BiWifi />,
    },
    {
        name: "Set de gătit",
        icon: <FaKitchenSet />,
    },
    {
        name: "Frigider",
        icon: <BiSolidFridge />,
    },
    {
        name: "Cuptor cu microunde",
        icon: <MdMicrowave />,
    },
    {
        name: "Aragaz",
        icon: <GiToaster />,
    },
    {
        name: "Grătar",
        icon: <GiBarbecue />,
    },
    {
        name: "Zonă de luat masa în aer liber",
        icon: <FaUmbrellaBeach />,
    },
    {
        name: "Patio sau balcon privat",
        icon: <MdBalcony />,
    },
    {
        name: "Foc de tabără",
        icon: <GiCampfire />,
    },
    {
        name: "Grădină",
        icon: <MdYard />,
    },
    {
        name: "Parcare gratuită",
        icon: <AiFillCar />,
    },
    {
        name: "Check-in automat",
        icon: <FaKey />
    },
    {
        name: "Animale de companie permise",
        icon: <MdPets />
    },
    {
        name: "Piscină",
        icon: <FaSwimmingPool />
    }
];
