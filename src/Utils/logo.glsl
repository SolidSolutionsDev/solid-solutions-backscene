#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359
#define TWO_PI 6.28318530718

const int MAX_STEPS = 32;
const float PRECISION = 0.1;
const float MAX_DISTANCE = 99999.;
const int SPHERE_COUNT = 8;

uniform float u_time;       // Time in seconds since load
uniform vec2 u_resolution;  // Canvas size (width,height)

vec3 diffuseLight (vec3 lightPosition, vec3 lightColor, vec3 point, vec3 normal) {
    vec3 lightDirection = normalize(lightPosition - point);
    float diff = max(dot(normal, lightDirection), 0.01); 
    return lightColor * diff;
}

vec3 fog (vec3 rgb, float d, vec3 fogColor) {
    float fogAmount = .5 - exp( -d * 0.03) * 1.;
    return mix(rgb, fogColor, fogAmount);
}

mat3 rotX (float angle) {
    return mat3(
        vec3(1., 0., 0.),
        vec3(0., cos(angle), -sin(angle)),
        vec3(0., sin(angle), cos(angle))
    );
}

mat3 rotY (float angle) {
    return mat3(
        vec3(cos(angle), 0., sin(angle)),
        vec3(0., 1., 0.),
        vec3(-sin(angle), 0., cos(angle))
    );
}

mat3 rotZ (float angle) {
    return mat3(
        vec3(cos(angle), -sin(angle), 0.),
        vec3(sin(angle), cos(angle), 0.),
        vec3(0., 0., 1.)
    );
}

float rand (float seed) {
    return .1 + fract(sin(seed) * 2048.);
}

float randSignal (float seed){
    float r = rand(seed);

    if (r > .5) {
        return 1.;
    } else {
        return -1.;
    }
}

float sdSphere (vec3 point, vec3 position, float radius) {
    return distance(point, position) - radius;
}

float sdBox (vec3 point, vec3 position, vec3 b) {
  vec3 q = abs(point - position) - b;
  return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
}

float opSmoothUnion (float distance1, float distance2, float amount) {
    float h = clamp(0.5 + 0.5 * (distance2 - distance1) / amount, 0., 1.);
    return mix(distance2, distance1, h) - amount * h * (1. - h); 
}

float spheresMap (vec3 point) {
     vec3 center = vec3(0., 0., 0.);

    float d = 99999.;

    float sphereRand, sphereSpeed, sphereRadius;
    vec3 spherePos;
    for (int i = 0; i < SPHERE_COUNT; i++) {
        sphereRand = rand(float(i)) + rand(float(i-1));
        sphereSpeed = 1. / sphereRand;
        sphereRadius = (1. - sphereRand * sin(u_time) * cos(u_time * sphereRand));
        spherePos = vec3(center.x + sin(u_time * sphereRand *  - randSignal(sphereRand) * .4), center.y  + sin(u_time * sphereRand*  + randSignal(sphereRand) * 2.4), center.z  + sin(u_time * sphereRand / .3) *  - randSignal(sphereRand) * 1.);

        d = opSmoothUnion(d, sdSphere(point, spherePos, sphereRadius), 1.);
    }

    return d;
}

float cubeMap (vec3 point) {
    vec3 center = vec3(0., 0., 0.);

    return sdBox(point, center, vec3(1.6));
}

float map (vec3 point) {
    vec3 transformedPoint = (point + vec3(0., 0., 10.)) * rotX(u_time) * rotY(u_time) * rotZ(u_time);
    return opSmoothUnion(spheresMap(transformedPoint), cubeMap(transformedPoint), .4);
}

vec3 mainColor (vec3 point, vec3 normal, float totalDistance) {
    return (normal * 0.2 +
        diffuseLight(vec3(10., 0., 10.), vec3(.3, .4, 1.), point, normal) * 0.7 +
        diffuseLight(vec3(-10., 0., 10.), vec3(1., .4, .3), point, normal) * 0.3);
}

vec3 background (vec3 rayOrigin, vec3 rayDirection) {
    return vec3( .0);
}


vec3 estimateNormal (vec3 p) {
    float EPSILON = 0.0005;
    
    return normalize(vec3(
        map(vec3(p.x + EPSILON, p.y, p.z)) - map(vec3(p.x - EPSILON, p.y, p.z)),
        map(vec3(p.x, p.y + EPSILON, p.z)) - map(vec3(p.x, p.y - EPSILON, p.z)),
        map(vec3(p.x, p.y, p.z  + EPSILON)) - map(vec3(p.x, p.y, p.z - EPSILON))
    ));
}

vec3 castRay (vec3 rayOrigin, vec3 rayDirection) {
	float stepSize, totalDistance = 1.;

    vec4 previousPassColor = vec4(0.);
    
    for (int i = 0; i < MAX_STEPS; i++) {
		stepSize = map(rayOrigin + rayDirection * totalDistance);
        
        totalDistance += stepSize;
        
        if (stepSize < PRECISION) {
        	vec3 intersectionPoint = rayOrigin + rayDirection * totalDistance;
            vec3 intersectionPointNormal = estimateNormal(intersectionPoint);
            
            return mainColor(
                intersectionPoint, 
                intersectionPointNormal, 
                totalDistance
            );
        };
    }
    
    return background(rayOrigin, rayDirection);
}

void main() {
    vec3 rayOrigin = vec3(0., 0., 1.);
	vec2 vUv = gl_FragCoord.xy/u_resolution.xy;
    vec2 q = (vUv.xy * u_resolution.xy - .5 * u_resolution.xy) / u_resolution.y;
    vec3 rayDirection = normalize(vec3(q, 0.) - rayOrigin);

    gl_FragColor = vec4(castRay(rayOrigin, rayDirection), 1.0);
    
}
