const THREE = window.THREE
let container, scene, camera, renderer, mixer, controls, clock
var objects

const init = () => {
  container = document.getElementById('container')
  camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 1, 1000)
  camera.position.set(15, 10, -15)

  scene = new THREE.Scene()
  // scene.background = new THREE.Color().setHSL(0.51, 0.4, 0.01)
  // scene.fog = new THREE.Fog(scene.background, 3500, 15000)

  clock = new THREE.Clock()

  objects = []

  // boxes
  // const s = 250
  // const geometry = new THREE.BoxBufferGeometry(s, s, s)
  // const material = new THREE.MeshPhongMaterial({ color: 0xffffff, specular: 0xffffff, shininess: 50 })

  // for (var i = 0; i < 1000; i++) {
  //   const mesh = new THREE.Mesh(geometry, material)
  //   mesh.position.x = 8000 * (2.0 * Math.random() - 1.0)
  //   mesh.position.y = 8000 * (2.0 * Math.random() - 1.0)
  //   mesh.position.z = 8000 * (2.0 * Math.random() - 1.0)

  //   mesh.rotation.x = Math.random() * Math.PI
  //   mesh.rotation.y = Math.random() * Math.PI
  //   mesh.rotation.z = Math.random() * Math.PI

  //   mesh.matrixAutoUpdate = false
  //   mesh.updateMatrix()

  //   objects.push(mesh)
  //   scene.add(mesh)
  // }

  // storm trooper - collada

  const loader = new THREE.ColladaLoader()
  loader.load('public/assets/stormtrooper.dae', function (collada) {
    const avatar = collada.scene
    const animations = avatar.animations

    avatar.traverse(function (node) {
      if (node.isSkinnedMesh) {
        node.frustumCulled = false
      }
    })

    mixer = new THREE.AnimationMixer(avatar)
    mixer.clipAction(animations[0]).play()

    scene.add(avatar)
  })

  // const gridHelper = new THREE.GridHelper(10, 20, 0x888888, 0x444444)
  // scene.add(gridHelper)

  // lights

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.2)
  scene.add(ambientLight)

  const pointLight = new THREE.PointLight(0xffffff, 0.8)
  scene.add(camera)
  camera.add(pointLight)

  // renderer
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.outputEncoding = THREE.sRGBEncoding
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  container.appendChild(renderer.domElement)

  controls = new THREE.OrbitControls(camera, renderer.domElement)
  controls.screenSpacePanning = true
  controls.minDistance = 5
  controls.maxDistance = 40
  controls.target.set(0, 2, 0)
  controls.update()

  window.addEventListener('resize', onWindowResize, false)
}

const onWindowResize = () => {
  renderer.setSize(window.innerWidth, window.innerHeight)
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
}

const render = () => {
  const delta = clock.getDelta()
  for (const item of objects) {
    item.rotation.x += 0.005
    item.rotation.y += 0.007
    item.updateMatrix()
  }
  mixer.update(delta)
  renderer.render(scene, camera)
}

const animate = () => {
  window.requestAnimationFrame(animate)
  render()
}

init()
animate()
