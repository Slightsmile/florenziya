import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { initMetaPixel, trackPageView } from "../lib/metaPixel";

export default function MetaPixelTracker() {
  const location = useLocation();
  const isFirst = useRef(true);

  useEffect(() => {
    initMetaPixel();
  }, []);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    trackPageView();
  }, [location.pathname]);

  return null;
}
