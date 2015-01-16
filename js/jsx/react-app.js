var icons = [
{
    name: "Trash",
    viewBox: [0,0,50,50],
    elements: [
        { element: 'polyline', role: 'accent', points: [[20,16], [20,36]] },
        { element: 'polyline', role: 'accent', points: [[26,16], [26,36]] },
        { element: 'polyline', role: 'accent', points: [[32,16], [32,36]] },
        { element: 'polyline', points: [[10,9], [42,9]] },
        { element: 'polyline', fill: 'solid', points: [[14,9], [14,42], [39,42], [39,9]] },
        { element: 'polyline', fill: 'solid', points: [[20,9], [20,5], [32,5], [32,9]] }
    ]
},
{
    name: "Calendar",
    viewBox: [0,0,50,50],
    elements: [
        { element: 'rect', x: 7, y: 9, width: 36, height: 33 },
        { element: 'polyline', role: 'accent', points: [[7,17.5], [43,17.5]] },
        { element: 'rect', role: 'accent', maxStroke: '3', x: 15, y: 24, width: 4, height: 4 },
        { element: 'rect', role: 'accent', maxStroke: '3', x: 15, y: 32, width: 4, height: 4 },
        { element: 'rect', role: 'accent', maxStroke: '3', x: 23, y: 24, width: 4, height: 4 },
        { element: 'rect', role: 'accent', maxStroke: '3', x: 23, y: 32, width: 4, height: 4 },
        { element: 'rect', role: 'accent', maxStroke: '3', x: 31, y: 24, width: 4, height: 4 },
        { element: 'rect', role: 'accent', maxStroke: '3', x: 31, y: 32, width: 4, height: 4 },
        { element: 'polyline', fill: 'none', points: [[16,4], [16,9]] },
        { element: 'polyline', fill: 'none', points: [[34,4], [34,9]] }
    ]
},
{
    name: "Warning",
    viewBox: [0,0,50,50],
    elements: [
        { element: 'polyline', role: 'accent', points: [[25,19], [25,34]] },
        { element: 'polyline', role: 'accent', points: [[25,37.5], [25,38.5]] },
        { element: 'polygon', points: [[25,7], [46,43], [4,43]] }
    ]
},
{
    name: "File",
    viewBox: [0,0,50,50],
    elements: [
        { element: 'polygon', points: [[30,6], [39,15], [39,42], [11,42], [11,6]] },
        { element: 'polyline', role: 'accent', fill: 'none', points: [[29,6], [29,16], [39,16]] }
    ]
},
{
    name: "Back",
    viewBox: [0,0,50,50],
    elements: [
        { element: 'polyline', fill: 'none', points: [[35,44], [15,24], [35,4]] }
    ]
},
{
    name: "Image",
    viewBox: [0,0,50,50],
    elements: [
        { element: 'rect', x: 5, y: 9, width: 39, height: 30 },
        { element: 'polyline', role: 'accent', fill: 'none', points: [[5,36], [18,22], [28,32.5], [35,25.75], [44,35.5]] },
        { element: 'circle', role: 'accent', maxStroke: '3', cx: 34, cy: 16.5, r: 2.5 }
    ]
}];

var App = React.createClass({
    getInitialState: function() {
        return { 
            size: 50,
            stroke: 1,
            corner: 0,
            fill: false,
            color: "rgb(0,0,0)",
            "icons": icons
         };
    },
    handleValueChange: function(name, value) {
            var obj = {};
            obj[name] = value;
            this.setState(obj);
    },
    render: function() {
        return (
            <div className="app">
                <div className="app-main">
                    <Preview { ...this.state } />
                    <Toolbar { ...this.state } valueChanged={ this.handleValueChange } />
                </div>
                <FilePicker { ...this.state } valueChanged={ this.handleValueChange } />
            </div>
        );
    }
});

