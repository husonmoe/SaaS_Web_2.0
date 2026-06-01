/** 用户手册 · Figma node 407:170318 */

export type UserManualCategoryId =
  | "system"
  | "payment"
  | "micro-clinic"
  | "traceability"
  | "insurance"
  | "health-commission"
  | "faq";

export type UserManualCategory = {
  id: UserManualCategoryId;
  label: string;
};

export type UserManualTopicId =
  | "install-and-login"
  | "menu-settings"
  | "consultation-menu"
  | "inventory"
  | "appointment"
  | "billing-menu"
  | "marketing-menu"
  | "statistics-menu";

export type UserManualTopic = {
  id: UserManualTopicId;
  label: string;
  categoryId: UserManualCategoryId;
};

export type UserManualContentBlock =
  | { type: "text"; text: string }
  | { type: "link"; href: string; external?: boolean }
  | {
      type: "image";
      src: string;
      width: number;
      height: number;
      alt?: string;
    };

export type UserManualSection = {
  id: string;
  heading: string;
  blocks: UserManualContentBlock[];
};

export type UserManualArticle = {
  topicId: UserManualTopicId;
  title: string;
  intro: string;
  terminals: string;
  sections: UserManualSection[];
};

export const USER_MANUAL_HERO = {
  title: "用户手册",
  subtitle:
    "为您提供光谱云诊全模块使用指南，解答您在系统安装、日常业务操作中的所有疑问",
} as const;

export const USER_MANUAL_CATEGORIES: UserManualCategory[] = [
  { id: "system", label: "系统操作手册" },
  { id: "payment", label: "聚合支付-拉卡拉" },
  { id: "micro-clinic", label: "微诊所（专业版）" },
  { id: "traceability", label: "码上放心" },
  { id: "insurance", label: "医保" },
  { id: "health-commission", label: "卫健" },
  { id: "faq", label: "常见问题" },
];

export const USER_MANUAL_TOPICS: UserManualTopic[] = [
  { id: "install-and-login", label: "安装和登录", categoryId: "system" },
  { id: "menu-settings", label: "管理菜单设置", categoryId: "system" },
  { id: "consultation-menu", label: "问诊菜单", categoryId: "system" },
  { id: "inventory", label: "库存管理", categoryId: "system" },
  { id: "appointment", label: "预约挂号", categoryId: "system" },
  { id: "billing-menu", label: "收费菜单", categoryId: "system" },
  { id: "marketing-menu", label: "营销菜单", categoryId: "system" },
  { id: "statistics-menu", label: "统计菜单", categoryId: "system" },
];

const CLIENT_DOWNLOAD_URL =
  "https://com-cms-pub.guangpuyun.cn/cms-clinic-electron/dist/production/guangpuyunzhen-setup.exe";

const WEB_PORTAL_URL = "https://zs.guangpuyun.cn";

export const USER_MANUAL_ARTICLES: Record<
  UserManualTopicId,
  UserManualArticle | undefined
> = {
  "install-and-login": {
    topicId: "install-and-login",
    title: "光谱云诊安装和登录",
    intro:
      "本章节将指引您完成光谱云诊客户端的下载、环境配置与首次登录，开启智能诊疗第一步。",
    terminals:
      "适用终端： Windows 桌面客户端（支持 Win10 及以上系统） / 医疗机构管理端",
    sections: [
      {
        id: "windows-install",
        heading: "1、Windows系统如何下载、安装客户端",
        blocks: [
          { type: "text", text: "客户端下载链接：" },
          { type: "link", href: CLIENT_DOWNLOAD_URL, external: true },
          {
            type: "text",
            text: "如果是在手机上查看该文档可以在电脑上登录微信，然后复制客户端下载链接发送到微信聊天，这样就可以在电脑微信上复制下载链接了",
          },
          {
            type: "image",
            src: "/assets/user-manual/step-download.png",
            width: 600,
            height: 338,
            alt: "客户端下载页面示意",
          },
          {
            type: "text",
            text: "点击下一步，然后点安装，稍作等待后即可完成安装",
          },
          {
            type: "image",
            src: "/assets/user-manual/step-install-1.png",
            width: 600,
            height: 433,
            alt: "安装向导步骤一",
          },
          {
            type: "image",
            src: "/assets/user-manual/step-install-2.png",
            width: 600,
            height: 433,
            alt: "安装向导步骤二",
          },
          {
            type: "image",
            src: "/assets/user-manual/step-install-3.png",
            width: 600,
            height: 433,
            alt: "安装向导步骤三",
          },
          {
            type: "text",
            text: "点击完成，光谱云诊系统客户端就成功安装到您的桌面上了",
          },
          {
            type: "image",
            src: "/assets/user-manual/step-install-4.png",
            width: 600,
            height: 433,
            alt: "安装完成",
          },
        ],
      },
      {
        id: "mac-usage",
        heading: "2、苹果系统如何使用",
        blocks: [
          { type: "text", text: "苹果系统建议通过谷歌浏览器访问使用" },
          { type: "text", text: "系统官网：" },
          { type: "link", href: WEB_PORTAL_URL, external: true },
          {
            type: "image",
            src: "/assets/user-manual/step-mac-web.png",
            width: 600,
            height: 338,
            alt: "网页端登录示意",
          },
        ],
      },
      {
        id: "login",
        heading: "3、如何登录",
        blocks: [
          {
            type: "text",
            text: "点击登录诊所，系统有三种登录方式，账号是开通系统的手机号，可以使用手机号加短信验证码登录，系统没有默认密码，点忘记密码可以设置登录密码，登录后会出现提示是否绑定微信，绑定微信后可以通过微信扫码登录",
          },
          {
            type: "image",
            src: "/assets/user-manual/step-login.png",
            width: 600,
            height: 338,
            alt: "登录界面示意",
          },
        ],
      },
    ],
  },
  "menu-settings": undefined,
  "consultation-menu": undefined,
  "inventory": undefined,
  "appointment": undefined,
  "billing-menu": undefined,
  "marketing-menu": undefined,
  "statistics-menu": undefined,
};

export const USER_MANUAL_DEFAULT_CATEGORY: UserManualCategoryId = "system";
export const USER_MANUAL_DEFAULT_TOPIC: UserManualTopicId = "install-and-login";
