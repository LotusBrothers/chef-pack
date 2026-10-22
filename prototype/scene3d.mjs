import * as T from './vendor/three/three.module.min.js';
import { RoomEnvironment } from './vendor/three/RoomEnvironment.js';

const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const ease = x => 1 - Math.pow(1 - clamp(x), 3);
// Closed-form damped spring: deterministic, bounded, no rigid-body engine.
const spring = (time, omega = 13, damping = .78) => {
  const t = Math.max(0, time), w = omega * Math.sqrt(1 - damping * damping);
  return 1 - Math.exp(-damping * omega * t) * (Math.cos(w * t) + damping * omega / w * Math.sin(w * t));
};

async function cardTexture(brand, value) {
  const canvas = document.createElement('canvas'); canvas.width = 512; canvas.height = 720;
  const c = canvas.getContext('2d');
  c.fillStyle = brand.accent; c.beginPath(); c.roundRect(0, 0, 512, 720, 28); c.fill();
  c.fillStyle = brand.bg; c.beginPath(); c.roundRect(9, 9, 494, 702, 22); c.fill();
  const wash = c.createLinearGradient(0, 0, 512, 720); wash.addColorStop(0, '#ffffff26'); wash.addColorStop(1, '#00000012');
  c.fillStyle = wash; c.fillRect(12, 12, 488, 696);
  c.save(); c.beginPath(); c.roundRect(12, 12, 488, 696, 20); c.clip();
  c.strokeStyle = '#ffffff0e'; c.lineWidth = 2;
  for (let i = -720; i < 720; i += 42) { c.beginPath(); c.moveTo(i, 0); c.lineTo(i + 720, 720); c.stroke(); } c.restore();
  c.fillStyle = brand.ink; c.font = 'bold 15px system-ui'; c.fillText('CHEF PACK', 32, 47);
  c.textAlign = 'right'; c.fillText('DESIGN SAMPLE', 480, 47); c.textAlign = 'center';
  c.fillStyle = brand.orbit; c.beginPath(); c.arc(256, 247, 139, 0, Math.PI * 2); c.fill();
  const image = new Image(); image.src = new URL('./art/' + (brand.art || brand.id + '.svg'), import.meta.url).href;
  try {
    await image.decode(); const k = Math.min(220 / image.naturalWidth, 220 / image.naturalHeight);
    c.drawImage(image, 256 - image.naturalWidth * k / 2, 247 - image.naturalHeight * k / 2, image.naturalWidth * k, image.naturalHeight * k);
  } catch { /* The restaurant name below still identifies the sample. */ }
  c.fillStyle = brand.ink; c.font = 'bold 43px system-ui';
  if (c.measureText(brand.name).width > 430) c.font = 'bold 36px system-ui';
  c.fillText(brand.name, 256, 446); c.font = 'bold 107px system-ui'; c.fillText(value, 256, 565);
  c.font = 'bold 13px system-ui'; c.fillText('ILLUSTRATIVE VALUE', 256, 598);
  c.font = 'bold 12px system-ui'; c.textAlign = 'left'; c.fillText('BRAND STUDY', 32, 678);
  c.textAlign = 'right'; c.fillText('NOT REDEEMABLE', 480, 678);
  const texture = new T.CanvasTexture(canvas); texture.colorSpace = T.SRGBColorSpace;
  return texture;
}

