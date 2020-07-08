const THREE = window.THREE
let container, scene, camera, renderer, controls
var objects

const init = () => {
  container = document.getElementById('container')
  camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 15000)
  camera.position.z = 250

  scene = new THREE.Scene()
  scene.background = new THREE.Color().setHSL(0.51, 0.4, 0.01)
  scene.fog = new THREE.Fog(scene.background, 3500, 15000)

  // world

  const s = 250
  const geometry = new THREE.BoxBufferGeometry(s, s, s)
  const material = new THREE.MeshPhongMaterial({ color: 0xffffff, specular: 0xffffff, shininess: 50 })

  objects = []

  for (var i = 0; i < 1000; i++) {
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.x = 8000 * (2.0 * Math.random() - 1.0)
    mesh.position.y = 8000 * (2.0 * Math.random() - 1.0)
    mesh.position.z = 8000 * (2.0 * Math.random() - 1.0)

    mesh.rotation.x = Math.random() * Math.PI
    mesh.rotation.y = Math.random() * Math.PI
    mesh.rotation.z = Math.random() * Math.PI

    mesh.matrixAutoUpdate = false
    mesh.updateMatrix()

    objects.push(mesh)
    scene.add(mesh)
  }

  // lights

  const dirLight = new THREE.DirectionalLight(0xffffff, 0.30)
  dirLight.position.set(0, -1, 0).normalize()
  dirLight.color.setHSL(0.1, 0.7, 0.5)
  scene.add(dirLight)

  // renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.outputEncoding = THREE.sRGBEncoding
  container.appendChild(renderer.domElement)

  // controls
  controls = new window.MapControls(camera, renderer.domElement)
  controls.enableDamping = true // an animation loop is required when either damping or auto-rotation are enabled
  controls.dampingFactor = 0.05

  controls.autoRotate = true
  controls.autoRotateSpeed = 0.5

  controls.screenSpacePanning = false

  controls.minDistance = 10
  controls.maxDistance = 10000

  controls.maxPolarAngle = Math.PI / 2

  window.addEventListener('resize', onWindowResize, false)
}

const onWindowResize = () => {
  renderer.setSize(window.innerWidth, window.innerHeight)
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
}

const render = () => {
  for (const item of objects) {
    item.rotation.x += 0.005
    item.rotation.y += 0.007
    item.updateMatrix()
  }
  controls.update()
  renderer.render(scene, camera)
}

const animate = () => {
  window.requestAnimationFrame(animate)
  render()
}

init()
animate()
