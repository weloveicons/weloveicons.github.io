(function() {
function getTheta(x, y) {
    if (x === 0)
        return y > 0 ? Math.PI / 2 : -Math.PI / 2;
    var theta = Math.atan(y / x);
    if (x < 0)
        theta += Math.PI;
    return theta;
}

function findCurvePoints(p1, p2, p3, r) {
    var u = { x: p1.x - p2.x, y: p1.y - p2.y };
    var v = { x: p3.x - p2.x, y: p3.y - p2.y };

    var lenu = Math.sqrt(u.x * u.x + u.y * u.y);
    var lenv = Math.sqrt(v.x * v.x + v.y * v.y);

    u.x /= lenu;
    u.y /= lenu;
    v.x /= lenv;
    v.y /= lenv;

    // u dot v / |u||v|, but |u||v| = 1
    var costheta = (u.x * v.x + u.y * v.y);
    var theta = Math.acos(costheta) / 2;
    var adjacent = r / Math.tan(theta);
    var hypotenuse = Math.sqrt(adjacent * adjacent + r * r);

    // The two points along the arc
    var a1 = { x: p2.x + adjacent * u.x, y: p2.y + adjacent * u.y };
    var a2 = { x: p2.x + adjacent * v.x, y: p2.y + adjacent * v.y };

    // The centerpoint
    var w = { x: u.x + v.x, y: u.y + v.y };
    var lenw = Math.sqrt( w.x * w.x + w.y * w.y );
    w.x /= lenw;
    w.y /= lenw;

    var c = { x: p2.x + hypotenuse * w.x, y: p2.y + hypotenuse * w.y };
    return { 'a1': a1, 'a2': a2, 'c': c, 'theta': 180 - 2 * theta };
}

function curveCorner(p1, p2, p3, round) {
    var curvePoints = findCurvePoints(p1, p2, p3, round);
    var result = [], t1, t2, subcurves;

    // Sweep the smaller angle difference
    t1 = getTheta(curvePoints.a1.x - curvePoints.c.x, -(curvePoints.a1.y - curvePoints.c.y));
    t2 = getTheta(curvePoints.a2.x - curvePoints.c.x, -(curvePoints.a2.y - curvePoints.c.y));

    if (t2 - t1 > Math.PI)
        t1 += 2 * Math.PI;
    else if (t2 - t1 < -Math.PI)
        t2 += 2 * Math.PI;

    // subarcs are relative to 0,0, so get them and translate them back
    var subarcs = createArc(round, t1, t2);
    subarcs.forEach(function(arc) {
        for (var key in arc)
            arc[key] += /^x\d$/.test(key) ? curvePoints.c.x : curvePoints.c.y;
    });
    return subarcs;
}

/**
 * Create a series of arcs approximating a circular arc around (0,0)
 * with radius radius and the given startAngle and endAngle (angles
 * considered counter-clockwise from the x axis).
*/
function createArc(radius, startAngle, endAngle) {
    var twoPI = Math.PI * 2,

    startAngleN = Math.abs(startAngle) > twoPI ? startAngle % twoPI : startAngle,
    endAngleN = Math.abs(endAngle) > twoPI ? endAngle % twoPI : endAngle,

    curves = [],
    piOverTwo = Math.PI / 2.0,
    sgn = (startAngle < endAngle) ? +1 : -1, // clockwise or counterclockwise

    a1 = startAngle;

    for (var totalAngle = Math.min(twoPI, Math.abs(endAngleN - startAngleN)); totalAngle > 0.00001; ) {
        var a2 = a1 + sgn * Math.min(totalAngle, piOverTwo);
        curves.push(createSmallArc(radius, a1, a2));
        totalAngle -= Math.abs(a2 - a1);
        a1 = a2;
    }

    return curves;
}

/**
 * Cubic bezier approximation of a circular arc centered at the origin,
 * from (radians) a1 to a2, where a2 - a1 < pi / 2. The arc's radius is r.
 *
 * Returns an object with four points, where x1, y1, and x4, y4 are the arc's
 * end points and x2, y2 and x3, y3 are the cubic bezier's control points.
 *
 * This algorithm is based on teh approach described in:
 * A. Riskus, "Approximation of a cubic Bezier Curbe by Circular Arcs and Vice Versa,"
 * Information Technology and Control, 35(4) 2006 pp. 371-378.
 * 
 * create[Small]Arc translated from the original AS version by Hans Muller
 * http://hansmuller-flex.blogspot.com/2011/10/more-about-approximating-circular-arcs.html
 * Licensed under Creative Commons 3.0 by Attribution
 * http://creativecommons.org/licenses/by/3.0/
 */
function createSmallArc(r, a1, a2) {
    // be careful wrt SVG
    a1 = -a1;
    a2 = -a2;

    // compute for an arc of the same angle, but centered around the x-axis
    var
    a = (a2 - a1) / 2.0,

    x4 = r * Math.cos(a),
    y4 = r * Math.sin(a),
    x1 = x4,
    y1 = -y4,

    q1 = x1 * x1 + y1 * y1,
    q2 = q1 + x1 * x4 + y1 * y4,
    k2 = 4/3 * (Math.sqrt(2 * q1 * q2) - q2) / (x1 * y4 - y1 * x4),

    x2 = x1 - k2 * y1,
    y2 = y1 + k2 * x1,
    x3 = x2,
    y3 = -y2,

    ar = a + a1,
    cos_ar = Math.cos(ar),
    sin_ar = Math.sin(ar);

    return {
        'x1': r * Math.cos(a1),
        'y1': r * Math.sin(a1),
        'x2': x2 * cos_ar - y2 * sin_ar,
        'y2': x2 * sin_ar + y2 * cos_ar,
        'x3': x3 * cos_ar - y3 * sin_ar,
        'y3': x3 * sin_ar + y3 * cos_ar,
        'x4': r * Math.cos(a2),
        'y4': r * Math.sin(a2)
    };
}

window.PathUtils = {
    curveCorner: curveCorner
}

})();
