/**
 * @file NinjaNode Pixi.js Render Library: PixiProjectile
 *   Tracking render object class for all ninjanode projectile types.
 */

import { projectileTypes } from 'data';

const {
    Sprite,
    Container,
    Texture,
    filters: { GlowFilter },
} = window.PIXI;


const degToRad = (degrees) => degrees * (Math.PI / 180);

export class PixiProjectile {
  app;
  container;
  started;
  style;
  type;
  pos = { x: 0, y: 0, d: 0 };
  velocity = { x: 0, y: 0 };
  config = {};
  ticker;

  constructor({ app, style, type, parent, pos = {} }) {
      this.config = projectileTypes[type];
      this.app = app;
      this.type = type;
      this.style = style;
      this.started = Date.now();
      this.container = new Container();
      parent.addChild(this.container);

      // Create the sprite using pre-loaded texture
      const textureAlias = `laser-${this.style}`;
      const texture = Texture.from(textureAlias);
      const sprite = new Sprite(texture);

      // Set anchor to center for rotation.
      sprite.anchor.set(0.5);

        // Scale the sprite by the type.
      const { width, height } = this.config.size;
        sprite.width = width;
        sprite.height = height;

      this.container.addChild(sprite);

      this.container.filters = [
          new GlowFilter({ distance: 10, outerStrength: 5 }),
        ];

      this.setPos(pos);

      // Velocity is locked at init.
      this.velocity = {
        x: (this.config.speed / 1000) * Math.cos(degToRad(this.pos.d - 90)),
        y: (this.config.speed / 1000) * Math.sin(degToRad(this.pos.d - 90)),
      };

      this.initTicker();
    }

    initTicker() {
      this.ticker = () => {
        this.tickerCallback();
      };

      this.app.ticker.add(this.ticker);
    }

    tickerCallback() {
      const deltaMs = this.app.ticker.deltaMS;
        // Glide between vector velocity length updates.
      if (this.container && !this.container.destroyed) {
        this.container.updateTransform({
          x: this.container.x + this.velocity.x * deltaMs,
          y: this.container.y + this.velocity.y * deltaMs,
        });
      }
    }

    destroy() {
      // TODO: Anything else to clean up?
      this.app.ticker.remove(this.ticker);
      this.container.destroy();
    }

    setPos({ x = 0, y = 0, d = 0 } = {}) {
      if (!this.container) return;
      this.pos.x = x;
      this.pos.y = y;
      this.pos.d = d;

      this.container.updateTransform({ x, y });
      this.container.rotation = degToRad(d);
    }

    setActive(state) {
      this.active = !!state;
    }

    activate() {
      this.setActive(true);
    }

    deactivate() {
      this.setActive(false);
    }
  }