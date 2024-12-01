import { useEffect } from "react";

const GlobalShare = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://platform-api.sharethis.com/js/sharethis.js#property=674c78de27271500125f1601&product=inline-share-buttons&source=platform";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <div className="sharethis-inline-share-buttons"></div>;
};

export default GlobalShare;
