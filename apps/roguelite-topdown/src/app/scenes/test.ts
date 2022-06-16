// import './index.css';
import {
  Lulu,
  SpriteComponent,
  TransformComponent,
  Entity,
  parseTexturePackerFrames,
  Animation,
} from '@lulu/engine';

import IdleRedSrc from '../../assets/Red/Red.png';
import * as IdleRedJson from '../../assets/Red/Red.json';
import { PlayerMover } from '../components/player-mover';

const canvas: HTMLCanvasElement = document.createElement('canvas');
document.body.append(canvas);
const engine = new Lulu(canvas, {});


const scene = new Entity('TestNode');
const sceneTrans = new TransformComponent();
sceneTrans.setPosition(canvas.width * 0.5, canvas.height * 0.5);
scene.addComponent(sceneTrans);
engine.addEntity(scene);

// TODO: typing on this json file. Hmmm
const frames = parseTexturePackerFrames(IdleRedJson as any);
const idleAnim = new Animation('idle', frames.slice(0, 4));
const walkAnim = new Animation('walk', frames.slice(4));

const player = new Entity('player');
const transform = new TransformComponent();
transform.setScale(2, 2);
player.addComponent(transform);

const sprite = new SpriteComponent({
  imageSrc: IdleRedSrc,
  animations: [idleAnim, walkAnim]
});
player.addComponent(sprite);
scene.addChild(player);
sprite.enabled = true;

const mover = new PlayerMover(player);
player.addComponent(mover);
mover.enabled = true;


// const background = new Entity('bg');
// const transformBg = new TransformComponent();
// transformBg.setScale(1.5, 1.5);
// background.addComponent(transformBg);
// const spriteBg = new SpriteComponent({
//   imageSrc: BackgroundSrc,
// });
// background.addComponent(spriteBg);
// scene.addChild(background);
// spriteBg.enabled = true;