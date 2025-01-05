/**
 * @file NinjaNode Pixi.js Render Library: PixiPnbits
 *   Tracking render object class for celestial bodies and stationary things.
 */

const { Container, Sprite, Texture } = window.PIXI;

// new PixiPnbits({
//   pos: {x:50, y:50},
//   major: 'a',
//   minor: 'b',
// })

export class PixiPnbits {
  constructor({ app, pos, major, minor, parent, radius }) {
    const pnbits = new Sprite(Texture.from('planet-a'));
    pnbits.width = radius;
    pnbits.height = radius;
    pnbits.updateTransform(pos);
    parent.addChild(pnbits);
  }
}
