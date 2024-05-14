import * as Three from "three"

export const getFresnelMat = () => {
	const uniforms = {
		color1: { value: new Three.Color("#fff") },
		color2: { value: new Three.Color(0x000000) },
		fresnelBias: { value: 0.1 },
		fresnelScale: { value: 0.2 },
		fresnelPower: { value: 5.0 },
	}

	const vs = `
  uniform float fresnelBias;
  uniform float fresnelScale;
  uniform float fresnelPower;
  
  varying float vReflectionFactor;
  
  void main() {
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
  
    vec3 worldNormal = normalize( mat3( modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz ) * normal );
  
    vec3 I = worldPosition.xyz - cameraPosition;
  
    vReflectionFactor = fresnelBias + fresnelScale * pow( 1.0 + dot( normalize( I ), worldNormal ), fresnelPower );
  
    gl_Position = projectionMatrix * mvPosition;
  }
  `
	const fs = `
  uniform vec3 color1;
  uniform vec3 color2;
  
  varying float vReflectionFactor;
  
  void main() {
    float f = clamp( vReflectionFactor, 0.0, 1.0 );
    gl_FragColor = vec4(mix(color2, color1, vec3(f)), f);
  }
  `

	return new Three.ShaderMaterial({
		uniforms: uniforms,
		vertexShader: vs,
		fragmentShader: fs,
		transparent: true,
		blending: Three.AdditiveBlending,
	})
}
