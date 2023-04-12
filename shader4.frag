#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;





vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

//
// Description : GLSL 2D simplex noise function
//      Author : Ian McEwan, Ashima Arts
//  Maintainer : ijm
//     Lastmod : 20110822 (ijm)
//     License :
//  Copyright (C) 2011 Ashima Arts. All rights reserved.
//  Distributed under the MIT License. See LICENSE file.
//  https://github.com/ashima/webgl-noise
//

float snoise(vec2 v) {

    // Precompute values for skewed triangular grid
    const vec4 C = vec4(0.211324865405187,
                        // (3.0-sqrt(3.0))/6.0
                        0.366025403784439,
                        // 0.5*(sqrt(3.0)-1.0)
                        -0.577350269189626,
                        // -1.0 + 2.0 * C.x
                        0.024390243902439);
                        // 1.0 / 41.0

    // First corner (x0)
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);

    // Other two corners (x1, x2)
    vec2 i1 = vec2(0.0);
    i1 = (x0.x > x0.y)? vec2(1.0, 0.0):vec2(0.0, 1.0);
    vec2 x1 = x0.xy + C.xx - i1;
    vec2 x2 = x0.xy + C.zz;

    // Do some permutations to avoid
    // truncation effects in permutation
    i = mod289(i);
    vec3 p = permute(
            permute( i.y + vec3(0.0, i1.y, 1.0))
                + i.x + vec3(0.0, i1.x, 1.0 ));

    vec3 m = max(0.5 - vec3(
                        dot(x0,x0),
                        dot(x1,x1),
                        dot(x2,x2)
                        ), 0.0);

    m = m*m ;
    m = m*m ;

    // Gradients:
    //  41 pts uniformly over a line, mapped onto a diamond
    //  The ring size 17*17 = 289 is close to a multiple
    //      of 41 (41*7 = 287)

    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;

    // Normalise gradients implicitly by scaling m
    // Approximation of: m *= inversesqrt(a0*a0 + h*h);
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0+h*h);

    // Compute final noise value at P
    vec3 g = vec3(0.0);
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * vec2(x1.x,x2.x) + h.yz * vec2(x1.y,x2.y);
    return 130.0 * dot(m, g);
}

float rand (float num) {
    return fract(sin(num)*1000.);
}

// 2D random 
float random (vec2 st) {
    return fract(sin
                 ( dot (st, vec2(-0.260,-0.190) ) )
                 *10000.);
}

float noise (in float num) {
    float i = floor(num);
    float f = fract(num);
    return mix(rand(i), rand(i + 1.0), smoothstep(0.,1.,f));
}

float noise2d (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f*f*(3.0-2.0*f);
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners percentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

float size (in float num) {

     return 4.;

}



vec3 germ (in float t, in float t2, in vec2 st, in float s, in float p) {
    vec3 g;
    
    vec2 pos = vec2(noise(t),noise(t2))-st;

    float r = length(snoise(pos)-sin(t))*size(s)*p;
    
    
   
    float a = atan(pos.y/noise(t),pos.x*noise(t));

    float f;
    
    f= (-0.6*cos(a*t*10.)*tan(a*8.640))*0.028*noise(t)+0.068;
    g = vec3( 1.-smoothstep(f*0.6,f+0.020,r) );
    
    
    // f = (-0.6*cos(a*10.)*tan(a*50.120))*0.07+0.068;
    // g = vec3( 1.-smoothstep(r,f+0.20,f*0.6) );
    
    
    return g;
}


void main()
{
	// vec4 color = texture(sTD2DInputs[0], vUV.st);
	vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;
	
	vec3 color = vec3(0.795,0.004,0.080);
	
	
	float t = u_time/5.;
    float t2 = (u_time+50.)/5.;
    vec3 total;
    
    vec2 pos = vec2(0.5)-st;

    for (int i=0;i<10;i++) { 
        vec3 germ2 = germ(t+float(i)*rand(float(i)),t2+float(i+12)*rand(float(i+1)),st,float(i)/10.,1.5);
        vec3 germ = germ(t+float(i)*rand(float(i)),t2+float(i+12)*rand(float(i+1)),st,float(i)/10.,1.);

        color = mix(color,vec3(0.995,0.280,0.194),germ*1.);
        color = mix(color,vec3(0.285,0.056,0.007),germ2*1.);
    
    }

    
    
	vec4 color1 = vec4(color,1.);
	
	gl_FragColor = (color1);
}

