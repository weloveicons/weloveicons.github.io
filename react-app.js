var App = React.createClass({
    getInitialState: function() {
        return { 
            size: 10,
            stroke: 1,
            corner: 0,
            fill: false,
            color: "rgb(0,0,0)"
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
                <Preview { ...this.state } />
                <Toolbar { ...this.state } valueChanged={ this.handleValueChange } />
            </div>
        );
    }
});

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

// var icon = {
//     name: 'image',
//     viewBox: [0, 0, 45, 35],
//     elements: [
//         { element: 'rect', x: 3, y: 2, width: 39, height: 30 },
//         { element: 'circle', cx: 31.5, cy: 9.5, r: 2.5 },
//         { element: 'polyline', points: [ 3,29, 16,15, 25.5,25.5, 32.5,18.75, 42,28.5 ] }
//     ]
// }
var Element = React.createClass({
    cutoutEdges: function(points, r, closed) {
        var curves = closed ? points.length : points.length - 2;
        if (curves < 1 || r === 0) {
            return points.reduce(function(prev, curr, i) {
                return prev.concat(i > 0 ? 'L' : 'M', curr);
            }, []);
        }
        var i, p1, p2, p3, result = [], arcs;
        for (var i = 0; i < curves; i++) {
            p1 = points[i];
            p1 = { x: p1[0], y: p1[1] };
            p2 = points[(i + 1) % points.length];
            p2 = { x: p2[0], y: p2[1] };
            p3 = points[(i + 2) % points.length];
            p3 = { x: p3[0], y: p3[1] };
            arcs = PathUtils.curveCorner(p1, p2, p3, r);
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
            <svg viewBox={ this.props.icon.viewBox } >
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
            <svg viewBox={ this.props.icon.viewBox } >
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
        var elements = icons.map(function(icon) {
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
        return (
            <div className="toolbar">
                <Slider name="size" value={ this.props.size } valueChanged = { this.props.valueChanged } />
                <Slider name="stroke" value={ this.props.stroke } valueChanged = { this.props.valueChanged } />
                <Slider name="corner" value={ this.props.corner } valueChanged = { this.props.valueChanged } />
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
            <label className="topcoat-checkbox">
                { this.props.name }
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
            <div>
            <label>
                { this.props.name }
                <input type="range" min="0" max="10" value={ this.props.value } className="topcoat-range" onChange={ this.handleChange } />
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
            blackTint: 0,
            hue: 0,
            hueDragging: false,
            tintDragging: false
        }
    },
    hueToRGB: function(offset) {
        var percentage = offset * 100;
        var group = Math.floor(percentage / (100 / 6));
        var groupOffset = (percentage % (100 / 6)) / (100 / 6);
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
    currentColorString: function() {
        var color = this.hueToRGB(this.state.hue),
        color = this.tint(color, [255, 255, 255], this.state.whiteTint);
        color = this.tint(color, [0, 0, 0], this.state.blackTint);
        return this.colorString(color);
    },
    hueChange: function(event) {
        console.log(event.type);
        var offset = $(event.target).offset();
        obj = {};
        obj.hue = (event.pageY - offset.top) / 100.0;
        switch(event.type) {
            case 'mousedown':
                obj.hueDragging = true;
                break;
            case 'mouseup':
            case 'mouseout':
                obj.hueDragging = false;
                break;
            default:
                if (!this.state.hueDragging)
                    return;
        }
        this.setState(obj);
        this.handleValueChange('color', this.currentColorString());
    },
    tintChange: function(event) {
        var offset = $(event.target).offset();
        var obj = {};
        obj.whiteTint = (100 - event.pageX + offset.left) / 100.0;
        obj.blackTint = (event.pageY - offset.top) / 100.0;
        console.log(event.type);
        // switch(event.type) {
        //     case 'mousedown':
        //         obj.tintDragging = true;
        //         break;
        //     case 'mouseout':
        //     case 'mouseup':
        //         obj.tintDragging = false;
        //         break;
        //     default:
        //         if (!this.state.tintDragging) {
        //             console.log("tint dragging? ", this.state.tintDragging);
        //             return;
        //         }
        // }
        this.setState(obj);
        this.handleValueChange('color', this.currentColorString());
    },
    handleValueChange: function(name, value) {
        this.props.valueChanged(name, value);
    },
    componentDidMount: function() {
        console.log('component mounted');

    },
    divMove: function(event) {
        console.log(event.type);
    },
    render: function() {
        var hueColor = this.hueToRGB(this.state.hue),
            tintColor = this.tint(hueColor, [255, 255, 255], this.state.whiteTint);
        tintColor = this.tint(tintColor, [0, 0, 0], this.state.blackTint);
        var hueY = this.state.hue * 100;
        var points = [20, hueY, 25, hueY - 3, 25, hueY + 3];
        points = points.reduce(function(prev, curr, i) {
            prev += i % 2 ? ' ' : ',';
            prev += curr;
            return prev;
        });
        return (
            <div onMouseMove={ this.divMove }>
            <svg id="color-preview" viewBox="0 0 50 50">
                <rect x="0" y="0" height="50" width="50" fill={ this.colorString(tintColor) } />
            </svg>
            <svg id="tint" viewBox="0 0 100 100" onDragStart={ this.tintChange } onMouseMove={ this.tintChange }>
                <defs>
                    <linearGradient id="whiteTint" x1="0" x2="1" y1="0" y2="0">
                        <stop offset="0%" stopColor="white" stopOpacity="1" />
                        <stop offset="100%" stopColor="white" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="blackTint" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="black" stopOpacity="0" />
                        <stop offset="100%" stopColor="black" stopOpacity="1" />
                    </linearGradient>
                </defs>
                <rect id="background" x="0" width="100" y="0" height="100" fill={ this.colorString(hueColor) } />
                <rect x="0" width="100" y="0" height="100" fill="url(#whiteTint)" />
                <rect x="0" width="100" y="0" height="100" fill="url(#blackTint)" />
            </svg>
            <svg id="hue" viewBox="0 0 30 100">
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
                <rect x="0" y="0" height="100" width="20" fill="url(#hueBar)"
                    onMouseMove={ this.hueChange } />
                <polygon points={ points } />
            </svg>
            </div>
        );
    }
});

React.render(
    <App />
    , document.body
);
