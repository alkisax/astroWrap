// astro-native\hooks\componentHooks\useRewardedAd.web.ts

/**
 * WEB VERSION
 * Fake implementation για να μην σπάει το UI
 */

import { useState } from "react";

export const useRewardedAd = () => {
  const [rewardEarned, setRewardEarned] = useState(false);

  const showAd = () => {
    console.log("Web: simulate ad");
    setRewardEarned(true); // 🔥 trigger flow
  };

  return {
    loaded: true,
    rewardEarned,
    setRewardEarned,
    showAd,
    isExpoGo: true,
  };
};