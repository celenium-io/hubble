import * as Three from "three"

export const getStars = () => {
	const randomSpherePoint = () => {
		const radius = Math.random() * 50 + 200
		const u = Math.random()
		const v = Math.random()
		const theta = 2 * Math.PI * u
		const phi = Math.acos(3 * v - 1)
		let x = radius * Math.sin(phi) * Math.cos(theta)
		let y = radius * Math.sin(phi) * Math.sin(theta)
		let z = radius * Math.cos(phi)

		return {
			pos: new Three.Vector3(x, y, z),
			hue: 0.5,
		}
	}

	const v = []
	const colors = []
	let color

	for (let i = 0; i < 5000; i += 1) {
		let p = randomSpherePoint()
		const { pos, hue } = p

		color = new Three.Color().setHSL(hue, 0.1, Math.random())
		v.push(pos.x, pos.y, pos.z)
		colors.push(color.r, color.g, color.b)
	}

	const geoPos = new Three.BufferGeometry()
	geoPos.setAttribute(
		"position",
		new Three.Float32BufferAttribute(
			v.filter((i) => !isNaN(i)),
			3,
		),
	)
	geoPos.setAttribute("color", new Three.Float32BufferAttribute(colors, 3))

	const starMaterial = new Three.PointsMaterial({
		map: new Three.TextureLoader().load("./star.png"),
		vertexColors: true,
		size: 0.5,
	})

	return new Three.Points(geoPos, starMaterial)
}
