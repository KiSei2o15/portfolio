// 1. 初始化 Three.js 场景、摄像机和渲染器
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75, 
    window.innerWidth / window.innerHeight, 
    0.1, 
    1000
);
camera.position.set(0, 0, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('three-container').appendChild(renderer.domElement);

// 2. 添加 OrbitControls 实现交互控制
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// 3. 添加光源（环境光和定向光）
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// 4. 添加一个基础模型（例如立方体），如果需要也可以移除
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// 创建 FBXLoader 实例
const fbxLoader = new THREE.FBXLoader();
fbxLoader.load(
    'models/mdl_ch049.fbx', // FBX 模型路径
    function (object) {
        // 如果模型包含动画，可以设置 AnimationMixer 来播放动画
        // const mixer = new THREE.AnimationMixer(object);
        // const action = mixer.clipAction(object.animations[0]);
        // action.play();

        scene.add(object);
    },
    undefined,
    function (error) {
        console.error('加载 FBX 模型出错：', error);
    }
);


// 6. 自适应窗口大小
window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// 7. 动画循环
function animate() {
    requestAnimationFrame(animate);
    controls.update();  // 更新 OrbitControls 状态
    renderer.render(scene, camera);
}
animate();

// 8. 【扩展】2D图片交互代码
// 由于 main.js 脚本通常放在 HTML 底部，DOM 已经加载完毕，可以直接操作页面元素
const images = document.querySelectorAll('.gallery img');
images.forEach(img => {
    img.addEventListener('click', function() {
        // 这里可以替换为打开模态窗口或其他交互效果
        alert('展示作品详情');
    });
});
