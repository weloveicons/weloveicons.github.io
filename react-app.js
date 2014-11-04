var App = React.createClass({
    getInitialState: function() {
        return { 
            size: 10,
            stroke: 1,
            corner: 0
         };
    },
    handleValueChange: function(name, value) {
            console.log(name, value);
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
        { element: 'polyline', points: [20,16, 20,36] },
        { element: 'polyline', points: [26,16, 26,36] },
        { element: 'polyline', points: [32,16, 32,36] },
        { element: 'polyline', points: [10,9, 42,9] },
        { element: 'rect', x: 14, y: 9, width: 25, height: 33 },
        { element: 'rect', x: 20, y: 5, width: 12, height: 4 }
    ]
},
{
    name: "Calendar",
    viewBox: [0,0,50,50],
    elements: [
        { element: 'rect', x: 7, y: 9, width: 36, height: 33 },
        { element: 'polyline', points: [7,17.5, 43,17.5] },
        { element: 'rect', x: 15, y: 24, width: 4, height: 4 },
        { element: 'rect', x: 15, y: 32, width: 4, height: 4 },
        { element: 'rect', x: 23, y: 24, width: 4, height: 4 },
        { element: 'rect', x: 23, y: 32, width: 4, height: 4 },
        { element: 'rect', x: 31, y: 24, width: 4, height: 4 },
        { element: 'rect', x: 31, y: 32, width: 4, height: 4 },
        { element: 'polyline', points: [16,4, 16,9] },
        { element: 'polyline', points: [34,4, 34,9] }
    ]
},
{
    name: "Warning",
    viewBox: [0,0,50,50],
    elements: [
        { element: 'polyline', points: [25,19, 25,34] },
        { element: 'polyline', points: [25,37.5, 25,38.5] },
        { element: 'polygon', points: [25,7, 46,43, 4,43] }
    ]
},
{
    name: "File",
    viewBox: [0,0,50,50],
    elements: [
        { element: 'polygon', points: [30,6, 39,15, 39,42, 11,42, 11,6] },
        { element: 'polyline', points: [29,6, 29,16, 39,16] }
    ]
},
{
    name: "Back",
    viewBox: [0,0,50,50],
    elements: [
        { element: 'polyline', points: [35,44, 15,24, 35,4] }
    ]
},
{
    name: "Image",
    viewBox: [0,0,50,50],
    elements: [
        { element: 'rect', x: 5, y: 9, width: 39, height: 30 },
        { element: 'polyline', points: [5,36, 18,22, 28,32.5, 35,25.75, 44,35.5] },
        { element: 'circle', cx: 34, cy: 16.5, r: 2.5 }
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
    render: function() {

        var { icon, index, element: name, x, y, cx, cy, r, width, height, corner, points, stroke: strokeWidth, ...rest } = this.props;
        var common = {
            stroke: 'blue',
            strokeWidth: strokeWidth,
            opacity: 0.5
        };
        if (points) {
            points = points.reduce(function(prev, curr, i) {
                return prev + (i % 2 == 0 ? ',' : ' ') + curr;
            });
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
                return (<polyline { ...props } { ...common } />);
            case 'polygon':
                props = { points: points };
                return (<polygon { ...props } { ...common } />);
            default:
                return (<rect x="0" y="0" width="10" height="10" opacity="0.2" fill="red"/>);
        }
    }
});

var Icon = React.createClass({
    render: function() {
        var props = this.props;
        var elements = this.props.icon.elements.map(function(element, i) {
            return (<Element { ...element } index={ i } { ...props } key={ props.icon.name + i }/>);
        });
        return (
            <svg viewBox={ this.props.icon.viewBox } >
                { elements }
            </svg>
        );
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
            </div>
        );
    }
});

var Slider = React.createClass({
    handleChange: function(event) {
        this.props.valueChanged(this.props.name, event.target.value);
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
