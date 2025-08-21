export interface OptionSupplement {
    id: string;
    name: string;
    price: number;
    image?: string;
}
export interface Accompagnements {
    id: string;
    name: string;
    price: number;
    image?: string;
}
export interface OptionExtra {
    id: string;
    name: string;
    price: number;
    image?: string;
}

// Interface pour les données des étapes
export interface StepDataItem {
    id: string;
    name: string;
    price: number;
    image?: string;
    description?: string;
}

export interface Category {
    id: string;
    name: string;
    image?: string;
    description: string;
    steps?: {
        [key: string]: {
            type: "supplements" | "extra" | "accompagnements" | "boissons";
            data: StepDataItem[];
            title: string;
        };
    };
    accompaniments?: Array<{
        id: string;
        image: string;
        alt: string;
        hasPlus?: boolean;
    }>;
}
export interface StepData {
    type: "supplements" | "extra" | "accompagnements" | "boissons";
    data: StepDataItem[];
    title: string;
}

export interface MainPageCommand {
    id: string;
    title: string;
    description: string;
    clientId: string;
    image?: string;
    price?: number;
    supplements?: OptionSupplement[];
    category?: string;
    steps?: {
        [key: string]: StepData;
    };
}