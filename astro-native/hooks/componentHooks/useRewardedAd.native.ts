// astro-native\hooks\componentHooks\useRewardedAd.native.ts
// το ονομα του αρχείου είναι σημαντικό. με .native .web διαλέγουμε ποιο αρχείο θα τρέξει σε πιο περιβάλλον.
// ΔΕΝ αλλάζεις imports import { useRewardedAd } from "../../hooks/componentHooks/useRewardedAd"; Expo automatically picks
import { useEffect, useRef, useState } from "react";
import Constants from "expo-constants";
import {
  AdEventType,
  RewardedAd,
  RewardedAdEventType,
  TestIds,
} from "react-native-google-mobile-ads";

// ελέγχουμε αν τρέχουμε σε Expo Go (εκεί ΔΕΝ δουλεύουν τα ads)
const isExpoGo = Constants.executionEnvironment === "storeClient";

// αν είμαστε σε dev → χρησιμοποιούμε test ad unit
// αλλιώς το πραγματικό σου
const adUnitId = __DEV__
  ? TestIds.REWARDED
  : "ca-app-pub-4041382605494077/3041229365";
  // : TestIds.REWARDED  // TODO για περισσοτερη ασφάλεια δεν έχουμε καθόλου το id και θα αλλαχθει αργότερα

export const useRewardedAd = () => {
  // κρατάμε reference στο ad instance (για να μην ξαναδημιουργείται κάθε render)
  const rewardedRef = useRef<RewardedAd | null>(null);

  // αν έχει φορτώσει το ad
  const [loaded, setLoaded] = useState(false);

  // αν ο user πήρε reward (trigger για LLM call)
  const [rewardEarned, setRewardEarned] = useState(false);

  useEffect(() => {
    // αν είμαστε σε Expo Go → fake flow (για development)
    if (isExpoGo) {
      setLoaded(true);
      return;
    }

    // δημιουργία rewarded ad instance
    const rewarded = RewardedAd.createForAdRequest(adUnitId, {
      // GDPR safe option (non-personalized ads)
      requestNonPersonalizedAdsOnly: true,
    });

    rewardedRef.current = rewarded;

    // όταν φορτώσει το ad
    const unsubscribeLoaded = rewarded.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        setLoaded(true);
      },
    );

    // όταν ο user πάρει reward (αυτό είναι το trigger)
    const unsubscribeReward = rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      () => {
        setRewardEarned(true);
      },
    );

    // όταν κλείσει το ad → κάνουμε preload το επόμενο
    const unsubscribeClosed = rewarded.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        setLoaded(false);
        rewarded.load();
        setRewardEarned(false);
      },
    );

    // αν υπάρξει error → ξαναδοκιμάζουμε preload
    const unsubscribeError = rewarded.addAdEventListener(
      AdEventType.ERROR,
      () => {
        setLoaded(false);
        rewarded.load();
      },
    );

    // αρχικό preload
    rewarded.load();

    // cleanup listeners
    return () => {
      unsubscribeLoaded();
      unsubscribeReward();
      unsubscribeClosed();
      unsubscribeError();
      rewardedRef.current = null;
    };
  }, []);

  const showAd = () => {
    // Expo Go → bypass (simulate reward)
    if (isExpoGo) {
      setRewardEarned(true);
      return;
    }

    // αν δεν είναι έτοιμο → δεν κάνουμε τίποτα
    if (!loaded || !rewardedRef.current) {
      return;
    }

    setLoaded(false);

    // δείχνουμε το ad
    rewardedRef.current.show();
  };

  return {
    loaded,             // αν υπάρχει έτοιμο ad
    rewardEarned,       // trigger για LLM call
    setRewardEarned,    // reset μετά το call
    showAd,             // function για να δείξεις ad
    isExpoGo,           // debug flag
  };
};