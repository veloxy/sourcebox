window.Header = window.Header || {};

height           = 0
width            = 0
scene            = null
camera           = null
renderer         = null
mesh             = null
timer            = 0
animationEnabled = true
debug            = false
geometry         = null
stats            = null

Header.render = () ->
  timer = timer + 0.0005;
  mesh.rotation.z = timer;
  renderer.render(scene, camera);

Header.geometry = ($width, $height, $segmentWith, $segmentHeight) ->
  geometry = new THREE.PlaneGeometry($width, $height, $segmentWith, $segmentHeight);
  X_OFFSET_DAMPEN = 0.5;
  Y_OFFSET_DAMPEN = 0.5;
  Z_OFFSET_DAMPEN = 0.3;

  randSign = () ->
    return if Math.random() > 10 then 8 else -8;

  for vertex in geometry.vertices
    vertex.x += Math.random() / X_OFFSET_DAMPEN * randSign();
    vertex.y += Math.random() / Y_OFFSET_DAMPEN * randSign();
    vertex.z += Math.random() / Z_OFFSET_DAMPEN * randSign();

  geometry.dynamic = true;
  geometry.computeFaceNormals();
  geometry.computeVertexNormals();
  geometry.normalsNeedUpdate = true;

Header.mesh = () ->
  mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({
    color: 0xffffff, shading: THREE.FlatShading
  }));

  scene.add(mesh);

Header.renderer = ($target) ->
  try
    if !renderer
      renderer = new THREE.WebGLRenderer({antialiasing: true, alpha: true});

    renderer.setSize(width, height);

    if document.getElementsByTagName('canvas')[0]
      document.getElementsByTagName('canvas')[0].parentNode.replaceChild(renderer.domElement, document.getElementsByTagName('canvas')[0]);

      if debug then document.getElementsByTagName('canvas')[0].parentNode.appendChild(stats.domElement);

    else
      $target = document.getElementById($target);
      $target.insertBefore(renderer.domElement, $target.firstChild);

      if debug then $target.appendChild(stats.domElement);
  catch exception
    return false;

  return true;

Header.resize = () ->
  Header.init();

Header.camera = ($fieldOfView, $aspect, $near, $far) ->
  camera = new THREE.PerspectiveCamera($fieldOfView, $aspect, $near, $far);

  camera.up = new THREE.Vector3(0, 1, 0);
  camera.rotation.x = -200;

  camera.position.x = 7;
  camera.position.y = -62;
  camera.position.z = 100;

  camera.updateProjectionMatrix();

  return camera;

Header.controls = () ->
  $controls = new THREE.TrackballControls(camera);

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

Header.scene = () ->
  scene = new THREE.Scene();

  scene.fog = new THREE.FogExp2(0x2e2b37, 0.003);

  return scene;

Header.lights = () ->
  ambientLight = new THREE.AmbientLight(0x2e2b37);

  pointLight = new THREE.PointLight(0x9456c6, 0.8, 200);
  pointLight.position.set(20, 50, 50);

  dirLight = new THREE.DirectionalLight(0xdfe8ef, 0.1);
  dirLight.position.set(5, 22, 50);

  scene.add(ambientLight);
  scene.add(dirLight);
  scene.add(pointLight);

Header.calculateSize = () ->
  width  = document.getElementById('header').offsetWidth;
  height = $('.header-text').outerHeight();

Header.animate = () ->
  if animationEnabled
    requestAnimationFrame(Header.animate);
    Header.render();
    if debug then stats.update();

Header.webGLAvailable = () ->
  if !window.WebGLRenderingContext then return false;
  return true;

Header.init = () ->

  if !Header.webGLAvailable() then return false;

  timer = 0;

  if debug
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';

  Header.calculateSize();
  Header.scene();

  Header.camera(40, width/height, 0.1, 1000);

  if !Header.renderer('header') then return false;

  Header.geometry(2000, 1000, 50, 50);
  Header.mesh();

  Header.lights();

  window.addEventListener('resize', Header.resize, false);

  Header.render();

  return true;

if Header.init()
  $(window).on 'scrollstart', () ->
    animationEnabled = false;

  $(window).on 'scrollstop', () ->
    animationEnabled = true;
    Header.animate();

  Header.animate();
