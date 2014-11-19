var App = React.createClass({
    getInitialState: function() {
        return { 
            size: 10,
            stroke: 1,
            corner: 0,
            fill: false
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
        { element: 'rect', x: 14, y: 9, width: 25, height: 33 },
        { element: 'rect', x: 20, y: 5, width: 12, height: 4 }
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
        { element: 'polyline', points: [[16,4], [16,9]] },
        { element: 'polyline', points: [[34,4], [34,9]] }
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
        { element: 'polyline', role: 'accent', points: [[29,6], [29,16], [39,16]] }
    ]
},
{
    name: "Back",
    viewBox: [0,0,50,50],
    elements: [
        { element: 'polyline', points: [[35,44], [15,24], [35,4]] }
    ]
},
{
    name: "Image",
    viewBox: [0,0,50,50],
    elements: [
        { element: 'rect', x: 5, y: 9, width: 39, height: 30 },
        { element: 'polyline', role: 'accent', points: [[5,36], [18,22], [28,32.5], [35,25.75], [44,35.5]] },
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
                props = { points: points, fill: 'none' };
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
                stroke: "black",
                fill: "none",
                opacity: "1",
                strokeWidth: props.stroke
            };
            if (element.maxStroke && props.stroke >= element.maxStroke) {
                settings.stroke = "none";
                settings.fill = "black";
            }
            return (<Element { ...element } { ...props } key={ props.icon.name + i } { ...settings }  />);
        });
        var elements = props.icon.elements.map(function(element, i) {
            if (element.role === "accent")
                return;
            return (<Element { ...element } index={ i } { ...props } key={ props.icon.name + i } strokeWidth={ props.stroke } stroke="black" fill="black" opacity="1" />);
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
           return (<Element { ...element } index={ i } { ...props } key={ props.icon.name + i } strokeWidth={ props.stroke } stroke="black" fill="none" opacity="1" />); 
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

React.render(
    <App />
,
document.body
);
