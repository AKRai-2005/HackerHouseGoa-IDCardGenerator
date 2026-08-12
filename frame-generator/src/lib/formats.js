import { drawPass, PASS_W, PASS_H } from './drawPass';
import { drawCard, CARD_W, CARD_H } from './drawCard';

export const FORMATS = {
  pass: { label: 'BOARDING PASS', w: PASS_W, h: PASS_H, draw: drawPass },
  card: { label: 'ID CARD', w: CARD_W, h: CARD_H, draw: drawCard },
};

export const DEFAULT_FORMAT = 'pass';
