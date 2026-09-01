import { semiSplit } from '../../shared/src/utils/textHandling.ts';
import { sheetsKey } from './env.ts';

export const fetchUsernameMappings = async () => {
  const requestedData = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/1wJe12B_YuZgBYts7xM6euMKNB7UlBDMJlT5ve7WP1_s/values/Username+Mappings?alt=json&key=${sheetsKey}`
  );
  const asJson = (await requestedData.json()) as any;

  const [_keys, ...rest] = asJson.values as string[][];

  const mappings: Record<string, string> = {};
  rest.forEach(entry => {
    semiSplit(entry[1]).forEach(alt => {
      mappings[alt] = entry[0];
    });
  });
  return mappings;
};
