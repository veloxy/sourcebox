window.Header = window.Header || {};

var height,
    width,
    scene,
    camera,
    controls,
    renderer,
    mesh,
    material;

Header.render = function() {
  var time = Date.now() * 0.001;
  mesh.rotation.z = time * 0.05;
  renderer.render(scene, camera);
}

Header.geometry = function($width, $height, $segmentWith, $segmentHeight) {
  var $geometry = new THREE.PlaneGeometry($width, $height, $segmentWith, $segmentHeight);
  var X_OFFSET_DAMPEN = 0.5;
  var Y_OFFSET_DAMPEN = 0.5;
  var Z_OFFSET_DAMPEN = 0.3;

  var randSign = function() {
    return (Math.random() > 10 ? 8 : -8);
  };

  for (var vertIndex = 0; vertIndex < $geometry.vertices.length; vertIndex++) {
    $geometry.vertices[vertIndex].x += Math.random() / X_OFFSET_DAMPEN * randSign();
    $geometry.vertices[vertIndex].y += Math.random() / Y_OFFSET_DAMPEN * randSign();
    $geometry.vertices[vertIndex].z += Math.random() / Z_OFFSET_DAMPEN * randSign();
  }

  $geometry.dynamic = true;
  $geometry.computeFaceNormals();
  $geometry.computeVertexNormals();
  $geometry.normalsNeedUpdate = true;

  return $geometry;
}

Header.mesh = function($geometry) {
  return new THREE.Mesh($geometry, new THREE.MeshLambertMaterial({
    color: 0xffffff, shading: THREE.FlatShading
  }));
}

Header.renderer = function($target) {
  var $renderer = new THREE.WebGLRenderer({antialiasing: true, alpha: true});

  $renderer.setSize(width, height);

  if (document.getElementsByTagName('canvas')[0]) {
    document.getElementsByTagName('canvas')[0].parentNode.replaceChild($renderer.domElement, document.getElementsByTagName('canvas')[0]);
  } else {
    document.getElementById($target).appendChild($renderer.domElement);
  }

  return $renderer;
}

Header.resize = function() {
  Header.init();
}

Header.camera = function($fieldOfView, $aspect, $near, $far) {
  var $camera = new THREE.PerspectiveCamera($fieldOfView, $aspect, $near, $far);

  $camera.up = new THREE.Vector3(0, 1, 0);
  $camera.rotation.x = -200;

  $camera.position.x = 7;
  $camera.position.y = -62;
  $camera.position.z = 100;

  $camera.updateProjectionMatrix();

  return $camera;
}

Header.controls = function($camera) {
  var $controls = new THREE.TrackballControls($camera);

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
}

Header.scene = function() {
  var $scene = new THREE.Scene();

  $scene.fog = new THREE.FogExp2(0x2e2b37, 0.003);

  return $scene;
}

Header.lights = function() {
  var ambientLight = new THREE.AmbientLight(0x2e2b37);

  var pointLight = new THREE.PointLight(0x9456c6, .8, 200);
  pointLight.position.set(20, 50, 50);

  var dirLight = new THREE.DirectionalLight(0xdfe8ef, 0.1);
  dirLight.position.set(5, 22, 50);

  scene.add(ambientLight);
  scene.add(dirLight);
  scene.add(pointLight);
}

Header.calculateSize = function() {
  width  = document.getElementById('header').offsetWidth;
  height = $('.header-text').outerHeight();
}

Header.animate = function() {
  requestAnimationFrame(Header.animate);
  // controls.update();
  Header.render();
}

Header.init = function() {
  Header.calculateSize();

  scene    = Header.scene();
  camera   = Header.camera(40, width/height, 0.1, 1000);
  // controls = Header.controls(camera);
  renderer = Header.renderer('header');
  geometry = Header.geometry(2000, 1000, 50, 50);
  mesh     = Header.mesh(geometry);

  scene.add(mesh);

  Header.lights();

  window.addEventListener('resize', Header.resize, false);

  Header.render();
  Header.animate();
}

Header.init();