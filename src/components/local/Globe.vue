<script setup>
/** Vendor */
import { ref, onMounted, onBeforeUnmount, useCssModule, watch } from "vue"
import { DateTime } from "luxon"
import { v4 as uuid } from "uuid"
import * as Three from "three"
import ThreeGlobe from "three-globe"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { CSS2DRenderer } from "three/addons/renderers/CSS2DRenderer.js"

/** Services */
import { getStars } from "@/services/globe/stars"

const cssModule = useCssModule()

const props = defineProps({
	parent: Object,
	txs: {
		type: Array,
		default: [],
	},
})

const globeEl = ref(null)

let globe = null
let renderers = null
let scene = null
let camera = null
let controls = null
let group = null
let stars = null

const parentClientRect = ref()

const getRandomPos = (from = -180, to = 180, fixed = 2) => {
	return (Math.random() * (to - from) + from).toFixed(fixed) * 1
}

const ARC_LENGTH = 0.5
const TS = 1500
const MAX_RADIUS = 5
const PROPAGATION_SPEED = 2
const NUM_RINGS = 2

onMounted(() => {
	window.addEventListener("resize", onResize)

	parentClientRect.value = props.parent.getBoundingClientRect()

	const markerSvg = `<div class=${cssModule.popupWrapper}>
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10s10-4.477 10-10S17.523 2 12 2Zm-.773 6.569l-2.015 1.605c-.845.673-1.268 1.01-1.185 1.385l.004.019c.094.373.63.517 1.702.804c.595.16.893.24 1.033.465l.007.012c.135.229.058.515-.095 1.087l-.04.15c-.426 1.586-.638 2.379-.229 2.635c.41.256 1.06-.262 2.363-1.3l2.015-1.604c.846-.674 1.268-1.01 1.186-1.386l-.004-.019c-.095-.373-.63-.517-1.702-.804c-.595-.16-.893-.24-1.033-.465l-.007-.012c-.135-.228-.058-.514.095-1.086l.04-.15c.425-1.586.638-2.38.229-2.636c-.41-.256-1.061.263-2.364 1.3Z" clip-rule="evenodd"/></svg>
			<div class=${cssModule.content}>
				<div class=${cssModule.title}> New Transaction <div>$HASH</div></div>
				<div class=${cssModule.subtitle}> Successfull transaction signed by $SIGNER</div>
				<div class=${cssModule.subtitle}> $MSG_TYPE $WHEN</div>
			</div>
		</div>`

	scene = new Three.Scene()
	scene.add(new Three.AmbientLight("#fff", 0.2))

	group = new Three.Group()
	scene.add(group)

	globe = new ThreeGlobe({ waitForGlobeReady: true }).globeImageUrl("/8k_mercury.jpg")

	globe.showAtmosphere(false)
	globe
		.arcColor(() => "rgba(255,100,50, 1)")
		.arcDashLength(ARC_LENGTH)
		.arcDashGap(2)
		.arcStroke(0.3)
		.arcDashInitialGap(1)
		.arcDashAnimateTime(TS)
		.arcsTransitionDuration(0)
		.ringColor(() => (t) => `rgba(255,100,50,${1 - t})`)
		.ringMaxRadius(MAX_RADIUS)
		.ringPropagationSpeed(PROPAGATION_SPEED)
		.ringRepeatPeriod((TS * ARC_LENGTH) / NUM_RINGS)
		.pointColor(() => `rgba(255,100,50, 1)`)
		.pointRadius(0.1)
		.htmlAltitude(0.2)
		.htmlElement((d) => {
			const el = document.createElement("div")
			let popup = markerSvg.replace("$HASH", `${d.tx.hash.slice(0, 4)}...${d.tx.hash.slice(-4)}`)
			popup = popup.replace("$SIGNER", d.tx.signers[0].slice(-4))
			popup = popup.replace("$MSG_TYPE", d.tx.message_types[0])
			popup = popup.replace("$WHEN", DateTime.fromISO(d.tx.time).setLocale("en").toFormat("ff"))
			el.innerHTML = popup

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
	controls.rotateSpeed = 1
	controls.zoomSpeed = 1
	controls.enableZoom = false
	controls.autoRotate = true
	controls.autoRotateSpeed = 0.7

	controls.minPolarAngle = Math.PI / 3.5
	controls.maxPolarAngle = Math.PI - Math.PI / 3

	globe.setPointOfView(camera.position, globe.position)
	controls.addEventListener("change", () => globe.setPointOfView(camera.position, globe.position))

	const globeMaterial = globe.globeMaterial()
	globeMaterial.color = new Three.Color(0x0f6e3b)
	globeMaterial.emissive = new Three.Color(0x000)
	globeMaterial.emissiveIntensity = 0.01
	globeMaterial.shininess = 0.7

	animate()
})

onBeforeUnmount(() => {
	window.removeEventListener("resize", onResize)
})

watch(
	() => props.txs,
	() => {
		props.txs.forEach((tx) => {
			const targetPos = { lat: getRandomPos(140, 220), lng: getRandomPos(0, 360) }
			const id = uuid()

			globe.arcsData([
				...globe.arcsData(),
				{
					id,
					startLat: getRandomPos(140, 220),
					startLng: getRandomPos(0, 360),
					endLat: targetPos.lat,
					endLng: targetPos.lng,
				},
			])

			setTimeout(() => {
				globe.ringsData([...globe.ringsData(), { id, lat: targetPos.lat, lng: targetPos.lng }])
				globe.htmlElementsData([...globe.htmlElementsData(), { id, lat: targetPos.lat, lng: targetPos.lng, tx }])
				globe.pointsData([...globe.pointsData(), { id, lat: targetPos.lat, lng: targetPos.lng }])
			}, TS)

			setTimeout(() => {
				globe.arcsData([...globe.arcsData().filter((d) => d.id !== id)])
			}, TS * 2)

			setTimeout(() => {
				globe.ringsData([...globe.ringsData().filter((d) => d.id !== id)])
				globe.htmlElementsData([...globe.htmlElementsData().filter((d) => d.id !== id)])
				globe.pointsData([...globe.pointsData().filter((d) => d.id !== id)])
			}, 25_000)
		})
	},
)

const animate = () => {
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

.popupWrapper {
	display: flex;
	gap: 8px;

	animation: test 5s ease;
	animation-delay: 19s;

	& svg {
		fill: var(--txt-tertiary);
	}
}

.content {
	display: flex;
	flex-direction: column;
	gap: 4px;
}

@keyframes test {
	0% {
		opacity: 1;
		filter: blur(0px);
	}

	100% {
		opacity: 0;
		filter: blur(50px);
	}
}

.title {
	display: flex;
	align-items: center;
	gap: 8px;

	font-size: 15px;
	font-weight: 600;
	color: var(--txt-secondary);

	& div {
		font-family: monospace;
		text-transform: uppercase;
	}
}

.subtitle {
	font-size: 13px;
	font-weight: 600;
	color: var(--txt-tertiary);
}
</style>
