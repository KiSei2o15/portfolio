// 1. 基本场景、相机、渲染器
const container = document.getElementById('three-container');
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  container.clientWidth / container.clientHeight,
  0.1,
  1000
);
camera.position.set(0, 2, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setClearColor(0x000000, 1); // 或者设置透明 background
container.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// 2. 基础光照
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

// 3. 准备一个数组来存放加载后的模型对象
const loadedModels = [];
let currentModelIndex = null;

// 4. 加载多个 FBX 模型
const fbxLoader = new THREE.FBXLoader();
const modelsToLoad = [
  'assets/models/test1.fbx',
  'assets/models/test2.fbx',
  'assets/models/test3.fbx'
];

modelsToLoad.forEach((path, i) => {
  fbxLoader.load(
    path,
    (object) => {
      // 缩放和位置
      object.scale.set(0.01, 0.01, 0.01);
      object.visible = false; // 初始都先隐藏
      scene.add(object);
      loadedModels[i] = object;

      console.log(`模型 ${i} 加载完成:`, path);

      // 如果是第一个加载完成的模型，可以默认显示
      if (i === 0) {
        showModel(0);
      }
    },
    (xhr) => {
      console.log(`模型 ${i} 加载进度: ${ (xhr.loaded / xhr.total * 100).toFixed(2) }%`);
    },
    (error) => {
      console.error(`模型 ${i} 加载失败:`, error);
    }
  );
});

// 5. 切换函数
function showModel(index) {
  // 如果当前有模型显示，先隐藏它
  if (currentModelIndex !== null && loadedModels[currentModelIndex]) {
    loadedModels[currentModelIndex].visible = false;
  }
  // 显示新的模型
  if (loadedModels[index]) {
    loadedModels[index].visible = true;
    currentModelIndex = index;
  }
}

// 6. 按钮点击事件：切换模型
document.getElementById('btnModelA').addEventListener('click', () => {
  showModel(0);
});
document.getElementById('btnModelB').addEventListener('click', () => {
  showModel(1);
});
document.getElementById('btnModelC').addEventListener('click', () => {
  showModel(2);
});

// 7. 监听窗口大小
window.addEventListener('resize', onWindowResize);
function onWindowResize() {
  const w = container.clientWidth;
  const h = container.clientHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
}

// 8. 动画循环
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
