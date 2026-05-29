export type ValueServiceItem = {
  id: string;
  title: string;
  imageSrc: string;
  width: number;
  height: number;
};

export const VALUE_SERVICE_ITEMS: Record<string, ValueServiceItem> = {
  yibao: {
    id: "yibao",
    title: "医保对接",
    imageSrc: "/assets/image_value_services/image_value_services_医保对接.png",
    width: 1764,
    height: 2040,
  },
  ai: {
    id: "ai",
    title: "AI 语音/诊断/审方",
    imageSrc: "/assets/image_value_services/image_value_services_AI.png",
    width: 1764,
    height: 1320,
  },
  mashang: {
    id: "mashang",
    title: "码上放心",
    imageSrc: "/assets/image_value_services/image_value_services_码上放心.png",
    width: 1764,
    height: 1320,
  },
  weizhensuo: {
    id: "weizhensuo",
    title: "微诊所",
    imageSrc: "/assets/image_value_services/image_value_services_微诊所.png",
    width: 1764,
    height: 2040,
  },
};

/** 左列：高 + 矮；右列：矮 + 高 */
export const VALUE_SERVICE_COLUMNS: ValueServiceItem[][] = [
  [VALUE_SERVICE_ITEMS.yibao, VALUE_SERVICE_ITEMS.mashang],
  [VALUE_SERVICE_ITEMS.ai, VALUE_SERVICE_ITEMS.weizhensuo],
];
