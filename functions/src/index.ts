import { onDocumentCreated } from "firebase-functions/v2/firestore";

import { logger } from "firebase-functions";


import * as o from "obscenity";

const matcher = new o.RegExpMatcher({
  ...o.englishDataset.build(),
  ...o.englishRecommendedTransformers,
});
const censor = new o.TextCensor().setStrategy(
  o.keepStartCensorStrategy(o.asteriskCensorStrategy()
  ));


// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const censorMessage = onDocumentCreated({
  document: "messages/{docId}",
  region: "australia-southeast1",
}, (event) => {
  const snapshot = event.data;
  if (!snapshot) {
    console.log("No data associated with the event");
    return;
  }

  const data = snapshot.data();
  const text = censorText(data.text);
  logger.log("censoring", event.params.docId, text);
  return snapshot.ref.set({ text: text }, { merge: true });
});

const censorText = (message: string) => {
  const matches = matcher.getAllMatches(message);
  const censored = censor.applyTo(message, matches);
  return censored;
};
