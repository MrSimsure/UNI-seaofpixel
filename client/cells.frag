// Author: @patriciogv
// Title: CellularNoise

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform float camera_x;
uniform float camera_y;

vec2 random2( vec2 p ) {
    return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;
    vec3 color = vec3(.0,0.0,(sin(u_time)*0.1)+0.5);

    // Scale
    st *= 15.;

    // Tile the space
    vec2 i_st = floor(st*15.0);
    vec2 f_st = fract(st/15.0);

	i_st.x -= camera_x/15.0;
    i_st.y -= camera_y/15.0;

    float m_dist = 0.9;  // minimun distance

    for (int y= -1; y <= 1; y++) {
        for (int x= -1; x <= 1; x++) {
            // Neighbor place in the grid
            vec2 neighbor = vec2(float(x),float(y));

            // Random position from current + neighbor place in the grid
            vec2 point = random2(i_st + neighbor);

			// Animate the point
            point = 0.5 + 0.5*sin(u_time + 3.2831*point);

			// Vector between the pixel and the point
            vec2 diff = neighbor + point - f_st;

            // Distance to the point
            float dist = length(diff);

            // Keep the closer distance
            m_dist = min(m_dist, dist);
        }
    }

    // Draw the min distance (distance field)
    color += m_dist*0.2;

    // Draw cell center
    //color += 1.-step(.02, m_dist);

  

    // Show isolines
    color -= step(.9,abs(sin(10.0*m_dist)))*.2;

    gl_FragColor = vec4(color,1.0);
}
