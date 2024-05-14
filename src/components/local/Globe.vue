<script setup>
/** Vendor */
import { ref, onMounted, onBeforeUnmount } from "vue"
import * as Three from "three"
import ThreeGlobe from "three-globe"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { CSS2DRenderer } from "three/addons/renderers/CSS2DRenderer.js"

/** Services */
import { getFresnelMat } from "@/services/globe/fresnelMat"
import { getStars } from "@/services/globe/stars"

const props = defineProps({
	parent: Object,
})

const globeEl = ref(null)

let globe = null
let renderers = null
let scene = null
let camera = null
let controls = null
let group = null
let stars = null

const pointsData = [...Array(10).keys()].map(() => ({
	lat: (Math.random() - 0.5) * 180,
	lng: (Math.random() - 0.5) * 360,
	size: Math.random() / 2,
	color: `rgba(10,222,113,1)`,
}))

const parentClientRect = ref()

onMounted(() => {
	window.addEventListener("resize", onResize)

	parentClientRect.value = props.parent.getBoundingClientRect()

	const N = 10
	const gData = [...Array(N).keys()].map(() => ({
		lat: (Math.random() - 0.5) * 180,
		lng: (Math.random() - 0.5) * 360,
		maxR: Math.random() * 20,
		propagationSpeed: 5,
		repeatPeriod: Math.random() * 20 + 500,
	}))
	const colorInterpolator = (t) => `rgba(10,222,113,${1 - t})`

	const arcsData = [...Array(10).keys()].map(() => ({
		startLat: (Math.random() - 0.5) * 180,
		startLng: (Math.random() - 0.5) * 360,
		endLat: (Math.random() - 0.5) * 180,
		endLng: (Math.random() - 0.5) * 360,
		color: `rgba(10,222,113,1)`,
	}))

	const markerSvg = `<div>zdarova</div>`
	const test = [...Array(30).keys()].map(() => ({
		lat: (Math.random() - 0.5) * 180,
		lng: (Math.random() - 0.5) * 360,
		size: 7 + Math.random() * 30,
		color: ["red", "white", "blue", "green"][Math.round(Math.random() * 3)],
	}))

	scene = new Three.Scene()
	scene.add(new Three.AmbientLight("#fff", 0.2))

	group = new Three.Group()
	scene.add(group)

	globe = new ThreeGlobe({ waitForGlobeReady: true }).globeImageUrl("/8k_mercury.jpg")
	globe.showAtmosphere(false).atmosphereColor("#fff").atmosphereAltitude(0.2)
	globe
		.ringsData(gData)
		.ringAltitude(0.1)
		.ringColor(() => colorInterpolator)
		.ringMaxRadius("maxR")
		.ringPropagationSpeed("propagationSpeed")
		.ringRepeatPeriod("repeatPeriod")
		.arcsData(arcsData)
		.arcColor("color")
		.arcDashLength(0.4)
		.arcDashGap(4)
		.arcDashInitialGap(() => Math.random() * 5)
		.arcDashAnimateTime(3000)
		.pointsData(pointsData)
		.pointAltitude("size")
		.pointColor("color")
		.pointRadius(0.2)
		.htmlElementsData(test)
		.htmlElement((d) => {
			const el = document.createElement("div")
			el.innerHTML = markerSvg
			el.style.color = d.color
			el.style.width = `${d.size}px`
			return el
		})

	renderers = [new Three.WebGLRenderer({ alpha: true, antialias: true }), new CSS2DRenderer()]
	renderers.forEach((r, idx) => {
		r.setSize(parentClientRect.value.width, parentClientRect.value.height)

		if (idx > 0) {
			r.domElement.style.position = "absolute"
			r.domElement.style.top = "0px"
			r.domElement.style.pointerEvents = "none"
		}
		globeEl.value.appendChild(r.domElement)
	})

	group.add(globe)

	const light = new Three.DirectionalLight(0xffffff)
	light.position.set(-2, 0.5, 1.5)
	scene.add(light)

	const geometry = new Three.IcosahedronGeometry(1, 20)
	const fresnelMat = getFresnelMat()
	const glowMesh = new Three.Mesh(geometry, fresnelMat)
	glowMesh.scale.setScalar(110)
	scene.add(glowMesh)

	stars = getStars()
	scene.add(stars)

	camera = new Three.PerspectiveCamera(75, parentClientRect.value.width / parentClientRect.value.height, 0.1, 1000)
	camera.position.z = 200

	controls = new OrbitControls(camera, renderers[0].domElement)
	controls.enableDamping = true
	controls.dynamicDampingFactor = 0.01
	controls.enablePan = false
	controls.minDistance = 120
	controls.maxDistance = 350
	controls.rotateSpeed = 1.5
	controls.zoomSpeed = 1
	controls.autoRotate = false

	controls.minPolarAngle = Math.PI / 3.5
	controls.maxPolarAngle = Math.PI - Math.PI / 3

	globe.setPointOfView(camera.position, globe.position)
	controls.addEventListener("change", () => globe.setPointOfView(camera.position, globe.position))

	const globeMaterial = globe.globeMaterial()
	globeMaterial.color = new Three.Color(0x0f6e3b)
	globeMaterial.emissive = new Three.Color(0x000)
	globeMaterial.emissiveIntensity = 0.01
	globeMaterial.shininess = 0.7

	setInterval(() => {
		pointsData.forEach((d) => (d.size = Math.random() / 2))
		globe.pointsData(pointsData)
	}, 2000)

	animate()
})

onBeforeUnmount(() => {
	window.removeEventListener("resize", onResize)
})

const animate = () => {
	globe.rotation.y += 0.001
	stars.rotation.y += 0.0005

	controls.update()
	renderers.forEach((r) => r.render(scene, camera))
	requestAnimationFrame(animate)
}

const onResize = () => {
	parentClientRect.value = props.parent.getBoundingClientRect()

	camera.aspect = parentClientRect.value.width / parentClientRect.value.height
	camera.updateProjectionMatrix()

	renderers.forEach((r) => r.setSize(parentClientRect.value.width, parentClientRect.value.height))
}
</script>

<template>
	<div :class="$style.wrapper">
		<div ref="globeEl"></div>
	</div>
</template>

<style module>
.wrapper {
	position: absolute;
	top: 50%;
	left: 50%;

	transform: translateX(-50%) translateY(-50%);
}
</style>
