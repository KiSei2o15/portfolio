// ========== 全局变量 ========== //
let camera, scene, renderer, controls;
let loadedModels = [];      // 存储加载的模型
let currentModelIndex = null; // 当前显示的模型索引

// ========== 初始化 ========== //
function init() {
  // 1. 获取容器及其宽高
  const container = document.getElementById('three-container');
  const width = container.clientWidth;
  const height = container.clientHeight;

  // 2. 创建场景
  scene = new THREE.Scene();

  // 3. 创建摄像机
  camera = new THREE.PerspectiveCamera(75, width / height, 0.001, 1000);
  camera.position.set(0, 2, 5);

  // 4. 创建渲染器，开启透明
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  // 让渲染背景完全透明，这样能透出容器背景色
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  // 5. 轨道控制器（OrbitControls）
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; // 缓动效果

  // 6. 光源
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 10, 7.5);
  scene.add(directionalLight);

  // 7. 加载多个 FBX 模型
  loadModels();

  // 8. 监听窗口大小变化
  window.addEventListener('resize', onWindowResize);

}

// ========== 加载模型函数 ========== //
function loadModels() {
  const fbxLoader = new THREE.FBXLoader();

  // 这里放你要加载的多个 FBX 文件路径
  const modelsToLoad = [
    'assets/models/test1.fbx',
    'assets/models/test2.fbx',
    'assets/models/test3.fbx'
  ];

  modelsToLoad.forEach((path, i) => {
    fbxLoader.load(
      path,
      (object) => {
        // 缩放 & 初始隐藏
        object.scale.set(0.01, 0.01, 0.01);
        object.visible = false;
        scene.add(object);
        //
        //  计算模型包围盒
        const box = new THREE.Box3().setFromObject(object);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        // 调整摄像机位置，让模型充满视图
        const maxSize = Math.max(size.x, size.y, size.z);
        const fitHeightDistance = maxSize / (2 * Math.atan(Math.PI * camera.fov / 360));
        const fitWidthDistance = fitHeightDistance / camera.aspect;
        const distance = Math.max(fitHeightDistance, fitWidthDistance);
      
        // 将摄像机沿 z 轴方向定位（你也可以根据需求调整方向）
        camera.position.set(center.x, center.y, center.z + distance * 1.2);
        camera.lookAt(center);
      
        // 更新 OrbitControls 目标
        controls.target.copy(center);  
        controls.update();

        // 存到数组
        loadedModels[i] = object;
        console.log(`模型 ${i} 加载完成:`, path);

        // 默认先显示第一个加载完成的模型
        if (i === 0) {
          showModel(0);
        }
      },
      
      (xhr) => {
        // 加载进度
        const percent = (xhr.loaded / xhr.total * 100).toFixed(2);
        console.log(`模型 ${i} 加载进度: ${percent}%`);
      },
      (error) => {
        console.error(`模型 ${i} 加载失败:`, error);
      }
    );
  });
}

// ========== 切换模型函数 ========== //
function showModel(index) {
  // 隐藏当前模型
  if (currentModelIndex !== null && loadedModels[currentModelIndex]) {
    loadedModels[currentModelIndex].visible = false;
  }
  // 显示新的模型
  if (loadedModels[index]) {
    loadedModels[index].visible = true;
    currentModelIndex = index;
  }
}

// ========== 窗口自适应 ========== //
function onWindowResize() {
  const container = document.getElementById('three-container');
  const w = container.clientWidth;
  const h = container.clientHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
}

// ========== 动画循环 ========== //
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

// ========== 按钮事件绑定 ========== //
// 监听按钮点击来切换模型
document.getElementById('btnModelA').addEventListener('click', () => {
  showModel(0);
});
document.getElementById('btnModelB').addEventListener('click', () => {
  showModel(1);
});
document.getElementById('btnModelC').addEventListener('click', () => {
  showModel(2);
});

// ========== 启动 ========== //
init();
animate();