export async function createServingScene(host, { brand, value, reduced = false, contact = () => {} }) {
  const renderer = new T.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
  renderer.setClearColor(0x000000, 0); renderer.toneMapping = T.ACESFilmicToneMapping; renderer.toneMappingExposure = .75;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = T.PCFSoftShadowMap;
  const canvas = renderer.domElement; canvas.className = 'serving-canvas';
  canvas.setAttribute('role', 'img'); canvas.setAttribute('aria-label', 'Three dimensional card drop and spin. After revealing, drag to inspect the restaurant card.');
  canvas.tabIndex = -1; host.appendChild(canvas);
  const scene = new T.Scene(), camera = new T.PerspectiveCamera(32, 1, .1, 40);
  const cameraHome = new T.Vector3(2.35, 2.8, 5.1), cameraTarget = new T.Vector3(0, .65, 0);
  camera.position.copy(cameraHome); camera.lookAt(cameraTarget);
  const pmrem = new T.PMREMGenerator(renderer), room = new RoomEnvironment();
  const environment = pmrem.fromScene(room, .04); scene.environment = environment.texture; scene.environmentIntensity = .55;
  room.dispose(); pmrem.dispose();
  scene.add(new T.AmbientLight(0xffffff, .12));
  const key = new T.DirectionalLight(0xfff4e6, 1.1); key.position.set(-3, 6, 4); key.castShadow = true;
  key.shadow.mapSize.set(512, 512); Object.assign(key.shadow.camera, { left: -2.5, right: 2.5, top: 3, bottom: -2, near: .1, far: 16 });
  key.shadow.bias = -.0005; key.shadow.normalBias = .02; scene.add(key);
  const fill = new T.DirectionalLight(0xdce8ff, .35); fill.position.set(4, 2, -3); scene.add(fill);
  const porcelain = new T.MeshStandardMaterial({ color: 0xf0ede6, roughness: .35, metalness: 0 });
  const plateRoot = new T.Group(); scene.add(plateRoot);
  const platePoints = [[.001,.055],[.5,.055],[.95,.06],[1.12,.075],[1.22,.13],[1.38,.18],[1.57,.17],[1.62,.145],[1.58,.115],[1.35,.105],[1.12,.035],[.3,.018],[.001,.018]].map(p => new T.Vector2(...p));
  const dish = new T.Mesh(new T.LatheGeometry(platePoints.reverse(), 64), porcelain); dish.castShadow = true; dish.receiveShadow = true; plateRoot.add(dish);
  const floor = new T.Mesh(new T.PlaneGeometry(20, 20), new T.ShadowMaterial({ opacity: .27 })); floor.rotation.x = -Math.PI / 2; floor.position.y = -.005; floor.receiveShadow = true; scene.add(floor);
  const texture = await cardTexture(brand, value);
  const card = new T.Group(); scene.add(card);
  const w = 1.08, h = 1.52, r = .065, shape = new T.Shape();
  shape.moveTo(-w/2+r,0); shape.lineTo(w/2-r,0); shape.quadraticCurveTo(w/2,0,w/2,r); shape.lineTo(w/2,h-r); shape.quadraticCurveTo(w/2,h,w/2-r,h); shape.lineTo(-w/2+r,h); shape.quadraticCurveTo(-w/2,h,-w/2,h-r); shape.lineTo(-w/2,r); shape.quadraticCurveTo(-w/2,0,-w/2+r,0);
  const edge = new T.MeshStandardMaterial({ color: brand.accent, metalness: .35, roughness: .35 });
  const thickness = new T.Mesh(new T.ExtrudeGeometry(shape, { depth: .022, bevelEnabled: false, curveSegments: 5 }), edge); thickness.position.z = -.011; thickness.castShadow = true; card.add(thickness);
  // Preserve printed brand colors independently of the reflective serving ware.
  const front = new T.Mesh(new T.PlaneGeometry(w,h), new T.MeshBasicMaterial({ map: texture, toneMapped: false, transparent: true, alphaTest: .5 })); front.position.set(0,h/2,.013); card.add(front);
  const back = new T.Mesh(new T.PlaneGeometry(w,h), new T.MeshStandardMaterial({ color: 0x262323, roughness: .35, metalness: .2 })); back.position.set(0,h/2,-.013); back.rotation.y = Math.PI; card.add(back);
  let disposed = false, frame = 0, animation = null, state = 'covered', last = 0;
  let yaw = 0, yawV = 0, yawTarget = 0, pitch = 0, pitchV = 0, pitchTarget = 0;
  let drawingFrames = 0, zoom = 1;
  function resize() { const rect = host.getBoundingClientRect(); renderer.setSize(rect.width, rect.height, false); camera.aspect = rect.width / Math.max(1,rect.height); camera.updateProjectionMatrix(); request(); }
  function flat() { card.position.set(0,.106,.69); card.rotation.set(-Math.PI/2,0,0); }
  function final() { plateRoot.position.y = 0; card.visible = true; card.position.set(0,.14,.35); card.rotation.set(0,.28,0); zoom=.86; state='revealed'; canvas.tabIndex=0; }
  flat(); card.visible=false;
  function draw() { renderer.render(scene,camera); drawingFrames++; canvas.dataset.frames = String(drawingFrames); }
  function request() { if (!disposed && !frame) frame = requestAnimationFrame(tick); }
  function tick(now) {
    frame = 0; if(disposed)return;
    const dt = Math.min(.032,(now-(last||now-16))/1000); last=now;
    for(let i=0;i<4;i++){ const d=dt/4; yawV+=(100*(yawTarget-yaw)-19*yawV)*d; yaw+=yawV*d; pitchV+=(100*(pitchTarget-pitch)-19*pitchV)*d; pitch+=pitchV*d; }
    if(animation){ const t=(now-animation.start)/1000;
      if(animation.kind==='serve'){
        const settle = (t,delay,height) => {
          const elapsed=t-delay, hit=Math.sqrt(2*height/18);
          if(elapsed<0)return height;
          if(elapsed<hit)return height-9*elapsed*elapsed;
          const after=elapsed-hit;
          return .028*Math.abs(Math.sin(after*24))*Math.exp(-11*after);
        };
        plateRoot.position.y=settle(t,0,.85);
        if(t>=Math.sqrt(2*.85/18)&&!animation.plate){animation.plate=true;contact('plate');}
      }else{
        card.visible=true;
        const hit=Math.sqrt(2*1.65/18), landed=t>=hit;
        const spin=clamp((t-hit-.12)/1.2), rise=clamp(spring(t-hit-.12,10,.76),0,1.04);
        const bounce=landed?.045*Math.abs(Math.sin((t-hit)*24))*Math.exp(-10*(t-hit)):1.65-9*t*t;
        card.position.set(0,.106+Math.max(0,bounce)+.034*rise,-.69+1.04*rise);
        card.rotation.set(Math.PI/2*(1-rise), (Math.PI*2+.28)*ease(spin), -.07*Math.sin(spin*Math.PI));
        zoom=1-.14*ease(spin);
        if(landed&&!animation.landed){animation.landed=true;contact('cover');}
        if(t>=hit+1.14&&!animation.confirmed){animation.confirmed=true;contact('confirm');}
      }
      if(t>=animation.duration){const done=animation.done,kind=animation.kind;animation=null;if(kind==='serve'){plateRoot.position.y=0;}else final();done();}
    }
    camera.position.copy(cameraHome).sub(cameraTarget).multiplyScalar(zoom).applyAxisAngle(new T.Vector3(0,1,0),yaw).add(cameraTarget); camera.position.y+=pitch; camera.lookAt(cameraTarget);
    draw();
    if(animation||Math.abs(yaw-yawTarget)+Math.abs(yawV)+Math.abs(pitch-pitchTarget)+Math.abs(pitchV)>.001)request();
  }
  function cancel() { if(animation){const done=animation.done;animation=null;done();} }
  function play(kind,duration){cancel();if(disposed)return Promise.resolve();if(reduced){if(kind==='reveal'){contact('confirm');final();}draw();return Promise.resolve();}return new Promise(done=>{animation={kind,duration,done,start:performance.now()};request();});}
  function pointer(e){if(state!=='revealed'||reduced)return;const rect=canvas.getBoundingClientRect();yawTarget=clamp((e.clientX-rect.left)/rect.width-.5,-.5,.5)*.65;pitchTarget=-clamp((e.clientY-rect.top)/rect.height-.5,-.5,.5)*.5;request();}
  function reset(){yawTarget=0;pitchTarget=0;request();}
  function keydown(e){if(state!=='revealed')return;const values={ArrowLeft:-.25,ArrowRight:.25};if(e.key in values){e.preventDefault();yawTarget=values[e.key];request();}if(e.key==='Escape')reset();}
  canvas.addEventListener('pointermove',pointer);canvas.addEventListener('pointerleave',reset);canvas.addEventListener('pointercancel',reset);canvas.addEventListener('blur',reset);canvas.addEventListener('keydown',keydown);
  const observer=new ResizeObserver(resize);observer.observe(host);resize();
  return {
    async serve(){state='ready';zoom=1;card.visible=false;flat();await play('serve',.65);},
    async reveal(){state='opening';await play('reveal',1.95);},
    finish(){cancel();final();draw();},
    dispose(){if(disposed)return;disposed=true;cancel();cancelAnimationFrame(frame);observer.disconnect();canvas.removeEventListener('pointermove',pointer);canvas.removeEventListener('pointerleave',reset);canvas.removeEventListener('pointercancel',reset);canvas.removeEventListener('blur',reset);canvas.removeEventListener('keydown',keydown);scene.traverse(obj=>{obj.geometry?.dispose();const mats=Array.isArray(obj.material)?obj.material:[obj.material];for(const m of mats)m?.dispose();});texture.dispose();environment.dispose();renderer.dispose();renderer.forceContextLoss();canvas.remove();}
  };
}