var Popup = React.createClass({
    getInitialState: function() {
        return {
            visible: false
        }
    },
    close: function() {
        this.setState({ visible: false });
    },
    render: function() {
        return (
            <div className='popup visible'>
            <h3 className='logotype'>we <img className="logo" src="resources/logo.svg" /><br/>
            icons</h3>
            <div className='content'>
                <p>Dear Customer,</p>
                <p>We are working to make this site as functional as possible, but we are still in the very early stages.</p>
                <p>As such, upload will only work with SVG files in a [0, 0, 50, 50] coordinate system, and will only work with polygons, polylines, circles, and rectangles (no paths!).</p>
                <p>Additionally, elements in a group (&lt;g&gt;) will be treated as contrast details (they will punch out the fill color in a filled icon).</p>
                <p>~The Team</p>
            </div>
            <div className='buttons'>
                <button className='topcoat-button cancel' onClick={ this.close() }>Cancel</button>
                <button className='topcoat-button ok'>OK</button>
            </div>
            </div>
        );
    }
});

var FilePicker = React.createClass({
    processElement: function(element) {
        var result = { element: element.tagName };
        var temp, i;
        switch(element.tagName) {
            case 'polyline':
                // polyline points is a list of comma separated numbers
                temp = element.style.fill;
                result.fill = temp && temp.length ? "solid" : "none";
                temp = element.getAttribute('points');
                temp = temp.split(',');
                temp = temp.map(function(num) { return Number(num); });
                result.points = [];
                for (i = 0; i < temp.length - 1; i += 2)
                    result.points.push([temp[i], temp[i+1]]);
                break;
            case 'polygon':
                // polygon points is a list of space separated comma separated pairs
                temp = element.getAttribute('points');
                temp = temp.split(' ');
                temp = temp.map(function(pair) { return pair.split(','); });
                result.points = temp;
                result.points = result.points.map(function(pair) {
                    return [ Number(pair[0]), Number(pair[1]) ];
                });
                break;
            case 'rect':
                result.x = Number(element.getAttribute('x'));
                result.y = Number(element.getAttribute('y'));
                result.width = Number(element.getAttribute('width'));
                result.height = Number(element.getAttribute('height'));
                break;
            case 'circle':
                result.cx = Number(element.getAttribute('cx'));
                result.cy = Number(element.getAttribute('cy'));
                result.r = Number(element.getAttribute('r'));
                break;
            default:
                console.warning("Unsupported SVG element type ", element.tagName);
                return null;
        }
        if (element.parentNode.tagName === 'g')
            result.role = 'accent';
        return result;
    },
    processIcon: function(name, svg) {
        // { name: "", viewBox: [4], elements: [ { } ]}
        // { element: "rectangle", x: #, y: #, width: #, height: # }
        // { element: "circle", cx: #, cy: #, r: # }
        // { element: "polygon", points: [[2]] }
        // { element: "polyline", points: [[2]] }
        // optional: role="accent", fill="none"
        name = name.replace(/\.\s\S+$/, '');
        svg = svg.replace(/^[\s\S]*(<svg)/i, "$1");
        var result = { name: name, viewBox: [0, 0, 50, 50], elements: [] };
        var div = document.createElement("div");
        div.innerHTML = svg;
        svg = div.querySelector("svg");
        var elements = svg.querySelectorAll("circle, rect, polyline, polygon");
        for (var i = 0; i < elements.length; i++) {
            var element = this.processElement(elements[i]);
            if (element)
                result.elements.push(element);
        }
        return result;
    },
    filesPicked: function(event) {
        var files = event.target.files,
        file, i, reader;
        if (files.length < 1)
            return;
        var newIcons = [], loads = files.length, outer = this;
        for (i = 0; i < files.length; i++) {
            file = files[i];
            if (file.type != 'image/svg+xml') {
                loads--;
                continue;
            }
            reader = new FileReader();
            reader.onload = (function(file, model) {
                return function(e) {
                    var result = e.target.result;
                    result = outer.processIcon(file.name, result);
                    newIcons.push(result);
                    loads--;
                    if (loads === 0)
                        outer.props.valueChanged("icons", newIcons);
                };
            })(file, this.model);
            reader.readAsText(file);
        }
    },
    close: function() { this.setState( { visible: false } ); },
    open: function() { this.setState( { visible: true } ); },
    getInitialState: function() { return { visible: false }; },
    render: function() {
        return (
            <div>
                <button className='topcoat-button--large--cta' onClick={ this.open } >Upload Files&hellip;</button>
                <div className={ 'popup ' + (this.state.visible ? 'visible' : 'hidden') }>
                    <h3 className='logotype'>we <img className="logo" src="resources/logo.svg" /><br/>
                    icons</h3>
                    <div className='content'>
                        <p>Dear Customer,</p>
                        <p>We are working to make this site as functional as possible, but we are still in the very early stages.</p>
                        <p>As such, upload will only work with SVG files in a [0, 0, 50, 50] coordinate system, and will only work with polygons, polylines, circles, and rectangles (no paths!).</p>
                        <p>Additionally, elements in a group (&lt;g&gt;) will be treated as contrast details (they will punch out the fill color in a filled icon).</p>
                        <p>~The Team</p>
                    </div>
                    <div className='buttons'>
                        <button className='topcoat-button cancel' onClick={ this.close }>Cancel</button>
                        <div className='topcoat-button ok'>
                            OK
                            <input type='file' name='files[]' id='picker' multiple onChange={ this.filesPicked } />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

function distance(p1, p2) {
    var dx = p2.x - p1.x,
        dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function clampR(p1, p2, p3, r) {
    var d = Math.min(distance(p1, p2), distance(p2, p3));
    d /= 2;
    return Math.min(d, r);
}

var Element = React.createClass({
    cutoutEdges: function(points, r, closed) {
        var curves = closed ? points.length : points.length - 2;
        if (curves < 1 || r === 0) {
            return points.reduce(function(prev, curr, i) {
                return prev.concat(i > 0 ? 'L' : 'M', curr);
            }, []);
        }
        var i, p1, p2, p3, result = [], clampedR, arcs;
        for (var i = 0; i < curves; i++) {
            p1 = points[i];
            p1 = { x: p1[0], y: p1[1] };
            p2 = points[(i + 1) % points.length];
            p2 = { x: p2[0], y: p2[1] };
            p3 = points[(i + 2) % points.length];
            p3 = { x: p3[0], y: p3[1] };
            clampedR = clampR(p1, p2, p3, r);
            arcs = PathUtils.curveCorner(p1, p2, p3, clampedR);
            arcs.forEach(function(arc, j) {
                if (j === 0)
                    result.push(closed && !i ? 'M' : 'L', arc.x1, arc.y1);
                result.push('C', arc.x2, arc.y2, arc.x3, arc.y3, arc.x4, arc.y4);
            });
        }
        if (closed) {
            result.push('Z');
        } else {
            result.unshift('M', points[0][0], points[0][1]);
            result.push('L', points[points.length - 1][0], points[points.length - 1][1]);
        }
        return result;
    },
    render: function() {

        var { icon, index, element: name, x, y, cx, cy, r, width, height, corner, points, strokeWidth, stroke, fill, opacity, ...rest } = this.props;
        var common = {
            stroke: stroke,
            strokeWidth: strokeWidth,
            opacity: opacity,
            fill: fill
        };
        if (points && corner) {
            points = this.cutoutEdges(points, corner, name === "polygon");
            points = points.join(' ');
            name = 'path';
        }
        var props;

        switch(name) {
            case 'rect':
                props = { x: x, y: y, width: width, height: height, rx: corner, ry: corner };
                return (<rect { ...props } { ...common } />);
            case 'circle':
                props = { cx: cx, cy: cy, r: r };
                return (<circle { ...props } { ...common }/>);
            case 'polyline':
                props = { points: points };
                return (<polyline { ...common } { ...props } />);
            case 'polygon':
                props = { points: points };
                return (<polygon { ...props } { ...common } />);
            case 'path':
                props = { d: points };
                return (<path { ...props} { ...common } />);
            default:
                return (<rect x="0" y="0" width="10" height="10" opacity="0.2" fill="red"/>);
        }
    }
});

var Icon = React.createClass({
    getStyle: function() {
        return {
            width: this.props.size + 'px',
            height: this.props.size + 'px'
        }
    },
    renderFilled: function() {
        var props = this.props, settings;
        var mask = props.icon.elements.map(function(element, i) {
            if (element.role !== "accent")
                return;
            settings = {
                stroke: props.color,
                fill: "none",
                opacity: "1",
                strokeWidth: props.stroke
            };
            if (element.maxStroke && props.stroke >= element.maxStroke) {
                settings.stroke = "none";
                settings.fill = props.color;
            }
            return (<Element { ...element } { ...props } key={ props.icon.name + i } { ...settings }  />);
        });
        var elements = props.icon.elements.map(function(element, i) {
            if (element.role === "accent")
                return;
            return (<Element { ...element } index={ i } { ...props } key={ props.icon.name + i } strokeWidth={ props.stroke } stroke={ props.color } fill={ element.fill === "none" ? "none" : props.color } opacity="1" />);
        });
        return (
            <svg viewBox={ this.props.icon.viewBox } style={ this.getStyle() }>
                <defs>
                    <mask id={ props.icon.name + '-mask' }>
                        <rect x="0" y="0" width="50" height="50" fill="white" />
                        { mask }
                    </mask>
                </defs>
                <g style={{ mask: "url(#" + props.icon.name + "-mask)" }}>
                    { elements }
                </g>
            </svg>
        );
    },
    renderStroked: function() {
        var props = this.props;
        var elements = props.icon.elements.map(function(element, i) {
           return (<Element { ...element } index={ i } { ...props } key={ props.icon.name + i } strokeWidth={ props.stroke } stroke={ props.color } fill="none" opacity="1" />); 
        });
        return (
            <svg viewBox={ this.props.icon.viewBox } style={ this.getStyle() }>
                { elements }
            </svg>
        );
    },
    render: function() {
        if (this.props.fill)
            return this.renderFilled();
        return this.renderStroked();
    }
});

var Preview = React.createClass({
    render: function() {
        var props = this.props;
        var elements = props.icons.map(function(icon) {
            return (<Icon icon={ icon } {...props } key={ icon.name }/>);
        });
        return (
            <div className="preview">
                { elements }
            </div>
        );
    }
});

var Toolbar = React.createClass({
    render: function() {
        var sliders = [
            {
                key: "size",
                min: 20,
                max: 100,
                value: this.props.size
            },
            {
                key: "stroke",
                min: 1,
                max: 6,
                value: this.props.stroke
            },
            {
                key: "corner",
                min: 0,
                max: 8,
                value: this.props.corner
            }
        ];
        var outer = this;
        sliders = sliders.map(function(slider) {
            return (<Slider name={ slider.key } key={ slider.key } value={ slider.value } min={ slider.min } max={ slider.max } valueChanged={ outer.props.valueChanged } />);
        });
        return (
            <div className="toolbar">
                { sliders }
                <Checkbox name="fill" value={ this.props.fill } valueChanged = { this.props.valueChanged } />
                <ColorPicker name="color-picker" valueChanged = { this.props.valueChanged } />
            </div>
        );
    }
});

var Checkbox = React.createClass({
    handleChange: function(event) {
        this.props.valueChanged(this.props.name, event.target.checked);
    },
    render: function() {
        return (
            <div>
            <label className="topcoat-checkbox checkbox-widget">
                <span className="label">{ this.props.name }</span>
                <input type="checkbox" name={ this.props.name } checked={ this.props.value } onChange={ this.handleChange } />
                <div className="topcoat-checkbox__checkmark"></div>
            </label>
            </div>
        );
    }
});

var Slider = React.createClass({
    handleChange: function(event) {
        this.props.valueChanged(this.props.name, Number(event.target.value));
    },
    render: function() {
        return (
            <div className="slider-widget">
            <label>
                <span className="label">{ this.props.name }</span>
                <input type="range" min={ this.props.min } max={ this.props.max } value={ this.props.value } className="topcoat-range" onChange={ this.handleChange } />
                <input type="text" value={ this.props.value } className="topcoat-text-input" onChange={ this.handleChange } />
            </label>
            </div>
        );
    }
});

var ColorPicker = React.createClass({
    getInitialState: function() {
        return {
            whiteTint: 0,
            blackTint: 1,
            hue: 0,
            hueDragging: false,
            tintDragging: false,
            visible: false
        }
    },
    hueToRGB: function(offset) {
        var group = Math.floor(offset * 6);
        var groupOffset = offset * 6 - group;
        var color = [0, 0, 0];
        switch (group) {
            case 0:
                color = [255, groupOffset * 255, 0];
                break;
            case 1:
                color = [(1 - groupOffset) * 255, 255, 0];
                break;
            case 2:
                color = [0, 255, groupOffset * 255];
                break;
            case 3:
                color = [0, (1 - groupOffset) * 255, 255];
                break;
            case 4:
                color = [255 * groupOffset, 0, 255];
                break;
            case 5:
                color = [255, 0, (1 - groupOffset) * 255];
                break;
            default: break;
        }
        color = color.map(Math.round);
        return color;
    },
    tint: function(color, tint, p) {
        var composite = color.slice(0);
        for (var i = 0; i < composite.length; i++) {
            composite[i] = color[i] * (1 - p) + tint[i] * p;
        }
        return composite;
    },
    colorString: function(color) {
        color = color.map(Math.round);
        return "rgb(" + color.join(',') + ")";
    },
    hexString: function() {
        var color = this.hueToRGB(this.state.hue);
        color = this.tint(color, [255, 255, 255], this.state.whiteTint);
        color = this.tint(color, [0, 0, 0], this.state.blackTint);
        color = color.map(function(number) {
            var result = Number(Math.round(number)).toString(16);
            if (result.length < 2) result = "0" + result;
            return result;
        });
        return color.join("");
    },
    currentColorString: function() {
        var color = this.hueToRGB(this.state.hue),
        color = this.tint(color, [255, 255, 255], this.state.whiteTint);
        color = this.tint(color, [0, 0, 0], this.state.blackTint);
        return this.colorString(color);
    },
    clamp: function(value, min, max) {
        if (value < min) return min;
        if (value > max) return max;
        return value;
    },
    hueDragStart: function() { this.setState({ hueDragging: true })},
    hueDragEnd: function() { this.setState({ hueDragging: false })},
    hueChange: function(event) {
        var offset = $(event.target).offset();
        obj = {};
        obj.hue = (event.pageY - offset.top) / 100.0;
        obj.hue = this.clamp(obj.hue, 0, 1);
        this.setState(obj);
        this.handleValueChange('color', this.currentColorString());
    },
    tintDragStart: function() { this.setState({ tintDragging: true })},
    tintDragEnd: function() { this.setState({ tintDragging: false })},
    tintChange: function(event) {
        var offset = $(event.target).offset();
        var obj = {};
        obj.whiteTint = (100 - event.pageX + offset.left) / 100.0;
        obj.whiteTint = this.clamp(obj.whiteTint, 0, 1);
        obj.blackTint = (event.pageY - offset.top) / 100.0;
        obj.blackTint = this.clamp(obj.blackTint, 0, 1);
        this.setState(obj);
        this.handleValueChange('color', this.currentColorString());
    },
    handleValueChange: function(name, value) {
        this.props.valueChanged(name, value);
    },
    handleStringChange: function(event) {
        var color = event.target.value;
        if (!/^[a-f0-9]{6}$/i.test(color))
            return;
        color = color.match(/[a-f0-9]{2}/ig);
        color = color.map(function(number) {
            return Number.parseInt(number, 16);
        });
        var max = color[0], min = color[1], maxi = 0, mini = 1;
        color.forEach(function(component, i) {
            if (component > max) {
                max = component;
                maxi = i;
            }
            if (component < min) {
                min = component;
                mini = i;
            }
        });
        var midi = (mini === (maxi + 1) % 3) ? (maxi + 2) % 3 : (maxi + 1) % 3;
        // if min === max, you're a gray
        var w = (max) / (max + min);
        var b = (max + min) / 255;
        var hue = [0, 0, 0];
        hue[maxi] = 255;
        hue[midi] = Math.round(color[midi] - 255 * b * (1 - w)) / (b * w);
        var huePeak = (maxi) / 3.0;
        var hueOffset = ((maxi + 1) % 3 === midi) ? hue[midi] : -hue[midi];
        hueOffset = hueOffset / 255.0 / 6.0;
        hue = huePeak + hueOffset;
        if (hue < 0) hue += 1;
        this.setState({ hue: hue, whiteTint: 1 - w, blackTint: 1 - b });
    },
    toggleVisibility: function(event) {
        this.setState({ visible: !this.state.visible });
    },
    flattenPoints: function(points) {
        return points.reduce(function(prev, curr, i) {
            prev += i % 2 ? ' ' : ',';
            prev += curr;
            return prev;
        });
    },
    render: function() {
        var hueColor = this.hueToRGB(this.state.hue),
            tintColor = this.tint(hueColor, [255, 255, 255], this.state.whiteTint);
        tintColor = this.tint(tintColor, [0, 0, 0], this.state.blackTint);
        var hueY = this.state.hue * 100;
        var width = 8, height = 4;
        var lpoints = [10, hueY, 10 - width, hueY - height, 10 - width, hueY + height],
            rpoints = [30, hueY, 30 + width, hueY - height, 30 + width, hueY + height];
        lpoints = this.flattenPoints(lpoints);
        rpoints = this.flattenPoints(rpoints);
        return (
            <div className='color-widget'>
                <span className='label'>color</span>
                <div className='color-preview'>
                    <div className='swatch' style={{ background: this.colorString(tintColor) }} onClick={ this.toggleVisibility } ref='swatch'>
                    </div>
                </div>
                <div className={ 'color-popup ' + (this.state.visible ? 'color-popup-visible' : 'color-popup-hidden') }
                    ref='popup'>
                    <svg id="tint" viewBox="0 0 100 100" onClick={ this.tintChange } onMouseDown={ this.tintDragStart } onMouseUp={ this.tintDragEnd } onMouseMove={ this.state.tintDragging ? this.tintChange : null }>
                        <defs>
                            <linearGradient id="whiteTint" x1="0" x2="1" y1="0" y2="0">
                                <stop offset="0%" stopColor="white" stopOpacity="1" />
                                <stop offset="100%" stopColor="white" stopOpacity="0" />
                            </linearGradient>
                            <linearGradient id="blackTint" x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" stopColor="black" stopOpacity="0" />
                                <stop offset="100%" stopColor="black" stopOpacity="1" />
                            </linearGradient>
                            <mask id="focus-mask">
                                <rect x="0" y="0" width="100" height="100" fill="white" />
                                <circle cx={ (1 - this.state.whiteTint) * 100 } cy={ this.state.blackTint * 100 } r="10" stroke="black" strokeWidth="2" fill="white"/>
                            </mask>
                        </defs>
                        <g style={{ mask: "url(#focus-mask)" }}>
                            <rect id="background" x="0" width="100" y="0" height="100" fill={ this.colorString(hueColor) } />
                            <rect x="0" width="100" y="0" height="100" fill="url(#whiteTint)" />
                            <rect x="0" width="100" y="0" height="100" fill="url(#blackTint)" />
                        </g>
                    </svg>
                    <svg id="hue-frame" viewBox="0 0 40 100">
                        <svg id="hue" x="10" width="20" height="100" viewBox="0 0 20 100" onClick={ this.hueChange } onMouseDown={ this.hueDragStart } onMouseUp={ this.hueDragEnd } onMouseMove={ this.state.hueDragging ? this.hueChange : null }>
                            <defs>
                                <linearGradient id="hueBar" x1="0" x2="0" y1="0" y2="1" >
                                    <stop offset="0%" stopColor="#ff0000" />
                                    <stop offset="16.67%" stopColor="#ffff00" />
                                    <stop offset="33.33%" stopColor="#00ff00" />
                                    <stop offset="50%" stopColor="#00ffff" />
                                    <stop offset="66.67%" stopColor="#0000ff" />
                                    <stop offset="83.33%" stopColor="#ff00ff" />
                                    <stop offset="100%" stopColor="#ff0000" />
                                </linearGradient>
                            </defs>
                            <rect x="0" y="0" height="100" width="20" fill="url(#hueBar)" />
                        </svg>
                        <polygon points={ lpoints } />
                        <polygon points={ rpoints } />
                    </svg>
                    <label>
                        #: 
                        <input type="text" className="topcoat-text-input" value={ this.hexString() } onChange={ this.handleStringChange } />
                    </label>
                </div>
            </div>
        );
    }
});

React.render(
    <App />
    , document.querySelector('.app-container')
);
