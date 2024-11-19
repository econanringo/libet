"use client";

import { useEffect } from "react";

interface DisqusProps {
  shortname: string;
  identifier: string;
  title: string;
  url: string;
}

const Disqus = ({ shortname, identifier, title, url }: DisqusProps) => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const disqusScriptId = "disqus-script";

      if (!document.getElementById(disqusScriptId)) {
        const script = document.createElement("script");
        script.id = disqusScriptId;
        script.src = `https://slalibet2.disqus.com/embed.js`;
        script.setAttribute("data-timestamp", `${+new Date()}`);
        script.async = true;
        document.body.appendChild(script);
      } else if ((window as any).DISQUS) {
        (window as any).DISQUS.reset({
          reload: true,
          config: function () {
            this.page.identifier = identifier;
            this.page.url = url;
            this.page.title = title;
          },
        });
      }
    }
  }, [shortname, identifier, title, url]);

  return <div id="disqus_thread"></div>;
};

export default Disqus;
