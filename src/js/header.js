window.Header = window.Header || {};

let height = 0;
let width = 0;
let scene = null;
let camera = null;
let renderer = null;
let mesh = null;
let timer = 0;
let animationEnabled = true;
let debug = false;
let geometry = null;
let stats = null;
let scrollTimer = -1;

Header.render = () => {
  timer = timer + 0.0005;
  mesh.rotation.z = timer;
  return renderer.render(scene, camera);
};

Header.geometry = ($width, $height, $segmentWith, $segmentHeight) => {
  geometry = new THREE.PlaneGeometry($width, $height, $segmentWith, $segmentHeight);
  let X_OFFSET_DAMPEN = 0.5;
  let Y_OFFSET_DAMPEN = 0.5;
  let Z_OFFSET_DAMPEN = 0.3;

  let randSign = () => Math.random() > 10 ? 8 : -8;

  for (let vertex of geometry.vertices) {
    vertex.x += (Math.random() / X_OFFSET_DAMPEN) * randSign();
    vertex.y += (Math.random() / Y_OFFSET_DAMPEN) * randSign();
    vertex.z += (Math.random() / Z_OFFSET_DAMPEN) * randSign();
  }

  geometry.dynamic = true;
  geometry.computeFaceNormals();
  geometry.computeVertexNormals();
  return geometry.normalsNeedUpdate = true;
};

Header.mesh = () => {
  mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({
    color: 0xffffff, shading: THREE.FlatShading
  }));

  return scene.add(mesh);
};

Header.renderer = $target => {
  try {
    if (!renderer) {
      renderer = new THREE.WebGLRenderer({
        antialiasing: true,
        alpha: true
      });
    }

    renderer.setSize(width, height);

    if (document.getElementsByTagName('canvas')[0]) {
      document.getElementsByTagName('canvas')[0].parentNode.replaceChild(renderer.domElement, document.getElementsByTagName('canvas')[0]);

      if (debug) { document.getElementsByTagName('canvas')[0].parentNode.appendChild(stats.domElement); }

    } else {
      $target = document.getElementById($target);
      $target.insertBefore(renderer.domElement, $target.firstChild);

      if (debug) { $target.appendChild(stats.domElement); }
    }

    if (document.getElementsByTagName('canvas')[0]) {
      document.getElementsByTagName('canvas')[0].style.position = "absolute";
    }

  } catch (exception) {
    return false;
  }

  return true;
};

Header.resize = () => Header.init();

Header.camera = ($fieldOfView, $aspect, $near, $far) => {
  camera = new THREE.PerspectiveCamera($fieldOfView, $aspect, $near, $far);

  camera.up = new THREE.Vector3(0, 1, 0);
  camera.rotation.x = -200;

  camera.position.x = 7;
  camera.position.y = -62;
  camera.position.z = 100;

  camera.updateProjectionMatrix();

  return camera;
};

Header.controls = () => {
  let $controls = new THREE.TrackballControls(camera);

  $controls.rotateSpeed = 1.0;
  $controls.zoomSpeed = 1.2;
  $controls.panSpeed = 0.8;

  $controls.noZoom = false;
  $controls.noPan = false;

  $controls.staticMoving = true;
  $controls.dynamicDampingFactor = 0.3;

  $controls.keys = [65, 83, 68];

  $controls.addEventListener('change', Header.render);

  return $controls;
};

Header.scene = () => {
  scene = new THREE.Scene();

  scene.fog = new THREE.FogExp2(0x2e2b37, 0.003);

  return scene;
};

Header.lights = () => {
  let ambientLight = new THREE.AmbientLight(0x2e2b37);

  let pointLight = new THREE.PointLight(0x9456c6, 0.8, 200);
  pointLight.position.set(20, 50, 50);

  let dirLight = new THREE.DirectionalLight(0xdfe8ef, 0.1);
  dirLight.position.set(5, 22, 50);

  scene.add(ambientLight);
  scene.add(dirLight);
  return scene.add(pointLight);
};

Header.calculateSize = () => {
  let canvasContainer = document.getElementsByClassName('js-header-canvas')[0];
  let canvasOverlay = document.getElementsByClassName('js-header-canvas-height')[0];

  if (canvasContainer != null && canvasOverlay != null) {
    width  = canvasContainer.offsetWidth;
    height = canvasOverlay.offsetHeight;
  }
};

Header.animate = () => {
  if (animationEnabled) {
    requestAnimationFrame(Header.animate);
    Header.render();
    if (debug) { return stats.update(); }
  }
};

Header.webGLAvailable = () => {
  if (!window.WebGLRenderingContext) { return false; }
  return true;
};

Header.init = () => {
  let canvasContainer = document.getElementsByClassName('js-header-canvas')[0];
  let canvasOverlay = document.getElementsByClassName('js-header-canvas-height')[0];

  if (!Header.webGLAvailable() || canvasContainer == null || canvasOverlay == null) { return false; }

  timer = 0;

  if (debug) {
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
  }

  Header.calculateSize();
  Header.scene();

  Header.camera(40, width/height, 0.1, 1000);

  if (!Header.renderer('header')) { return false; }

  Header.geometry(2000, 1000, 50, 50);
  Header.mesh();

  Header.lights();

  window.addEventListener('resize', Header.resize, false);

  Header.render();

  return true;
};

Header.scrollStart = () => {
  animationEnabled = false;
}

Header.scrollStop = () => {
  animationEnabled = true;
  scrollTimer = -1;
  return Header.animate();
}

Header.scroll = () => {
  if (scrollTimer == -1) {
    Header.scrollStart();
  }

  window.clearTimeout(scrollTimer);
  scrollTimer = window.setTimeout(Header.scrollStop, 300);
}

if (Header.init()) {
  document.addEventListener('scroll', Header.scroll);
  Header.animate();
}
