import React from "react";
import { DocsThemeConfig } from "nextra-theme-docs";
import { Camera } from "lucide-react";
// import "./styles.css";

const config: DocsThemeConfig = {
  logo: () => {
    return <Camera />;
  },
  project: {
    link: "https://github.com/shuding/nextra-docs-template",
  },
  chat: {
    link: "https://discord.com",
  },
  docsRepositoryBase: "https://github.com/shuding/nextra-docs-template",
  footer: {
    text: () => {
      return (
        <div className="flex items-center justify-between">
          <p className="text-red-500 text-3xl">
            © {new Date().getFullYear()} Shu Ding
          </p>

          <p>Hello</p>
        </div>
      );
    },
  },
};

export default config;
