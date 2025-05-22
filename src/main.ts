import { Renderer } from './renderer';

const canvas = <HTMLCanvasElement>document.getElementById('gfx-main');
const renderer = await Renderer.create(canvas);

renderer.render();
