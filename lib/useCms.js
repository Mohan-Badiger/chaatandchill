"use client";

import { useState, useEffect } from "react";
import { INITIAL_CMS_CONTENT } from "@/lib/admin/seedData";

let cachedCms = null;
const listeners = new Set();

function broadcastCms(newCms) {
  cachedCms = newCms;
  listeners.forEach((listener) => listener(newCms));
}

export function useCms() {
  const [cmsContent, setCmsContent] = useState(cachedCms || INITIAL_CMS_CONTENT);
  const [loading, setLoading] = useState(!cachedCms);

  useEffect(() => {
    const listener = (newCms) => setCmsContent(newCms);
    listeners.add(listener);

    // Fetch fresh CMS data from server
    let isMounted = true;
    fetch("/api/content")
      .then((res) => res.json())
      .then((json) => {
        if (isMounted && json.success && json.cmsContent) {
          broadcastCms(json.cmsContent);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.warn("[useCms] Failed to fetch live content, using cached/seed content:", err.message);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
      listeners.delete(listener);
    };
  }, []);

  return { cmsContent, loading };
}
